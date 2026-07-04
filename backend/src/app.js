import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';
import sequelize from './config/database.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查（同时支持 /health 和 /api/health）
const healthHandler = (req, res) => {
  res.json({ code: 0, message: 'success', data: { status: 'ok' } });
};
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// API 路由
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('[DB] 数据库连接成功');
    app.listen(PORT, () => {
      console.log(`[Server] 服务已启动: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[DB] 数据库连接失败:', err.message);
    process.exit(1);
  }
}

// 仅在被直接运行时启动（不作为模块导入时）
// 用 pathToFileURL 兼容 Windows 路径（C:\... → file:///C:/...）
// Vercel serverless 环境下 process.argv[1] 可能为 undefined，需保护
const entryArg = process.argv[1];
if (entryArg) {
  try {
    const entryUrl = pathToFileURL(entryArg).href;
    if (import.meta.url === entryUrl) {
      start();
    }
  } catch {
    // 忽略路径转换错误（serverless 环境不启动 listen）
  }
}

export default app;
