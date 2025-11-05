const mysql = require('mysql2/promise');

(async () => {
  try {
    const pool = mysql.createPool({
      host: '127.0.0.1',
      port: 3306,
      user: 'peerfusion_user',
      password: 'peerfusion_password',
      database: 'peerfusion_db',
      waitForConnections: true,
      connectionLimit: 5
    });

    const [rows] = await pool.query('SELECT COUNT(*) AS c FROM users');
    console.log('users count:', rows);
    await pool.end();
  } catch (err) {
    console.error('Connection test failed:', err);
    process.exit(1);
  }
})();
