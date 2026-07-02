import Category from './Category.js';
import DailyRecord from './DailyRecord.js';
import Inspiration from './Inspiration.js';
import Image from './Image.js';

// 关联关系
Category.hasMany(DailyRecord, { foreignKey: 'category_id', as: 'dailyRecords' });
DailyRecord.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Category.hasMany(Inspiration, { foreignKey: 'category_id', as: 'inspirations' });
Inspiration.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

DailyRecord.hasMany(Image, {
  foreignKey: 'record_id',
  scope: { record_type: 'daily' },
  as: 'images',
});
Inspiration.hasMany(Image, {
  foreignKey: 'record_id',
  scope: { record_type: 'inspiration' },
  as: 'images',
});

Image.belongsTo(DailyRecord, { foreignKey: 'record_id', as: 'dailyRecord' });
Image.belongsTo(Inspiration, { foreignKey: 'record_id', as: 'inspiration' });

export { Category, DailyRecord, Inspiration, Image };
