// server/src/db.ts - Fix database connection with proper error handling
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Check env vars (MySQL defaults)
const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD', 'DB_PORT'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.warn('⚠️  Missing database environment variables:', missingEnvVars.join(', '));
  console.log('💡 Create a .env file with the following variables:');
  console.log('   DB_USER=your_db_user');
  console.log('   DB_HOST=127.0.0.1');
  console.log('   DB_NAME=your_db_name');
  console.log('   DB_PASSWORD=your_db_password');
  console.log('   DB_PORT=3306');
}

const poolInstance = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'peerfusion_user',
  database: process.env.DB_NAME || 'peerfusion_db',
  password: process.env.DB_PASSWORD || 'peerfusion_password',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONN_LIMIT) || 10,
  queueLimit: 0,
});

// Adapter: convert Postgres-style $1, $2 params to MySQL ? placeholders
function convertPgParamsToMysql(sql: string) {
  return sql.replace(/\$[0-9]+/g, '?');
}

export const pool = {
  // Keep a compatible API: pool.query(sql, params) -> { rows }
  query: async (sql: string, params?: any[]) => {
    const transformedSql = convertPgParamsToMysql(sql);
    try {
      const [rowsOrOk] = await poolInstance.query(transformedSql, params || []);

      // SELECT queries return array rows; INSERT/UPDATE return OkPacket object
      if (Array.isArray(rowsOrOk)) {
        return { rows: rowsOrOk };
      }

      // OkPacket (for inserts/updates)
      const ok: any = rowsOrOk;
      return { rows: [], insertId: ok.insertId, affectedRows: ok.affectedRows };
    } catch (err: any) {
      // Re-throw to be handled by callers
      throw err;
    }
  },
  // expose end for graceful shutdown
  end: async () => poolInstance.end(),
  // raw pool instance if needed
  _raw: poolInstance,
};

export const testDatabaseConnection = async () => {
  try {
    const [rows] = await poolInstance.query('SELECT 1');
    console.log('✅ Database connection test successful (MySQL)');
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await poolInstance.end();
    console.log('Database pool has ended');
  } finally {
    process.exit(0);
  }
});

process.on('SIGTERM', async () => {
  try {
    await poolInstance.end();
    console.log('Database pool has ended');
  } finally {
    process.exit(0);
  }
});