import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function initDb() {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'calendar_board';

  try {
    // 先不指定数据库连接，创建数据库
    const connection = await mysql.createConnection({
      host, port, user, password,
    });

    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`
    );
    console.log(`[DB] 数据库 ${dbName} 创建成功（或已存在）`);
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('[DB] 创建数据库失败:', err.message);
    console.error(`  连接信息: ${user}@${host}:${port}`);
    console.error('  请检查 backend/.env 中的数据库配置');
    process.exit(1);
  }
}

initDb();
