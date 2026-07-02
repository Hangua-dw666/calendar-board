import { Category } from '../models/index.js';
import sequelize from '../config/database.js';

const defaultCategories = [
  { name: '工作', type: 'daily', color: '#58a6ff', is_default: true },
  { name: '生活', type: 'daily', color: '#00ff88', is_default: true },
  { name: '学习', type: 'daily', color: '#d2a8ff', is_default: true },
  { name: '健康', type: 'daily', color: '#ff7b72', is_default: true },
  { name: '创意', type: 'inspiration', color: '#ffd700', is_default: true },
  { name: '灵感', type: 'inspiration', color: '#00ff88', is_default: true },
  { name: '待办', type: 'inspiration', color: '#ff7b72', is_default: true },
  { name: '收藏', type: 'inspiration', color: '#58a6ff', is_default: true },
];

async function seedDb() {
  try {
    await sequelize.authenticate();
    console.log('[DB] 数据库连接成功');

    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ where: { name: cat.name, type: cat.type } });
      if (!exists) {
        await Category.create(cat);
        console.log(`[Seed] 创建分类: ${cat.name} (${cat.type})`);
      }
    }

    console.log('[Seed] 种子数据插入完成');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] 插入失败:', err.message);
    process.exit(1);
  }
}

seedDb();
