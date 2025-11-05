const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'peerfusion_user',
      password: 'peerfusion_password',
      database: 'peerfusion_db'
    });

    // Check if posts table exists
    const [tables] = await conn.query('SHOW TABLES LIKE "posts"');
    console.log('Posts table exists:', tables.length > 0);

    if (tables.length === 0) {
      console.log('\nPosts table does NOT exist. You need to run the migration.');
      console.log('Run this command to create the tables:');
      console.log('mysql -u root peerfusion < src/database/migrations/003_add_linkedin_features.sql');
    } else {
      console.log('\n✓ Posts table exists!');
      
      // Check table structure
      const [columns] = await conn.query('DESCRIBE posts');
      console.log('\nTable structure:');
      columns.forEach(col => {
        console.log(`  ${col.Field}: ${col.Type}`);
      });
    }

    await conn.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
