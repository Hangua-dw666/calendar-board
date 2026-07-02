import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  supabase_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  supabase_path: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  record_type: {
    type: DataTypes.ENUM('daily', 'inspiration'),
    allowNull: false,
  },
  record_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'images',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default Image;
