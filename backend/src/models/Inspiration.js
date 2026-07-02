import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Inspiration = sequelize.define('Inspiration', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  record_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'inspirations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Inspiration;
