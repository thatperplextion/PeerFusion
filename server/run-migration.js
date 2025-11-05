const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'peerfusion_user',
      password: 'peerfusion_password',
      database: 'peerfusion_db',
      multipleStatements: true
    });

    console.log('📦 Running LinkedIn features migration...\n');

    // Read the migration file
    const migrationPath = path.join(__dirname, 'src', 'database', 'migrations', '003_add_linkedin_features.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Execute the migration
    await conn.query(sql);

    console.log('✓ Migration completed successfully!\n');

    // Verify tables were created
    const tables = ['posts', 'post_likes', 'post_comments', 'connections', 'skill_endorsements', 'recommendations', 'work_experience', 'education', 'activities'];
    
    console.log('Checking created tables:');
    for (const table of tables) {
      const [result] = await conn.query(`SHOW TABLES LIKE "${table}"`);
      console.log(`  ${result.length > 0 ? '✓' : '✗'} ${table}`);
    }

    await conn.end();
  } catch (error) {
    console.error('❌ Error running migration:', error.message);
    process.exit(1);
  }
})();
