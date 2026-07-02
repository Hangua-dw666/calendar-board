import sequelize from '../config/database.js';
import { Category, DailyRecord, Inspiration, Image } from '../models/index.js';

async function syncDb() {
  try {
    await sequelize.authenticate();
    console.log('[DB] 数据库连接成功');

    await sequelize.sync({ alter: true });
    console.log('[DB] 所有模型同步成功');

    process.exit(0);
  } catch (err) {
    console.error('[DB] 同步失败:', err.message);
    process.exit(1);
  }
}

syncDb();
