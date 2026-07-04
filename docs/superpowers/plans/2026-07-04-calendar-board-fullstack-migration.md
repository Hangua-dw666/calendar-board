# calendar-board 全栈改造实施计划（方案 1：最小改动）

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 calendar-board 从"本地 MySQL + Express 长进程"改造为"Supabase Postgres + Vercel Serverless Functions"，Monorepo 单项目部署，让 https://calendar-board.vercel.app/ 在 iframe 嵌入时能完整体验功能。

**Architecture:** 在 calendar-board 仓库根目录新增 `api/[...path].js` catch-all serverless function，把 Express app 包成 Vercel function。database.js 改 dialect 为 postgres + 加 schema `calendar_board`。app.js 改为可导出。根目录新增 `package.json` 提依赖 + `vercel.json` 配置 Monorepo 构建。

**Tech Stack:** Vue 3 + Vite 4 + Express 4 + Sequelize 6 + Postgres（Supabase）+ Supabase Storage + Vercel Serverless Functions

## Global Constraints

- 仓库根目录：`c:\Users\306\Desktop\作品集\calendar-board\`
- 不改 model / controller / route 文件
- 不写 MySQL → Postgres 数据迁移脚本（本地只有测试数据）
- 数据库 schema：`calendar_board`（Supabase Postgres）
- Storage bucket：`calendar-board`（Supabase，public）
- Vercel 项目域名不变：`https://calendar-board.vercel.app/`
- 部署平台：Vercel（已连接 GitHub `13531246490/calendar-board`）
- backend 模块系统：ESM（`"type": "module"`）
- Node 16 兼容（不使用 Node 18+ 专属 API）

---

## File Structure

| 文件 | 职责 | 动作 |
|------|------|------|
| `backend/src/config/database.js` | Sequelize 连接配置 | Modify（dialect + schema） |
| `backend/src/app.js` | Express app | Modify（导出 app + 条件 listen） |
| `api/[...path].js` | catch-all serverless function | Create |
| `package.json` | 根目录依赖与 scripts | Create |
| `vercel.json` | Monorepo 部署配置 | Create |
| `.env.example` | 环境变量示例 | Create |
| `backend/.env` | 本地实际凭证 | Create（不提交，用户填） |
| `frontend/src/api/index.js` | axios baseURL | Modify（加 VITE_API_BASE_URL 支持） |

---

## 实施前置条件（用户手动操作）

执行 Task 1-7 前，用户需要完成以下操作并把凭证给到助手（或填入 `backend/.env`）：

### A. Supabase 配置

1. 登录 Supabase Dashboard
2. 选已有项目（或新建）
3. SQL Editor 执行：`CREATE SCHEMA IF NOT EXISTS calendar_board;`
4. Storage → New bucket → Name: `calendar-board` → Public: Yes
5. Project Settings → Database → 复制 Connection string（URI 格式），提取 host / port / user / password
6. Project Settings → API → 复制 Project URL + anon public key

### B. Vercel 环境变量配置

在 Vercel calendar-board 项目 → Settings → Environment Variables 添加 7 个变量：

| Key | Value |
|---|---|
| `DB_HOST` | `db.xxxxx.supabase.co` |
| `DB_PORT` | `5432` |
| `DB_USER` | `postgres` |
| `DB_PASSWORD` | Supabase 数据库密码 |
| `DB_NAME` | `postgres` |
| `SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJ...` |

---

### Task 1: 改 database.js（dialect mysql → postgres + schema）

**Files:**
- Modify: `backend/src/config/database.js`

**Interfaces:**
- Produces: Sequelize 实例连接 Supabase Postgres，所有 model 默认在 `calendar_board` schema 下

- [ ] **Step 1: 重写 database.js**

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

- [ ] **Step 2: 提交**

```bash
cd c:\Users\306\Desktop\作品集\calendar-board
git add backend/src/config/database.js
git commit -m "refactor: database.js 改 dialect 为 postgres + 加 calendar_board schema"
```

---

### Task 2: 改 app.js（导出 app + 条件 listen）

**Files:**
- Modify: `backend/src/app.js`

**Interfaces:**
- Produces: `app` 默认导出（供 serverless function 导入），保留本地 `npm run dev` 直接启动能力

- [ ] **Step 1: 在 app.js 末尾追加导出 + 改 start() 调用为条件触发**

把 app.js 改为：

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

// 健康检查
app.get('/health', (req, res) => {
  res.json({ code: 0, message: 'success', data: { status: 'ok' } });
});

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
if (import.meta.url === `file://${process.argv[1]}`) {
  start();
}

export default app;
```

- [ ] **Step 2: 提交**

```bash
git add backend/src/app.js
git commit -m "refactor: app.js 导出 app + 条件 listen，支持 serverless 导入"
```

---

### Task 3: 创建根 package.json（提依赖 + scripts）

**Files:**
- Create: `package.json`（根目录）

**Interfaces:**
- Produces: 根目录依赖（供 serverless function 用），scripts 整合前后端开发命令

- [ ] **Step 1: 创建根 package.json**

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

- [ ] **Step 2: 提交**

```bash
git add package.json
git commit -m "feat: 添加根目录 package.json（提依赖到根 + scripts 整合）"
```

---

### Task 4: 创建 api/[...path].js（catch-all serverless function）

**Files:**
- Create: `api/[...path].js`

**Interfaces:**
- Consumes: `app`（从 `../backend/src/app.js` 导入）
- Produces: Vercel serverless function，把 `/api/*` 请求转给 Express app

- [ ] **Step 1: 创建 api/[...path].js**

```js
import app from '../backend/src/app.js';

// 让 multer 处理 multipart/form-data，禁用 Vercel 内置 bodyParser
export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  // Vercel [...path] 把捕获的路径段放在 req.query.path
  // 拼回 /api/... 让 Express router 正确匹配
  const pathParts = req.query.path;
  let rest = '';
  if (Array.isArray(pathParts)) {
    rest = pathParts.join('/');
  } else if (typeof pathParts === 'string') {
    rest = pathParts;
  }
  req.url = '/api/' + rest;
  return app(req, res);
}
```

- [ ] **Step 2: 提交**

```bash
git add api/[...path].js
git commit -m "feat: 添加 catch-all serverless function（api/[...path].js）"
```

---

### Task 5: 创建 vercel.json（Monorepo 部署配置）

**Files:**
- Create: `vercel.json`

**Interfaces:**
- Produces: Vercel 部署配置，API 走 serverless function，前端走 Vite 构建

- [ ] **Step 1: 创建 vercel.json**

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

- [ ] **Step 2: 提交**

```bash
git add vercel.json
git commit -m "feat: 添加 vercel.json Monorepo 部署配置"
```

---

### Task 6: 创建 .env.example + 改 frontend/src/api/index.js

**Files:**
- Create: `.env.example`（根目录）
- Modify: `frontend/src/api/index.js`

**Interfaces:**
- Produces: 环境变量示例文档 + frontend axios 支持 `VITE_API_BASE_URL` 环境变量覆盖

- [ ] **Step 1: 创建 .env.example**

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

- [ ] **Step 2: 改 frontend/src/api/index.js 加 VITE_API_BASE_URL 支持**

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

- [ ] **Step 3: 提交**

```bash
git add .env.example frontend/src/api/index.js
git commit -m "feat: 添加 .env.example + frontend axios 支持 VITE_API_BASE_URL"
```

---

### Task 7: 安装根目录依赖 + 本地数据库同步验证

**Files:** 无文件变更，仅本地装依赖 + 同步 schema

**Interfaces:**
- Consumes: Task 1-6 的代码改动 + 用户的 Supabase 凭证
- Produces: Supabase Postgres `calendar_board` schema 下有 4 张表 + 8 条默认分类数据

- [ ] **Step 1: 用户在 backend/.env 填入真实 Supabase 凭证**

用户操作（不提交 .env）：

```bash
cd c:\Users\306\Desktop\作品集\calendar-board
copy .env.example backend\.env
# 用编辑器打开 backend/.env，填入真实 Supabase 凭证
```

- [ ] **Step 2: 根目录装依赖**

```bash
cd c:\Users\306\Desktop\作品集\calendar-board
npm install --no-audit --no-fund
```

Expected: `node_modules/` 创建，`pg` / `pg-hstore` 等依赖装好，无错误。

- [ ] **Step 3: 同步 schema 到 Supabase Postgres**

```bash
npm run db:sync
```

Expected: 输出 `[DB] 数据库连接成功` + `[DB] 所有模型同步成功`，退出码 0。
Supabase Dashboard → Table Editor → 选 `calendar_board` schema → 应看到 4 张表：`categories` / `daily_records` / `inspirations` / `images`。

- [ ] **Step 4: 造 demo 数据**

```bash
npm run db:seed
```

Expected: 输出 8 条 `[Seed] 创建分类: xxx (xxx)`，退出码 0。
Supabase Dashboard → Table Editor → `categories` 表 → 应有 8 条记录（工作/生活/学习/健康/创意/灵感/待办/收藏）。

---

### Task 8: 本地全栈启动验证

**Files:** 无文件变更，仅本地启动 + 验证

- [ ] **Step 1: 启动 backend（终端 1）**

```bash
cd c:\Users\306\Desktop\作品集\calendar-board
npm run dev:backend
```

Expected: 输出 `[DB] 数据库连接成功` + `[Server] 服务已启动: http://localhost:3001`，进程保持运行。

- [ ] **Step 2: 启动 frontend（终端 2）**

```bash
cd c:\Users\306\Desktop\作品集\calendar-board
npm run dev:frontend
```

Expected: Vite 启动，访问 http://localhost:5173/ 显示日历看板 UI，分类筛选条显示 8 个分类，无控制台错误。

- [ ] **Step 3: 验证 API 端点**

打开浏览器访问 http://localhost:5173/api/categories
Expected: 返回 JSON `{ code: 0, message: 'success', data: [...8 条分类...] }`

打开浏览器访问 http://localhost:5173/api/health
Expected: 返回 `{ code: 0, message: 'success', data: { status: 'ok' } }`

- [ ] **Step 4: 验证完整功能**

在 http://localhost:5173/ 操作：
1. 选某天，添加一条日历记录（标题+内容+分类），保存
2. 在灵感区添加一条灵感，保存
3. 编辑刚添加的记录，修改内容，保存
4. 上传一张图片到记录
5. 删除一条记录

Expected: 所有操作成功，数据从 Supabase 读写，刷新页面数据持久化。
Supabase Dashboard → Table Editor → `daily_records` / `inspirations` / `images` 表应有对应记录。

---

### Task 9: 推送部署 + 线上验证

**Files:** 无文件变更，仅 git push + 验证

- [ ] **Step 1: 推送到 GitHub**

```bash
cd c:\Users\306\Desktop\作品集\calendar-board
git push origin main
```

Expected: push 成功，Vercel 自动触发重新部署。

- [ ] **Step 2: 等待 Vercel 部署完成**

在 Vercel Dashboard 看 calendar-board 项目部署进度，等状态变 Ready（约 2-3 分钟）。

- [ ] **Step 3: 验证线上健康检查**

```bash
curl.exe -s https://calendar-board.vercel.app/api/health
```

Expected: 返回 `{"code":0,"message":"success","data":{"status":"ok"}}`

- [ ] **Step 4: 验证线上 API**

```bash
curl.exe -s https://calendar-board.vercel.app/api/categories
```

Expected: 返回 JSON，data 数组有 8 条分类。

- [ ] **Step 5: 验证线上 UI**

浏览器访问 https://calendar-board.vercel.app/
Expected: 日历看板 UI 正常渲染，分类筛选条显示 8 个分类，无控制台错误。

- [ ] **Step 6: 验证 portfolio 嵌入**

浏览器访问 https://portfolio-tawny-seven-28.vercel.app/
点击 calendar-board 图标 → 弹窗加载 calendar-board
Expected: 弹窗内显示日历看板 UI，能增删改查记录 + 上传图片，所有功能完整可用。

---

## Self-Review

**1. Spec coverage:**
- §4 仓库结构 → Task 1-6 全覆盖（database.js / app.js / api/ / package.json / vercel.json / .env.example / frontend api）
- §5 关键改动点 → Task 1（5.1）/ Task 2（5.2）/ Task 4（5.3）/ Task 5（5.4）/ Task 3（5.5）/ Task 6（5.6-5.7）
- §6 Supabase 配置 → 实施前置条件 B
- §7 Vercel 环境变量 → 实施前置条件 B
- §8 数据库初始化 → Task 7
- §9 本地开发流程 → Task 8
- §10 验收标准 → Task 8（本地）+ Task 9（线上）

**2. Placeholder scan:** 无 TBD/TODO。所有代码完整。

**3. Type consistency:**
- `app` 默认导出在 Task 2 定义，Task 4 导入使用，一致
- `import.meta.url === \`file://${process.argv[1]}\`` 在 Node 16 ESM 可用
- `req.query.path` 是 Vercel [...path] catch-all 的标准用法
- 环境变量名 `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME/SUPABASE_URL/SUPABASE_ANON_KEY` 全程一致

无问题。

## Execution

用户已选择 inline execution。直接执行 Task 1-9。Task 7 Step 1-2 和 Task 8 需要用户配合（填 .env + 看本地验证），其余助手执行。
