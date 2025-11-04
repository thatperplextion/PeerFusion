const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

async function run() {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
  });

  try {
    console.log('Connecting to DB...');
    await pool.query('SELECT 1');

    console.log('Creating tables (if missing) from init.sql');
    const initSql = fs.readFileSync(require('path').resolve(__dirname, '..', 'src', 'database', 'init.sql'), 'utf8');
    await pool.query(initSql);

    const password = 'demo1234';
    const hash = await bcrypt.hash(password, 12);

    console.log('Inserting demo user...');
    const insertUser = `
      INSERT INTO users (email, password_hash, first_name, last_name, is_verified, is_active)
      VALUES ($1, $2, $3, $4, true, true)
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
      RETURNING id`;

    const resUser = await pool.query(insertUser, ['demo@peerfusion.local', hash, 'Demo', 'User']);
    const userId = resUser.rows[0].id;
    console.log('Demo user id:', userId, 'password:', password);

    const skills = [
      { name: 'Data Analysis', category: 'technical', description: 'Statistical analysis and data visualization' },
      { name: 'LaTeX', category: 'technical', description: 'Document preparation for academic papers' }
    ];

    for (const s of skills) {
      const r = await pool.query(
        `INSERT INTO skills (name, category, description) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING RETURNING id`,
        [s.name, s.category, s.description]
      );
      const skillId = r.rows[0] ? r.rows[0].id : (await pool.query('SELECT id FROM skills WHERE name = $1', [s.name])).rows[0].id;
      console.log('Upserted skill:', s.name, 'id:', skillId);

      // link demo user to first skill
      if (s.name === 'Data Analysis') {
        await pool.query(
          `INSERT INTO user_skills (user_id, skill_id, proficiency_level, skill_type) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, skill_id, skill_type) DO NOTHING`,
          [userId, skillId, 4, 'offering']
        );
        console.log('Linked demo user to skill:', s.name);
      }
    }

    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seed failed:', err.message || err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

run();
