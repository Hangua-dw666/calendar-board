import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import pg from 'pg';
import pgHstore from 'pg-hstore';

dotenv.config();

// 显式传入 pg 模块，避免 Vercel serverless 打包时漏掉 Sequelize 的动态 require('pg')
const sequelize = new Sequelize(
  process.env.DB_NAME || 'postgres',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectModule: pg,
    dialectModulePool: pgHstore,
    logging: false,
    define: {
      schema: 'calendar_board',
      timestamps: true,
    },
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
      prepared: false,
    },
  }
);

export default sequelize;
