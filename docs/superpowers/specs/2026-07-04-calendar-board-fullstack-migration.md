# calendar-board 全栈改造设计（方案 1：最小改动）

> 日期：2026-07-04
> 范围：calendar-board 项目从"本地 MySQL + Express 长进程"改造为"Supabase Postgres + Vercel Serverless Functions"，Monorepo 单项目部署。
> 目标：让 https://calendar-board.vercel.app/ 在 iframe 嵌入时能完整体验功能（增删改查记录 + 上传图片）。

## 1. 背景与现状

### 1.1 当前架构

```
calendar-board/
├── frontend/         Vue 3 + Vite + Pinia + axios（调用 /api/*）
└── backend/          Express + Sequelize + MySQL + multer + Supabase Storage
```

- frontend 调用 `/api/*`，Vite proxy 到 `localhost:3001`
- backend 是 Express 长进程，监听 3001 端口
- 数据库是本地 MySQL（dialect: mysql, charset: utf8mb4）
- 图片上传用 multer memoryStorage → Supabase Storage bucket `calendar-board`
- 4 个 model：Category / DailyRecord / Inspiration / Image
- 4 个路由：`/api/categories` `/api/daily-records` `/api/inspirations` `/api/upload`

### 1.2 当前问题

- backend 没部署，Vercel 上只有 frontend，API 全部 404
- 本地 MySQL 无法在线访问
- portfolio 主页点 calendar-board 图标只能看 UI，无法体验功能

## 2. 目标

- 在 Vercel 一个项目内同时部署 frontend + backend（Monorepo）
- 数据库换 Supabase Postgres（用 `calendar_board` schema）
- 图片存储继续用 Supabase Storage bucket `calendar-board`
- URL 不变：`https://calendar-board.vercel.app/`
- 改造后：portfolio 主页点 calendar-board 图标 → 弹窗里能完整体验功能

## 3. 设计原则

- **最小改动**：model / controller / route 文件全部不动
- **YAGNI**：不换 Sequelize、不重构路由分文件、不做前端直传
- **保留 multer**：memoryStorage 在 serverless 环境可用
- **从空库开始**：本地只有测试数据，不写迁移脚本

## 4. 改造后仓库结构

```
calendar-board/
├── frontend/                    ← 不动
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── backend/                     ← model/controller/route 不动
│   └── src/
│       ├── config/
│       │   ├── database.js      ← 改：dialect mysql → postgres + schema
│       │   └── supabase.js      ← 不动
│       ├── models/              ← 不动
│       ├── controllers/         ← 不动
│       ├── routes/              ← 不动
│       ├── scripts/             ← 不动（db:sync / db:seed）
│       └── app.js               ← 改：导出 app，条件 listen
├── api/                         ← 新增
│   └── [...path].js            ← catch-all serverless function
├── package.json                 ← 新增：根目录 package.json
├── vercel.json                  ← 新增
├── .env.example                 ← 新增：根目录环境变量示例
└── .gitignore                   ← 改：加 .env
```

## 5. 关键改动点

### 5.1 `backend/src/config/database.js`

改 dialect 为 postgres，加 schema，去掉 MySQL 专属 charset 配置。

```js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'postgres',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    define: {
      schema: 'calendar_board',
      timestamps: true,
    },
  }
);

export default sequelize;
```

### 5.2 `backend/src/app.js`

改为导出 app，仅在被直接运行时启动 listen。这样既能本地 `npm run dev` 调试，又能被 serverless function 导入。

```js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({ code: 0, message: 'success', data: { status: 'ok' } });
});

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
if (import.meta.url === `file://${process.argv[1]}`) {
  start();
}

export default app;
```

### 5.3 `api/[...path].js`（新增）

catch-all serverless function，把 Vercel 收到的请求转给 Express app。

```js
import app from '../backend/src/app.js';

// 让 multer 处理 multipart/form-data，不用 Vercel 内置 bodyParser
export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  // Vercel serverless 把 req.url 改成 / 起头的路径，需要补 /api 前缀
  // Vercel 的 [...path] 会把原始 path 放在 req.query.path 数组里
  const pathParts = req.query.path || [];
  const rest = Array.isArray(pathParts) ? pathParts.join('/') : pathParts;
  req.url = '/api/' + (rest || '');
  return app(req, res);
}
```

### 5.4 `vercel.json`（新增）

Monorepo 部署配置：API 走 serverless function，前端走 Vite 构建。

```json
{
  "version": 2,
  "builds": [
    { "src": "api/[...path].js", "use": "@vercel/node" },
    { "src": "frontend/package.json", "use": "@vercel/vite", "config": { "distDir": "dist" } }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/[...path]" },
    { "src": "/((?!api).*)", "dest": "/frontend/$1" }
  ]
}
```

### 5.5 `package.json`（根目录新增）

把 backend 依赖提到根目录（serverless function 需要根目录有依赖）。

```json
{
  "name": "calendar-board",
  "private": true,
  "type": "module",
  "scripts": {
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "db:sync": "cd backend && npm run db:sync",
    "db:seed": "cd backend && npm run db:seed"
  },
  "dependencies": {
    "express": "^4.19.2",
    "sequelize": "^6.37.3",
    "pg": "^8.11.0",
    "pg-hstore": "^2.3.4",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "multer": "^1.4.5-lts.1",
    "@supabase/supabase-js": "^2.45.0"
  }
}
```

去掉 `mysql2`，加 `pg` + `pg-hstore`。

### 5.6 `frontend/src/api/index.js`

加 `VITE_API_BASE_URL` 支持但默认走 `/api`（同源）。本地开发 Vite proxy 转发到 localhost:3001，生产同源转 Vercel serverless。

```js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('[API Error]', error.message)
    if (error.response) {
      return Promise.reject(error.response.data)
    }
    return Promise.reject({ code: -1, message: '网络错误', data: null })
  }
)

export default api
```

### 5.7 `.env.example`（根目录新增）

```env
# Supabase Postgres 数据库
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_supabase_db_password
DB_NAME=postgres

# Supabase Storage（图片上传）
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx

# 本地开发时 backend 端口
PORT=3001
```

### 5.8 `.gitignore` 改动

加 `.env` 防止凭证泄露。

## 6. Supabase 配置（手动操作）

### 6.1 创建 schema

Supabase Dashboard → SQL Editor → 执行：

```sql
CREATE SCHEMA IF NOT EXISTS calendar_board;
```

### 6.2 创建 Storage Bucket

Supabase Dashboard → Storage → New bucket:
- Name: `calendar-board`
- Public: Yes

### 6.3 获取凭证

- **数据库连接**：Project Settings → Database → Connection string（URI 格式）→ 提取 host/port/user/password
- **API 凭证**：Project Settings → API → `Project URL` + `anon public key`

## 7. Vercel 环境变量配置

在 Vercel calendar-board 项目 → Settings → Environment Variables：

| Key | Value |
|---|---|
| `DB_HOST` | `db.xxxxx.supabase.co` |
| `DB_PORT` | `5432` |
| `DB_USER` | `postgres` |
| `DB_PASSWORD` | Supabase 数据库密码 |
| `DB_NAME` | `postgres` |
| `SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJ...` |

## 8. 数据库初始化

不写迁移脚本（本地只有测试数据）。

1. 本地配好 `backend/.env` 后，跑 `npm run db:sync` 在 Supabase Postgres 上建表
2. 跑 `npm run db:seed` 造 demo 数据

## 9. 本地开发流程

```bash
# 1. 根目录装依赖
npm install

# 2. 配置 backend/.env
cp .env.example backend/.env
# 编辑 backend/.env 填 Supabase 凭证

# 3. 同步 schema 到 Supabase Postgres
npm run db:sync

# 4. 造 demo 数据
npm run db:seed

# 5. 启动后端（终端 1，热重载）
npm run dev:backend

# 6. 启动前端（终端 2，热重载）
npm run dev:frontend
```

## 10. 验收标准

- [ ] 本地 `npm run dev:backend` + `npm run dev:frontend` 能跑通，数据从 Supabase 读
- [ ] push 到 GitHub 后 Vercel 自动部署成功
- [ ] https://calendar-board.vercel.app/ 直接能访问，UI 有数据
- [ ] https://calendar-board.vercel.app/api/categories 返回 JSON
- [ ] https://calendar-board.vercel.app/api/health 返回 `{ code: 0, data: { status: 'ok' } }`
- [ ] portfolio 主页点 calendar-board 图标 → 弹窗里能增删改查记录 + 上传图片

## 11. 不做的事（YAGNI）

- ❌ 不写 MySQL → Postgres 数据迁移脚本（本地只有测试数据）
- ❌ 不换 Supabase JS Client（保留 Sequelize，最小改动）
- ❌ 不重构路由分文件（catch-all 够用）
- ❌ 不做前端直传 Storage（保留 multer，最小改动）
- ❌ 不改 model / controller 代码

## 12. 风险与已知问题

### 12.1 Sequelize 冷启动

每次 serverless function 冷启动，Sequelize 要建立新连接，约 1-2 秒延迟。在面试场景下可接受。如果后续成为问题，再迁移到方案 2（Supabase JS Client）。

### 12.2 multer 在 serverless 的限制

memoryStorage 在 Vercel serverless 可用，但单个文件大小受 Vercel 限制（4.5MB on hobby plan）。日历看板场景上传图片足够。

### 12.3 Sequelize schema 选项的兼容性

`define.schema` 选项会让所有 model 默认在 `calendar_board` schema 下建表/查表。需验证 Sequelize + Postgres 的 schema 行为符合预期。
