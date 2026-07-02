# 日历看板应用 v1 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个暗色终端风格的个人日历看板应用，支持月视图日历、日常记录、灵感碎片、图片上传和分类管理。

**Architecture:** 前后端分离架构。后端 Node.js + Express + Sequelize + MySQL 提供 RESTful API；前端 Vue 3 + Vite + Tailwind CSS + Pinia 构建暗色终端风格 UI；图片上传到 Supabase Storage。

**Tech Stack:** Vue 3, Vite, Tailwind CSS, Pinia, Axios (前端)；Node.js, Express, Sequelize, MySQL2, Multer, @supabase/supabase-js (后端)

## Global Constraints

- 项目根目录：`c:\Users\306\Desktop\作品集\calendar-board\`
- 后端端口：3001（避免和 Vite 默认 5173 冲突）
- 前端端口：5173
- 数据库名：calendar_board
- MySQL 字符集：utf8mb4
- API 响应格式：`{ code: 0, message: "success", data: {} }`
- 日期格式：YYYY-MM-DD
- 前端 API 代理：Vite 配置 `/api` 代理到 `http://localhost:3001`
- 视觉风格：暗色终端风格，主色 #0a0a0f，点缀色 #00ff88

---

## File Structure

### 后端文件结构

```
backend/
├── src/
│   ├── app.js                      # Express 应用入口
│   ├── config/
│   │   ├── database.js             # Sequelize 数据库配置
│   │   └── supabase.js             # Supabase 客户端配置
│   ├── models/
│   │   ├── index.js                # 模型初始化与关联
│   │   ├── Category.js             # 分类模型
│   │   ├── DailyRecord.js          # 日常记录模型
│   │   ├── Inspiration.js          # 灵感碎片模型
│   │   └── Image.js                # 图片模型
│   ├── routes/
│   │   ├── index.js                # 路由汇总
│   │   ├── categoryRoutes.js       # 分类路由
│   │   ├── dailyRecordRoutes.js    # 日常记录路由
│   │   ├── inspirationRoutes.js    # 灵感碎片路由
│   │   └── uploadRoutes.js         # 图片上传路由
│   ├── controllers/
│   │   ├── categoryController.js   # 分类控制器
│   │   ├── dailyRecordController.js# 日常记录控制器
│   │   ├── inspirationController.js# 灵感碎片控制器
│   │   └── uploadController.js     # 图片上传控制器
│   ├── middleware/
│   │   └── errorHandler.js         # 统一错误处理
│   └── seeders/
│       └── initialData.js          # 预设分类数据
├── .env                            # 环境变量
├── .env.example                    # 环境变量示例
├── package.json
└── nodemon.json
```

### 前端文件结构

```
frontend/
├── src/
│   ├── main.js                     # 应用入口
│   ├── App.vue                     # 根组件
│   ├── style.css                   # 全局样式 + Tailwind
│   ├── api/
│   │   ├── index.js                # Axios 实例
│   │   ├── category.js             # 分类 API
│   │   ├── dailyRecord.js          # 日常记录 API
│   │   ├── inspiration.js          # 灵感碎片 API
│   │   └── upload.js               # 图片上传 API
│   ├── stores/
│   │   ├── category.js             # 分类状态
│   │   ├── calendar.js             # 日历状态
│   │   ├── dailyRecord.js          # 日常记录状态
│   │   └── inspiration.js          # 灵感碎片状态
│   ├── components/
│   │   ├── CalendarGrid.vue        # 月历网格
│   │   ├── DayDetailModal.vue      # 日期详情弹窗
│   │   ├── DailyInput.vue          # 日常记录输入
│   │   ├── InspirationInput.vue    # 灵感碎片输入
│   │   ├── ImageUploader.vue       # 图片上传
│   │   ├── CategoryFilter.vue      # 分类筛选
│   │   └── CategorySelect.vue      # 分类下拉选择
│   └── utils/
│       └── date.js                 # 日期工具函数
├── index.html
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
└── package.json
```

---

## Task 1: 后端项目初始化与数据库配置

**Files:**
- Create: `backend/package.json`
- Create: `backend/.env.example`
- Create: `backend/.env`
- Create: `backend/nodemon.json`
- Create: `backend/src/app.js`
- Create: `backend/src/config/database.js`
- Create: `backend/src/config/supabase.js`
- Create: `backend/src/middleware/errorHandler.js`

**Interfaces:**
- Produces: Express app 实例（端口 3001），Sequelize 实例（连接 calendar_board 数据库）

- [ ] **Step 1: 检查本地环境**

Run:
```powershell
node --version
npm --version
mysql --version
```
Expected: Node.js >= 18, npm >= 9, MySQL >= 8

- [ ] **Step 2: 创建后端 package.json**

```bash
cd c:\Users\306\Desktop\作品集\calendar-board\backend
npm init -y
```

然后编辑 `backend/package.json`：

```json
{
  "name": "calendar-board-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nodemon src/app.js",
    "start": "node src/app.js",
    "db:sync": "node src/scripts/syncDb.js",
    "db:seed": "node src/scripts/seedDb.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "sequelize": "^6.37.3",
    "mysql2": "^3.11.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "multer": "^1.4.5-lts.1",
    "@supabase/supabase-js": "^2.45.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}
```

- [ ] **Step 3: 安装后端依赖**

Run:
```powershell
cd c:\Users\306\Desktop\作品集\calendar-board\backend
npm install
```

- [ ] **Step 4: 创建环境变量文件**

`backend/.env.example`:
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=calendar_board

# Supabase 配置
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# 服务器配置
PORT=3001
```

`backend/.env`（用户填入实际值）:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=calendar_board
SUPABASE_URL=
SUPABASE_ANON_KEY=
PORT=3001
```

- [ ] **Step 5: 创建 nodemon 配置**

`backend/nodemon.json`:
```json
{
  "watch": ["src"],
  "ext": "js",
  "exec": "node src/app.js"
}
```

- [ ] **Step 6: 创建数据库配置**

`backend/src/config/database.js`:
```javascript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'calendar_board',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
  }
);

export default sequelize;
```

- [ ] **Step 7: 创建 Supabase 配置**

`backend/src/config/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('[Supabase] 未配置 SUPABASE_URL 或 SUPABASE_ANON_KEY，图片上传功能将不可用');
}

export default supabase;
```

- [ ] **Step 8: 创建错误处理中间件**

`backend/src/middleware/errorHandler.js`:
```javascript
export function notFound(req, res, next) {
  res.status(404).json({
    code: 404,
    message: `接口不存在: ${req.originalUrl}`,
    data: null,
  });
}

export function errorHandler(err, req, res, next) {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({
    code: err.status || 500,
    message: err.message || '服务器内部错误',
    data: null,
  });
}
```

- [ ] **Step 9: 创建 Express 应用入口**

`backend/src/app.js`:
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
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

// 路由将在后续任务中添加
// app.use('/api', routes);

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

start();
```

- [ ] **Step 10: 验证后端启动**

Run:
```powershell
cd c:\Users\306\Desktop\作品集\calendar-board\backend
node src/app.js
```
Expected: 控制台输出 `[DB] 数据库连接成功` 和 `[Server] 服务已启动: http://localhost:3001`

访问 `http://localhost:3001/health` 返回 `{"code":0,"message":"success","data":{"status":"ok"}}`

- [ ] **Step 11: 初始化 Git 并提交**

```bash
cd c:\Users\306\Desktop\作品集\calendar-board
git init
echo "node_modules/\n.env\nuploads/" > .gitignore
git add .
git commit -m "feat: 后端项目初始化与数据库配置"
```

---

## Task 2: 数据库模型定义与同步

**Files:**
- Create: `backend/src/models/Category.js`
- Create: `backend/src/models/DailyRecord.js`
- Create: `backend/src/models/Inspiration.js`
- Create: `backend/src/models/Image.js`
- Create: `backend/src/models/index.js`
- Create: `backend/src/scripts/syncDb.js`
- Create: `backend/src/scripts/seedDb.js`

**Interfaces:**
- Consumes: Task 1 的 sequelize 实例
- Produces: Category, DailyRecord, Inspiration, Image 四个模型，模型间已建立关联

- [ ] **Step 1: 创建 Category 模型**

`backend/src/models/Category.js`:
```javascript
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('daily', 'inspiration'),
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING(20),
    defaultValue: '#00ff88',
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Category;
```

- [ ] **Step 2: 创建 DailyRecord 模型**

`backend/src/models/DailyRecord.js`:
```javascript
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const DailyRecord = sequelize.define('DailyRecord', {
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
  tableName: 'daily_records',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default DailyRecord;
```

- [ ] **Step 3: 创建 Inspiration 模型**

`backend/src/models/Inspiration.js`:
```javascript
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
```

- [ ] **Step 4: 创建 Image 模型**

`backend/src/models/Image.js`:
```javascript
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
```

- [ ] **Step 5: 创建模型关联与初始化**

`backend/src/models/index.js`:
```javascript
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
```

- [ ] **Step 6: 创建数据库同步脚本**

`backend/src/scripts/syncDb.js`:
```javascript
import sequelize from '../config/database.js';
import { Category, DailyRecord, Inspiration, Image } from '../models/index.js';

async function syncDb() {
  try {
    await sequelize.authenticate();
    console.log('[DB] 数据库连接成功');

    // alter: true 会自动更新表结构以匹配模型
    await sequelize.sync({ alter: true });
    console.log('[DB] 所有模型同步成功');

    process.exit(0);
  } catch (err) {
    console.error('[DB] 同步失败:', err.message);
    process.exit(1);
  }
}

syncDb();
```

- [ ] **Step 7: 创建种子数据脚本**

`backend/src/scripts/seedDb.js`:
```javascript
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

    // 只插入不存在的预设分类
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
```

- [ ] **Step 8: 运行数据库同步**

确保 MySQL 中已创建 `calendar_board` 数据库：
```sql
CREATE DATABASE IF NOT EXISTS calendar_board CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

Run:
```powershell
cd c:\Users\306\Desktop\作品集\calendar-board\backend
npm run db:sync
```
Expected: 控制台输出 `[DB] 所有模型同步成功`

- [ ] **Step 9: 运行种子数据**

Run:
```powershell
npm run db:seed
```
Expected: 控制台输出 8 个分类的创建信息

- [ ] **Step 10: 提交**

```bash
git add .
git commit -m "feat: 数据库模型定义与预设分类种子数据"
```

---

## Task 3: 分类管理 API

**Files:**
- Create: `backend/src/controllers/categoryController.js`
- Create: `backend/src/routes/categoryRoutes.js`
- Create: `backend/src/routes/index.js`
- Modify: `backend/src/app.js`（挂载路由）

**Interfaces:**
- Consumes: Task 2 的 Category 模型
- Produces: GET/POST/PUT/DELETE `/api/categories` 接口

- [ ] **Step 1: 创建分类控制器**

`backend/src/controllers/categoryController.js`:
```javascript
import { Category } from '../models/index.js';

// 获取所有分类
export async function getCategories(req, res, next) {
  try {
    const { type } = req.query;
    const where = {};
    if (type) {
      where.type = type;
    }
    const categories = await Category.findAll({ where, order: [['id', 'ASC']] });
    res.json({ code: 0, message: 'success', data: categories });
  } catch (err) {
    next(err);
  }
}

// 新增分类
export async function createCategory(req, res, next) {
  try {
    const { name, type, color } = req.body;
    if (!name || !type) {
      return res.status(400).json({
        code: 400,
        message: '分类名称和类型不能为空',
        data: null,
      });
    }
    const category = await Category.create({
      name,
      type,
      color: color || '#00ff88',
      is_default: false,
    });
    res.status(201).json({ code: 0, message: 'success', data: category });
  } catch (err) {
    next(err);
  }
}

// 修改分类
export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, color } = req.body;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        code: 404,
        message: '分类不存在',
        data: null,
      });
    }
    if (name !== undefined) category.name = name;
    if (color !== undefined) category.color = color;
    await category.save();
    res.json({ code: 0, message: 'success', data: category });
  } catch (err) {
    next(err);
  }
}

// 删除分类（仅非预设分类）
export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        code: 404,
        message: '分类不存在',
        data: null,
      });
    }
    if (category.is_default) {
      return res.status(400).json({
        code: 400,
        message: '预设分类不可删除',
        data: null,
      });
    }
    await category.destroy();
    res.json({ code: 0, message: 'success', data: null });
  } catch (err) {
    next(err);
  }
}
```

- [ ] **Step 2: 创建分类路由**

`backend/src/routes/categoryRoutes.js`:
```javascript
import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';

const router = Router();

router.get('/', getCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
```

- [ ] **Step 3: 创建路由汇总**

`backend/src/routes/index.js`:
```javascript
import { Router } from 'express';
import categoryRoutes from './categoryRoutes.js';

const router = Router();

router.use('/categories', categoryRoutes);

export default router;
```

- [ ] **Step 4: 在 app.js 中挂载路由**

修改 `backend/src/app.js`，在健康检查之后、notFound 之前添加：

```javascript
import routes from './routes/index.js';

// ... 健康检查 ...

// API 路由
app.use('/api', routes);
```

完整修改后的 `backend/src/app.js`：
```javascript
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

start();
```

- [ ] **Step 5: 验证分类 API**

启动后端服务后，用浏览器或 curl 测试：

Run:
```powershell
# 获取所有分类
curl http://localhost:3001/api/categories

# 获取日常分类
curl "http://localhost:3001/api/categories?type=daily"

# 新增分类
curl -X POST http://localhost:3001/api/categories -H "Content-Type: application/json" -d "{\"name\":\"测试分类\",\"type\":\"daily\",\"color\":\"#ff0000\"}"

# 修改分类
curl -X PUT http://localhost:3001/api/categories/9 -H "Content-Type: application/json" -d "{\"name\":\"测试改名\"}"

# 删除分类
curl -X DELETE http://localhost:3001/api/categories/9
```
Expected: 各接口返回正确的 JSON 响应

- [ ] **Step 6: 提交**

```bash
git add .
git commit -m "feat: 分类管理 CRUD API"
```

---

## Task 4: 日常记录 API

**Files:**
- Create: `backend/src/controllers/dailyRecordController.js`
- Create: `backend/src/routes/dailyRecordRoutes.js`
- Modify: `backend/src/routes/index.js`

**Interfaces:**
- Consumes: Task 2 的 DailyRecord, Image, Category 模型
- Produces: GET/POST/PUT/DELETE `/api/daily-records` 接口

- [ ] **Step 1: 创建日常记录控制器**

`backend/src/controllers/dailyRecordController.js`:
```javascript
import { DailyRecord, Image, Category } from '../models/index.js';
import { Op } from 'sequelize';

// 获取日常记录列表
export async function getDailyRecords(req, res, next) {
  try {
    const { start_date, end_date, category_id } = req.query;
    const where = {};
    if (start_date || end_date) {
      where.record_date = {};
      if (start_date) where.record_date[Op.gte] = start_date;
      if (end_date) where.record_date[Op.lte] = end_date;
    }
    if (category_id) {
      where.category_id = category_id;
    }
    const records = await DailyRecord.findAll({
      where,
      include: [
        { model: Category, as: 'category' },
        { model: Image, as: 'images' },
      ],
      order: [['record_date', 'DESC'], ['created_at', 'DESC']],
    });
    res.json({ code: 0, message: 'success', data: records });
  } catch (err) {
    next(err);
  }
}

// 获取单条日常记录
export async function getDailyRecord(req, res, next) {
  try {
    const { id } = req.params;
    const record = await DailyRecord.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: Image, as: 'images' },
      ],
    });
    if (!record) {
      return res.status(404).json({
        code: 404,
        message: '记录不存在',
        data: null,
      });
    }
    res.json({ code: 0, message: 'success', data: record });
  } catch (err) {
    next(err);
  }
}

// 新增日常记录
export async function createDailyRecord(req, res, next) {
  try {
    const { title, content, record_date, category_id, images } = req.body;
    if (!title || !record_date) {
      return res.status(400).json({
        code: 400,
        message: '标题和日期不能为空',
        data: null,
      });
    }
    const record = await DailyRecord.create({
      title,
      content: content || '',
      record_date,
      category_id: category_id || null,
    });
    // 如果有图片 URL，创建图片记录
    if (images && Array.isArray(images) && images.length > 0) {
      await Image.bulkCreate(
        images.map((img) => ({
          supabase_url: img.url,
          supabase_path: img.path,
          record_type: 'daily',
          record_id: record.id,
        }))
      );
    }
    // 重新查询以包含关联数据
    const result = await DailyRecord.findByPk(record.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Image, as: 'images' },
      ],
    });
    res.status(201).json({ code: 0, message: 'success', data: result });
  } catch (err) {
    next(err);
  }
}

// 修改日常记录
export async function updateDailyRecord(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content, record_date, category_id, images } = req.body;
    const record = await DailyRecord.findByPk(id);
    if (!record) {
      return res.status(404).json({
        code: 404,
        message: '记录不存在',
        data: null,
      });
    }
    if (title !== undefined) record.title = title;
    if (content !== undefined) record.content = content;
    if (record_date !== undefined) record.record_date = record_date;
    if (category_id !== undefined) record.category_id = category_id;
    await record.save();

    // 如果传了 images，更新图片关联
    if (images && Array.isArray(images)) {
      await Image.destroy({ where: { record_type: 'daily', record_id: id } });
      if (images.length > 0) {
        await Image.bulkCreate(
          images.map((img) => ({
            supabase_url: img.url,
            supabase_path: img.path,
            record_type: 'daily',
            record_id: id,
          }))
        );
      }
    }

    const result = await DailyRecord.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: Image, as: 'images' },
      ],
    });
    res.json({ code: 0, message: 'success', data: result });
  } catch (err) {
    next(err);
  }
}

// 删除日常记录
export async function deleteDailyRecord(req, res, next) {
  try {
    const { id } = req.params;
    const record = await DailyRecord.findByPk(id);
    if (!record) {
      return res.status(404).json({
        code: 404,
        message: '记录不存在',
        data: null,
      });
    }
    await Image.destroy({ where: { record_type: 'daily', record_id: id } });
    await record.destroy();
    res.json({ code: 0, message: 'success', data: null });
  } catch (err) {
    next(err);
  }
}
```

- [ ] **Step 2: 创建日常记录路由**

`backend/src/routes/dailyRecordRoutes.js`:
```javascript
import { Router } from 'express';
import {
  getDailyRecords,
  getDailyRecord,
  createDailyRecord,
  updateDailyRecord,
  deleteDailyRecord,
} from '../controllers/dailyRecordController.js';

const router = Router();

router.get('/', getDailyRecords);
router.get('/:id', getDailyRecord);
router.post('/', createDailyRecord);
router.put('/:id', updateDailyRecord);
router.delete('/:id', deleteDailyRecord);

export default router;
```

- [ ] **Step 3: 在路由汇总中添加日常记录路由**

修改 `backend/src/routes/index.js`：
```javascript
import { Router } from 'express';
import categoryRoutes from './categoryRoutes.js';
import dailyRecordRoutes from './dailyRecordRoutes.js';

const router = Router();

router.use('/categories', categoryRoutes);
router.use('/daily-records', dailyRecordRoutes);

export default router;
```

- [ ] **Step 4: 验证日常记录 API**

Run:
```powershell
# 新增日常记录
curl -X POST http://localhost:3001/api/daily-records -H "Content-Type: application/json" -d "{\"title\":\"测试记录\",\"content\":\"今天写代码\",\"record_date\":\"2026-07-02\",\"category_id\":1}"

# 获取列表
curl http://localhost:3001/api/daily-records

# 按日期范围查询
curl "http://localhost:3001/api/daily-records?start_date=2026-07-01&end_date=2026-07-31"

# 修改
curl -X PUT http://localhost:3001/api/daily-records/1 -H "Content-Type: application/json" -d "{\"title\":\"修改标题\"}"

# 删除
curl -X DELETE http://localhost:3001/api/daily-records/1
```
Expected: 各接口返回正确的 JSON 响应

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat: 日常记录 CRUD API"
```

---

## Task 5: 灵感碎片 API

**Files:**
- Create: `backend/src/controllers/inspirationController.js`
- Create: `backend/src/routes/inspirationRoutes.js`
- Modify: `backend/src/routes/index.js`

**Interfaces:**
- Consumes: Task 2 的 Inspiration, Image, Category 模型
- Produces: GET/POST/PUT/DELETE `/api/inspirations` 接口

- [ ] **Step 1: 创建灵感碎片控制器**

`backend/src/controllers/inspirationController.js`:
```javascript
import { Inspiration, Image, Category } from '../models/index.js';
import { Op } from 'sequelize';

// 获取灵感碎片列表
export async function getInspirations(req, res, next) {
  try {
    const { start_date, end_date, category_id } = req.query;
    const where = {};
    if (start_date || end_date) {
      where.record_date = {};
      if (start_date) where.record_date[Op.gte] = start_date;
      if (end_date) where.record_date[Op.lte] = end_date;
    }
    if (category_id) {
      where.category_id = category_id;
    }
    const records = await Inspiration.findAll({
      where,
      include: [
        { model: Category, as: 'category' },
        { model: Image, as: 'images' },
      ],
      order: [['record_date', 'DESC'], ['created_at', 'DESC']],
    });
    res.json({ code: 0, message: 'success', data: records });
  } catch (err) {
    next(err);
  }
}

// 获取单条灵感碎片
export async function getInspiration(req, res, next) {
  try {
    const { id } = req.params;
    const record = await Inspiration.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: Image, as: 'images' },
      ],
    });
    if (!record) {
      return res.status(404).json({
        code: 404,
        message: '灵感不存在',
        data: null,
      });
    }
    res.json({ code: 0, message: 'success', data: record });
  } catch (err) {
    next(err);
  }
}

// 新增灵感碎片
export async function createInspiration(req, res, next) {
  try {
    const { title, content, record_date, category_id, images } = req.body;
    if (!title || !record_date) {
      return res.status(400).json({
        code: 400,
        message: '标题和日期不能为空',
        data: null,
      });
    }
    const record = await Inspiration.create({
      title,
      content: content || '',
      record_date,
      category_id: category_id || null,
    });
    if (images && Array.isArray(images) && images.length > 0) {
      await Image.bulkCreate(
        images.map((img) => ({
          supabase_url: img.url,
          supabase_path: img.path,
          record_type: 'inspiration',
          record_id: record.id,
        }))
      );
    }
    const result = await Inspiration.findByPk(record.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Image, as: 'images' },
      ],
    });
    res.status(201).json({ code: 0, message: 'success', data: result });
  } catch (err) {
    next(err);
  }
}

// 修改灵感碎片
export async function updateInspiration(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content, record_date, category_id, images } = req.body;
    const record = await Inspiration.findByPk(id);
    if (!record) {
      return res.status(404).json({
        code: 404,
        message: '灵感不存在',
        data: null,
      });
    }
    if (title !== undefined) record.title = title;
    if (content !== undefined) record.content = content;
    if (record_date !== undefined) record.record_date = record_date;
    if (category_id !== undefined) record.category_id = category_id;
    await record.save();

    if (images && Array.isArray(images)) {
      await Image.destroy({ where: { record_type: 'inspiration', record_id: id } });
      if (images.length > 0) {
        await Image.bulkCreate(
          images.map((img) => ({
            supabase_url: img.url,
            supabase_path: img.path,
            record_type: 'inspiration',
            record_id: id,
          }))
        );
      }
    }

    const result = await Inspiration.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: Image, as: 'images' },
      ],
    });
    res.json({ code: 0, message: 'success', data: result });
  } catch (err) {
    next(err);
  }
}

// 删除灵感碎片
export async function deleteInspiration(req, res, next) {
  try {
    const { id } = req.params;
    const record = await Inspiration.findByPk(id);
    if (!record) {
      return res.status(404).json({
        code: 404,
        message: '灵感不存在',
        data: null,
      });
    }
    await Image.destroy({ where: { record_type: 'inspiration', record_id: id } });
    await record.destroy();
    res.json({ code: 0, message: 'success', data: null });
  } catch (err) {
    next(err);
  }
}
```

- [ ] **Step 2: 创建灵感碎片路由**

`backend/src/routes/inspirationRoutes.js`:
```javascript
import { Router } from 'express';
import {
  getInspirations,
  getInspiration,
  createInspiration,
  updateInspiration,
  deleteInspiration,
} from '../controllers/inspirationController.js';

const router = Router();

router.get('/', getInspirations);
router.get('/:id', getInspiration);
router.post('/', createInspiration);
router.put('/:id', updateInspiration);
router.delete('/:id', deleteInspiration);

export default router;
```

- [ ] **Step 3: 在路由汇总中添加灵感碎片路由**

修改 `backend/src/routes/index.js`：
```javascript
import { Router } from 'express';
import categoryRoutes from './categoryRoutes.js';
import dailyRecordRoutes from './dailyRecordRoutes.js';
import inspirationRoutes from './inspirationRoutes.js';

const router = Router();

router.use('/categories', categoryRoutes);
router.use('/daily-records', dailyRecordRoutes);
router.use('/inspirations', inspirationRoutes);

export default router;
```

- [ ] **Step 4: 验证灵感碎片 API**

Run:
```powershell
# 新增
curl -X POST http://localhost:3001/api/inspirations -H "Content-Type: application/json" -d "{\"title\":\"灵感1\",\"content\":\"一个很棒的想法\",\"record_date\":\"2026-07-02\",\"category_id\":5}"

# 获取列表
curl http://localhost:3001/api/inspirations
```
Expected: 各接口返回正确的 JSON 响应

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat: 灵感碎片 CRUD API"
```

---

## Task 6: 图片上传 API（Supabase Storage）

**Files:**
- Create: `backend/src/controllers/uploadController.js`
- Create: `backend/src/routes/uploadRoutes.js`
- Modify: `backend/src/routes/index.js`

**Interfaces:**
- Consumes: Task 1 的 supabase 客户端
- Produces: POST `/api/upload/image` 接口，返回 `{ url, path }`

- [ ] **Step 1: 创建图片上传控制器**

`backend/src/controllers/uploadController.js`:
```javascript
import supabase from '../config/supabase.js';

// 上传图片到 Supabase Storage
export async function uploadImage(req, res, next) {
  try {
    if (!supabase) {
      return res.status(503).json({
        code: 503,
        message: 'Supabase 未配置，图片上传不可用',
        data: null,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        code: 400,
        message: '请选择要上传的图片',
        data: null,
      });
    }

    const file = req.file;
    const ext = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `images/${fileName}`;

    const { data, error } = await supabase.storage
      .from('calendar-board')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('[Supabase] 上传失败:', error.message);
      return res.status(500).json({
        code: 500,
        message: '图片上传失败: ' + error.message,
        data: null,
      });
    }

    // 获取公开访问 URL
    const { data: urlData } = supabase.storage
      .from('calendar-board')
      .getPublicUrl(filePath);

    res.json({
      code: 0,
      message: 'success',
      data: {
        url: urlData.publicUrl,
        path: filePath,
      },
    });
  } catch (err) {
    next(err);
  }
}
```

- [ ] **Step 2: 创建图片上传路由**

`backend/src/routes/uploadRoutes.js`:
```javascript
import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadController.js';

const router = Router();

// 内存存储，不写磁盘
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的图片格式，仅支持 JPEG/PNG/GIF/WebP'));
    }
  },
});

router.post('/image', upload.single('image'), uploadImage);

export default router;
```

- [ ] **Step 3: 在路由汇总中添加上传路由**

修改 `backend/src/routes/index.js`：
```javascript
import { Router } from 'express';
import categoryRoutes from './categoryRoutes.js';
import dailyRecordRoutes from './dailyRecordRoutes.js';
import inspirationRoutes from './inspirationRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = Router();

router.use('/categories', categoryRoutes);
router.use('/daily-records', dailyRecordRoutes);
router.use('/inspirations', inspirationRoutes);
router.use('/upload', uploadRoutes);

export default router;
```

- [ ] **Step 4: 提交**

```bash
git add .
git commit -m "feat: 图片上传 API（Supabase Storage）"
```

---

## Task 7: 前端项目初始化

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.js`
- Create: `frontend/tailwind.config.js`
- Create: `frontend/postcss.config.js`
- Create: `frontend/index.html`
- Create: `frontend/src/main.js`
- Create: `frontend/src/style.css`
- Create: `frontend/src/App.vue`

**Interfaces:**
- Produces: Vue 3 + Vite + Tailwind CSS 前端项目框架

- [ ] **Step 1: 创建 Vue 项目**

Run:
```powershell
cd c:\Users\306\Desktop\作品集\calendar-board
npm create vite@latest frontend -- --template vue
```

- [ ] **Step 2: 安装前端依赖**

Run:
```powershell
cd c:\Users\306\Desktop\作品集\calendar-board\frontend
npm install
npm install pinia axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 3: 配置 Tailwind CSS（暗色终端风格）**

`frontend/tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 暗色终端风格配色
        terminal: {
          bg: '#0a0a0f',
          card: '#111118',
          hover: '#161b22',
          border: '#21262d',
          green: '#00ff88',
          blue: '#58a6ff',
          purple: '#d2a8ff',
          red: '#ff7b72',
          yellow: '#ffd700',
          text: '#e6edf3',
          muted: '#8b949e',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: 配置全局样式**

`frontend/src/style.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-terminal-bg text-terminal-text font-mono;
    margin: 0;
    min-height: 100vh;
  }

  * {
    box-sizing: border-box;
  }
}

@layer components {
  .terminal-card {
    @apply bg-terminal-card border border-terminal-border rounded-lg;
  }

  .terminal-input {
    @apply bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-text focus:border-terminal-green focus:outline-none transition-colors;
  }

  .terminal-btn {
    @apply bg-terminal-green text-terminal-bg font-bold px-4 py-2 rounded hover:opacity-80 transition-opacity cursor-pointer border-none;
  }

  .terminal-btn-secondary {
    @apply bg-transparent text-terminal-green border border-terminal-green px-4 py-2 rounded hover:bg-terminal-green hover:text-terminal-bg transition-colors cursor-pointer;
  }

  .terminal-tag {
    @apply inline-block text-xs px-2 py-0.5 rounded-full border;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #0a0a0f;
}

::-webkit-scrollbar-thumb {
  background: #21262d;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #30363d;
}
```

- [ ] **Step 5: 配置 Vite 代理**

`frontend/vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

- [ ] **Step 6: 创建入口文件**

`frontend/src/main.js`:
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

- [ ] **Step 7: 创建根组件骨架**

`frontend/src/App.vue`:
```vue
<template>
  <div id="app" class="min-h-screen p-4">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl text-terminal-green mb-6">
        <span class="text-terminal-muted">$</span> 日历看板
      </h1>
      <p class="text-terminal-muted">正在加载...</p>
    </div>
  </div>
</template>

<script setup>
</script>
```

- [ ] **Step 8: 验证前端启动**

Run:
```powershell
cd c:\Users\306\Desktop\作品集\calendar-board\frontend
npm run dev
```
Expected: 浏览器打开 http://localhost:5173 显示暗色背景 + 绿色标题

- [ ] **Step 9: 提交**

```bash
cd c:\Users\306\Desktop\作品集\calendar-board
git add .
git commit -m "feat: 前端项目初始化（Vue 3 + Tailwind CSS 暗色终端风格）"
```

---

## Task 8: 前端 API 封装与状态管理

**Files:**
- Create: `frontend/src/api/index.js`
- Create: `frontend/src/api/category.js`
- Create: `frontend/src/api/dailyRecord.js`
- Create: `frontend/src/api/inspiration.js`
- Create: `frontend/src/api/upload.js`
- Create: `frontend/src/stores/category.js`
- Create: `frontend/src/stores/calendar.js`
- Create: `frontend/src/stores/dailyRecord.js`
- Create: `frontend/src/stores/inspiration.js`
- Create: `frontend/src/utils/date.js`

**Interfaces:**
- Consumes: Task 3-6 的后端 API
- Produces: 前端 API 层 + Pinia stores，供组件使用

- [ ] **Step 1: 创建 Axios 实例**

`frontend/src/api/index.js`:
```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
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

- [ ] **Step 2: 创建分类 API**

`frontend/src/api/category.js`:
```javascript
import api from './index.js'

export function getCategories(type = null) {
  const params = {}
  if (type) params.type = type
  return api.get('/categories', { params })
}

export function createCategory(data) {
  return api.post('/categories', data)
}

export function updateCategory(id, data) {
  return api.put(`/categories/${id}`, data)
}

export function deleteCategory(id) {
  return api.delete(`/categories/${id}`)
}
```

- [ ] **Step 3: 创建日常记录 API**

`frontend/src/api/dailyRecord.js`:
```javascript
import api from './index.js'

export function getDailyRecords(params = {}) {
  return api.get('/daily-records', { params })
}

export function getDailyRecord(id) {
  return api.get(`/daily-records/${id}`)
}

export function createDailyRecord(data) {
  return api.post('/daily-records', data)
}

export function updateDailyRecord(id, data) {
  return api.put(`/daily-records/${id}`, data)
}

export function deleteDailyRecord(id) {
  return api.delete(`/daily-records/${id}`)
}
```

- [ ] **Step 4: 创建灵感碎片 API**

`frontend/src/api/inspiration.js`:
```javascript
import api from './index.js'

export function getInspirations(params = {}) {
  return api.get('/inspirations', { params })
}

export function getInspiration(id) {
  return api.get(`/inspirations/${id}`)
}

export function createInspiration(data) {
  return api.post('/inspirations', data)
}

export function updateInspiration(id, data) {
  return api.put(`/inspirations/${id}`, data)
}

export function deleteInspiration(id) {
  return api.delete(`/inspirations/${id}`)
}
```

- [ ] **Step 5: 创建图片上传 API**

`frontend/src/api/upload.js`:
```javascript
import api from './index.js'

export function uploadImage(file) {
  const formData = new FormData()
  formData.append('image', file)
  return api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
```

- [ ] **Step 6: 创建日期工具函数**

`frontend/src/utils/date.js`:
```javascript
// 获取某月的天数
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

// 获取某月第一天是星期几（0=周日，调整为周一开始）
export function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1 // 转为 0=周一
}

// 格式化日期为 YYYY-MM-DD
export function formatDate(year, month, day) {
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

// 获取今天的日期对象
export function getToday() {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate(),
    dateStr: formatDate(now.getFullYear(), now.getMonth(), now.getDate()),
  }
}

// 获取月份范围（用于查询）
export function getMonthRange(year, month) {
  const lastDay = getDaysInMonth(year, month)
  return {
    start_date: formatDate(year, month, 1),
    end_date: formatDate(year, month, lastDay),
  }
}
```

- [ ] **Step 7: 创建分类 Store**

`frontend/src/stores/category.js`:
```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/category.js'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([])
  const loading = ref(false)

  async function fetchCategories(type = null) {
    loading.value = true
    try {
      const res = await getCategories(type)
      categories.value = res.data || []
    } catch (err) {
      console.error('获取分类失败:', err.message)
    } finally {
      loading.value = false
    }
  }

  async function addCategory(data) {
    const res = await createCategory(data)
    await fetchCategories()
    return res
  }

  async function editCategory(id, data) {
    const res = await updateCategory(id, data)
    await fetchCategories()
    return res
  }

  async function removeCategory(id) {
    const res = await deleteCategory(id)
    await fetchCategories()
    return res
  }

  return { categories, loading, fetchCategories, addCategory, editCategory, removeCategory }
})
```

- [ ] **Step 8: 创建日历 Store**

`frontend/src/stores/calendar.js`:
```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getToday, getMonthRange } from '../utils/date.js'

export const useCalendarStore = defineStore('calendar', () => {
  const today = getToday()
  const currentYear = ref(today.year)
  const currentMonth = ref(today.month)
  const selectedDate = ref(null) // 选中的日期字符串 YYYY-MM-DD

  // 当前月份的查询范围
  const monthRange = computed(() => {
    return getMonthRange(currentYear.value, currentMonth.value)
  })

  function previousMonth() {
    if (currentMonth.value === 0) {
      currentMonth.value = 11
      currentYear.value--
    } else {
      currentMonth.value--
    }
  }

  function nextMonth() {
    if (currentMonth.value === 11) {
      currentMonth.value = 0
      currentYear.value++
    } else {
      currentMonth.value++
    }
  }

  function goToToday() {
    const t = getToday()
    currentYear.value = t.year
    currentMonth.value = t.month
    selectedDate.value = t.dateStr
  }

  function selectDate(dateStr) {
    selectedDate.value = dateStr
  }

  return {
    currentYear,
    currentMonth,
    selectedDate,
    monthRange,
    previousMonth,
    nextMonth,
    goToToday,
    selectDate,
  }
})
```

- [ ] **Step 9: 创建日常记录 Store**

`frontend/src/stores/dailyRecord.js`:
```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getDailyRecords,
  createDailyRecord,
  updateDailyRecord,
  deleteDailyRecord,
} from '../api/dailyRecord.js'

export const useDailyRecordStore = defineStore('dailyRecord', () => {
  const records = ref([])
  const loading = ref(false)

  async function fetchRecords(params = {}) {
    loading.value = true
    try {
      const res = await getDailyRecords(params)
      records.value = res.data || []
    } catch (err) {
      console.error('获取日常记录失败:', err.message)
    } finally {
      loading.value = false
    }
  }

  async function addRecord(data) {
    const res = await createDailyRecord(data)
    return res
  }

  async function editRecord(id, data) {
    const res = await updateDailyRecord(id, data)
    return res
  }

  async function removeRecord(id) {
    const res = await deleteDailyRecord(id)
    return res
  }

  return { records, loading, fetchRecords, addRecord, editRecord, removeRecord }
})
```

- [ ] **Step 10: 创建灵感碎片 Store**

`frontend/src/stores/inspiration.js`:
```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getInspirations,
  createInspiration,
  updateInspiration,
  deleteInspiration,
} from '../api/inspiration.js'

export const useInspirationStore = defineStore('inspiration', () => {
  const records = ref([])
  const loading = ref(false)

  async function fetchRecords(params = {}) {
    loading.value = true
    try {
      const res = await getInspirations(params)
      records.value = res.data || []
    } catch (err) {
      console.error('获取灵感碎片失败:', err.message)
    } finally {
      loading.value = false
    }
  }

  async function addRecord(data) {
    const res = await createInspiration(data)
    return res
  }

  async function editRecord(id, data) {
    const res = await updateInspiration(id, data)
    return res
  }

  async function removeRecord(id) {
    const res = await deleteInspiration(id)
    return res
  }

  return { records, loading, fetchRecords, addRecord, editRecord, removeRecord }
})
```

- [ ] **Step 11: 提交**

```bash
git add .
git commit -m "feat: 前端 API 封装与 Pinia 状态管理"
```

---

## Task 9: 日历看板核心组件

**Files:**
- Create: `frontend/src/components/CalendarGrid.vue`
- Create: `frontend/src/components/CategoryFilter.vue`

**Interfaces:**
- Consumes: Task 8 的 calendarStore, dailyRecordStore, inspirationStore, categoryStore
- Produces: CalendarGrid 组件（月视图网格），CategoryFilter 组件

- [ ] **Step 1: 创建日历网格组件**

`frontend/src/components/CalendarGrid.vue`:
```vue
<template>
  <div class="terminal-card p-4">
    <!-- 月份导航 -->
    <div class="flex items-center justify-between mb-4">
      <button @click="calendarStore.previousMonth()" class="terminal-btn-secondary text-sm">
        &lt; 上月
      </button>
      <h2 class="text-xl text-terminal-green">
        {{ calendarStore.currentYear }}年{{ calendarStore.currentMonth + 1 }}月
      </h2>
      <button @click="calendarStore.nextMonth()" class="terminal-btn-secondary text-sm">
        下月 &gt;
      </button>
    </div>

    <!-- 星期标题 -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div v-for="day in weekDays" :key="day"
        class="text-center text-terminal-muted text-sm py-2">
        {{ day }}
      </div>
    </div>

    <!-- 日期网格 -->
    <div class="grid grid-cols-7 gap-1">
      <div v-for="(cell, index) in calendarCells" :key="index"
        @click="cell.day && onDayClick(cell)"
        :class="[
          'min-h-[80px] p-2 rounded border cursor-pointer transition-colors',
          cell.day ? 'border-terminal-border hover:border-terminal-green hover:bg-terminal-hover' : 'border-transparent cursor-default',
          cell.isToday ? 'border-terminal-green bg-terminal-green/5' : '',
          cell.isSelected ? 'ring-1 ring-terminal-green' : ''
        ]">
        <div v-if="cell.day" class="text-sm" :class="cell.isToday ? 'text-terminal-green font-bold' : 'text-terminal-text'">
          {{ cell.day }}
        </div>
        <!-- 标签摘要 -->
        <div v-if="cell.day && cell.tags.length > 0" class="mt-1 flex flex-wrap gap-1">
          <span v-for="(tag, i) in cell.tags.slice(0, 3)" :key="i"
            class="terminal-tag text-xs"
            :style="{ borderColor: tag.color, color: tag.color }">
            {{ tag.label }}
          </span>
          <span v-if="cell.tags.length > 3" class="text-xs text-terminal-muted">
            +{{ cell.tags.length - 3 }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCalendarStore } from '../stores/calendar.js'
import { useDailyRecordStore } from '../stores/dailyRecord.js'
import { useInspirationStore } from '../stores/inspiration.js'
import { useCategoryStore } from '../stores/category.js'
import { getDaysInMonth, getFirstDayOfMonth, formatDate, getToday } from '../utils/date.js'

const calendarStore = useCalendarStore()
const dailyRecordStore = useDailyRecordStore()
const inspirationStore = useInspirationStore()
const categoryStore = useCategoryStore()

const emit = defineEmits(['dayClick'])

const weekDays = ['一', '二', '三', '四', '五', '六', '日']

const today = getToday()

// 构建日历单元格数据
const calendarCells = computed(() => {
  const year = calendarStore.currentYear
  const month = calendarStore.currentMonth
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const cells = []

  // 填充月初空白
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: null, tags: [] })
  }

  // 填充日期
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(year, month, day)
    const tags = []

    // 查找当天的日常记录
    const dailyRecords = dailyRecordStore.records.filter(r => r.record_date === dateStr)
    for (const record of dailyRecords) {
      const cat = categoryStore.categories.find(c => c.id === record.category_id)
      tags.push({
        label: record.title.length > 6 ? record.title.substring(0, 6) + '...' : record.title,
        color: cat?.color || '#00ff88',
      })
    }

    // 查找当天的灵感碎片
    const inspirations = inspirationStore.records.filter(r => r.record_date === dateStr)
    for (const insp of inspirations) {
      const cat = categoryStore.categories.find(c => c.id === insp.category_id)
      tags.push({
        label: insp.title.length > 6 ? insp.title.substring(0, 6) + '...' : insp.title,
        color: cat?.color || '#ffd700',
      })
    }

    cells.push({
      day,
      dateStr,
      tags,
      isToday: dateStr === today.dateStr,
      isSelected: dateStr === calendarStore.selectedDate,
    })
  }

  return cells
})

function onDayClick(cell) {
  calendarStore.selectDate(cell.dateStr)
  emit('dayClick', cell.dateStr)
}
</script>
```

- [ ] **Step 2: 创建分类筛选组件**

`frontend/src/components/CategoryFilter.vue`:
```vue
<template>
  <div class="flex items-center gap-2 flex-wrap">
    <span class="text-terminal-muted text-sm">筛选:</span>
    <button @click="selectCategory(null)"
      :class="['terminal-tag cursor-pointer', activeId === null ? 'border-terminal-green text-terminal-green' : 'border-terminal-border text-terminal-muted']">
      全部
    </button>
    <button v-for="cat in categories" :key="cat.id"
      @click="selectCategory(cat.id)"
      :class="['terminal-tag cursor-pointer', activeId === cat.id ? '' : 'opacity-50']"
      :style="{ borderColor: cat.color, color: cat.color }">
      {{ cat.name }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: [Number, null],
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const activeId = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  activeId.value = val
})

function selectCategory(id) {
  activeId.value = id
  emit('update:modelValue', id)
}
</script>
```

- [ ] **Step 3: 提交**

```bash
git add .
git commit -m "feat: 日历看板核心组件（CalendarGrid + CategoryFilter）"
```

---

## Task 10: 输入组件（日常记录 + 灵感碎片 + 图片上传）

**Files:**
- Create: `frontend/src/components/ImageUploader.vue`
- Create: `frontend/src/components/CategorySelect.vue`
- Create: `frontend/src/components/DailyInput.vue`
- Create: `frontend/src/components/InspirationInput.vue`

**Interfaces:**
- Consumes: Task 8 的 stores 和 API
- Produces: 四个输入相关组件

- [ ] **Step 1: 创建图片上传组件**

`frontend/src/components/ImageUploader.vue`:
```vue
<template>
  <div>
    <div class="flex items-center gap-2 mb-2">
      <label class="terminal-btn-secondary text-sm cursor-pointer">
        <input type="file" accept="image/*" multiple @change="onFileChange" class="hidden" />
        上传图片
      </label>
      <span class="text-terminal-muted text-xs">支持 JPEG/PNG/GIF/WebP，最大 5MB</span>
    </div>

    <!-- 预览区 -->
    <div v-if="previewImages.length > 0" class="flex flex-wrap gap-2 mt-2">
      <div v-for="(img, index) in previewImages" :key="index"
        class="relative w-20 h-20 rounded overflow-hidden border border-terminal-border">
        <img :src="img.url" class="w-full h-full object-cover" />
        <button @click="removeImage(index)"
          class="absolute top-0 right-0 bg-terminal-red text-white text-xs w-5 h-5 flex items-center justify-center rounded-bl">
          x
        </button>
        <div v-if="img.uploading" class="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span class="text-terminal-green text-xs">上传中...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { uploadImage } from '../api/upload.js'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const previewImages = ref([...props.modelValue])

watch(() => props.modelValue, (val) => {
  previewImages.value = [...val]
})

async function onFileChange(e) {
  const files = Array.from(e.target.files)
  for (const file of files) {
    // 校验大小
    if (file.size > 5 * 1024 * 1024) {
      alert(`图片 ${file.name} 超过 5MB 限制`)
      continue
    }

    const previewUrl = URL.createObjectURL(file)
    const imgObj = {
      url: previewUrl,
      uploading: true,
      path: null,
    }
    previewImages.value.push(imgObj)

    try {
      const res = await uploadImage(file)
      imgObj.url = res.data.url
      imgObj.path = res.data.path
      imgObj.uploading = false
      emitUpdate()
    } catch (err) {
      alert('图片上传失败: ' + (err.message || '未知错误'))
      // 移除失败的图片
      const idx = previewImages.value.indexOf(imgObj)
      if (idx > -1) previewImages.value.splice(idx, 1)
    }
  }
  // 清空 input 以便重复选择同一文件
  e.target.value = ''
}

function removeImage(index) {
  previewImages.value.splice(index, 1)
  emitUpdate()
}

function emitUpdate() {
  const uploaded = previewImages.value
    .filter(img => !img.uploading && img.path)
    .map(img => ({ url: img.url, path: img.path }))
  emit('update:modelValue', uploaded)
}
</script>
```

- [ ] **Step 2: 创建分类下拉选择组件**

`frontend/src/components/CategorySelect.vue`:
```vue
<template>
  <select :value="modelValue" @change="onChange"
    class="terminal-input w-full">
    <option :value="null">-- 选择分类 --</option>
    <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">
      {{ cat.name }}
    </option>
  </select>
</template>

<script setup>
import { computed } from 'vue'
import { useCategoryStore } from '../stores/category.js'

const props = defineProps({
  modelValue: {
    type: [Number, null],
    default: null,
  },
  type: {
    type: String,
    default: 'daily',
  },
})

const emit = defineEmits(['update:modelValue'])

const categoryStore = useCategoryStore()

const filteredCategories = computed(() => {
  return categoryStore.categories.filter(c => c.type === props.type)
})

function onChange(e) {
  const val = e.target.value ? Number(e.target.value) : null
  emit('update:modelValue', val)
}
</script>
```

- [ ] **Step 3: 创建日常记录输入组件**

`frontend/src/components/DailyInput.vue`:
```vue
<template>
  <div class="terminal-card p-4">
    <h3 class="text-terminal-green mb-3 flex items-center gap-2">
      <span>$</span> 记录日常
    </h3>

    <div class="space-y-3">
      <!-- 标题 -->
      <input v-model="form.title" type="text" placeholder="标题..."
        class="terminal-input w-full" />

      <!-- 内容 -->
      <textarea v-model="form.content" placeholder="今天发生了什么..."
        class="terminal-input w-full h-24 resize-none"></textarea>

      <!-- 分类选择 -->
      <div class="flex items-center gap-2">
        <span class="text-terminal-muted text-sm whitespace-nowrap">分类:</span>
        <CategorySelect v-model="form.category_id" type="daily" class="flex-1" />
      </div>

      <!-- 图片上传 -->
      <ImageUploader v-model="form.images" />

      <!-- 保存按钮 -->
      <button @click="handleSave" :disabled="saving"
        class="terminal-btn w-full disabled:opacity-50">
        {{ saving ? '保存中...' : '保存记录' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useDailyRecordStore } from '../stores/dailyRecord.js'
import { useCalendarStore } from '../stores/calendar.js'
import CategorySelect from './CategorySelect.vue'
import ImageUploader from './ImageUploader.vue'
import { getToday } from '../utils/date.js'

const dailyRecordStore = useDailyRecordStore()
const calendarStore = useCalendarStore()

const saving = ref(false)

const form = reactive({
  title: '',
  content: '',
  record_date: getToday().dateStr,
  category_id: null,
  images: [],
})

async function handleSave() {
  if (!form.title.trim()) {
    alert('请输入标题')
    return
  }
  saving.value = true
  try {
    await dailyRecordStore.addRecord({
      title: form.title,
      content: form.content,
      record_date: form.record_date,
      category_id: form.category_id,
      images: form.images,
    })
    // 清空表单
    form.title = ''
    form.content = ''
    form.category_id = null
    form.images = []
    // 触发刷新
    emitRefresh()
  } catch (err) {
    alert('保存失败: ' + (err.message || '未知错误'))
  } finally {
    saving.value = false
  }
}

const emit = defineEmits(['refresh'])
function emitRefresh() {
  emit('refresh')
}
</script>
```

- [ ] **Step 4: 创建灵感碎片输入组件**

`frontend/src/components/InspirationInput.vue`:
```vue
<template>
  <div class="terminal-card p-4">
    <h3 class="text-terminal-yellow mb-3 flex items-center gap-2">
      <span>$</span> 灵感碎片
    </h3>

    <div class="space-y-3">
      <!-- 标题 -->
      <input v-model="form.title" type="text" placeholder="灵感标题..."
        class="terminal-input w-full" />

      <!-- 内容 -->
      <textarea v-model="form.content" placeholder="突然想到的好点子..."
        class="terminal-input w-full h-24 resize-none"></textarea>

      <!-- 分类选择 -->
      <div class="flex items-center gap-2">
        <span class="text-terminal-muted text-sm whitespace-nowrap">分类:</span>
        <CategorySelect v-model="form.category_id" type="inspiration" class="flex-1" />
      </div>

      <!-- 图片上传 -->
      <ImageUploader v-model="form.images" />

      <!-- 保存按钮 -->
      <button @click="handleSave" :disabled="saving"
        class="terminal-btn w-full disabled:opacity-50"
        style="background-color: #ffd700;">
        {{ saving ? '保存中...' : '保存灵感' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useInspirationStore } from '../stores/inspiration.js'
import CategorySelect from './CategorySelect.vue'
import ImageUploader from './ImageUploader.vue'
import { getToday } from '../utils/date.js'

const inspirationStore = useInspirationStore()

const saving = ref(false)

const form = reactive({
  title: '',
  content: '',
  record_date: getToday().dateStr,
  category_id: null,
  images: [],
})

async function handleSave() {
  if (!form.title.trim()) {
    alert('请输入标题')
    return
  }
  saving.value = true
  try {
    await inspirationStore.addRecord({
      title: form.title,
      content: form.content,
      record_date: form.record_date,
      category_id: form.category_id,
      images: form.images,
    })
    form.title = ''
    form.content = ''
    form.category_id = null
    form.images = []
    emitRefresh()
  } catch (err) {
    alert('保存失败: ' + (err.message || '未知错误'))
  } finally {
    saving.value = false
  }
}

const emit = defineEmits(['refresh'])
function emitRefresh() {
  emit('refresh')
}
</script>
```

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat: 输入组件（日常记录 + 灵感碎片 + 图片上传 + 分类选择）"
```

---

## Task 11: 日期详情弹窗组件

**Files:**
- Create: `frontend/src/components/DayDetailModal.vue`

**Interfaces:**
- Consumes: Task 8-10 的 stores 和组件
- Produces: DayDetailModal 组件（点击日期后弹出，显示当天所有记录）

- [ ] **Step 1: 创建日期详情弹窗**

`frontend/src/components/DayDetailModal.vue`:
```vue
<template>
  <!-- 遮罩层 -->
  <div v-if="visible" @click="close" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <!-- 弹窗内容 -->
    <div @click.stop class="terminal-card w-full max-w-2xl max-h-[80vh] flex flex-col">
      <!-- 头部 -->
      <div class="flex items-center justify-between p-4 border-b border-terminal-border">
        <h3 class="text-terminal-green text-lg">
          <span class="text-terminal-muted">$</span> {{ formatDateDisplay }}
        </h3>
        <button @click="close" class="text-terminal-muted hover:text-terminal-red text-xl">
          x
        </button>
      </div>

      <!-- 内容区 -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <!-- 日常记录区 -->
        <div>
          <h4 class="text-terminal-green mb-2 text-sm">== 日常记录 ==</h4>
          <div v-if="dailyRecords.length === 0" class="text-terminal-muted text-sm">暂无记录</div>
          <div v-for="record in dailyRecords" :key="record.id"
            class="terminal-card p-3 mb-2">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <span v-if="record.category"
                  class="terminal-tag mr-2"
                  :style="{ borderColor: record.category.color, color: record.category.color }">
                  {{ record.category.name }}
                </span>
                <span class="text-terminal-text font-bold">{{ record.title }}</span>
              </div>
              <button @click="deleteDaily(record.id)"
                class="text-terminal-muted hover:text-terminal-red text-sm">删除</button>
            </div>
            <p v-if="record.content" class="text-terminal-muted text-sm mt-2 whitespace-pre-wrap">{{ record.content }}</p>
            <!-- 图片 -->
            <div v-if="record.images && record.images.length > 0" class="flex flex-wrap gap-2 mt-2">
              <img v-for="(img, i) in record.images" :key="i"
                :src="img.supabase_url"
                class="w-16 h-16 object-cover rounded border border-terminal-border cursor-pointer"
                @click="viewImage(img.supabase_url)" />
            </div>
          </div>
        </div>

        <!-- 灵感碎片区 -->
        <div>
          <h4 class="text-terminal-yellow mb-2 text-sm">== 灵感碎片 ==</h4>
          <div v-if="inspirationRecords.length === 0" class="text-terminal-muted text-sm">暂无灵感</div>
          <div v-for="record in inspirationRecords" :key="record.id"
            class="terminal-card p-3 mb-2">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <span v-if="record.category"
                  class="terminal-tag mr-2"
                  :style="{ borderColor: record.category.color, color: record.category.color }">
                  {{ record.category.name }}
                </span>
                <span class="text-terminal-text font-bold">{{ record.title }}</span>
              </div>
              <button @click="deleteInspiration(record.id)"
                class="text-terminal-muted hover:text-terminal-red text-sm">删除</button>
            </div>
            <p v-if="record.content" class="text-terminal-muted text-sm mt-2 whitespace-pre-wrap">{{ record.content }}</p>
            <div v-if="record.images && record.images.length > 0" class="flex flex-wrap gap-2 mt-2">
              <img v-for="(img, i) in record.images" :key="i"
                :src="img.supabase_url"
                class="w-16 h-16 object-cover rounded border border-terminal-border cursor-pointer"
                @click="viewImage(img.supabase_url)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 图片预览 -->
  <div v-if="previewImage" @click="previewImage = null"
    class="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4">
    <img :src="previewImage" class="max-w-full max-h-full object-contain" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useDailyRecordStore } from '../stores/dailyRecord.js'
import { useInspirationStore } from '../stores/inspiration.js'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  date: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close', 'refresh'])

const dailyRecordStore = useDailyRecordStore()
const inspirationStore = useInspirationStore()

const previewImage = ref(null)

const dailyRecords = computed(() => {
  if (!props.date) return []
  return dailyRecordStore.records.filter(r => r.record_date === props.date)
})

const inspirationRecords = computed(() => {
  if (!props.date) return []
  return inspirationStore.records.filter(r => r.record_date === props.date)
})

const formatDateDisplay = computed(() => {
  if (!props.date) return ''
  const [y, m, d] = props.date.split('-')
  return `${y}年${parseInt(m)}月${parseInt(d)}日`
})

function close() {
  emit('close')
}

function viewImage(url) {
  previewImage.value = url
}

async function deleteDaily(id) {
  if (!confirm('确定删除这条记录吗？')) return
  try {
    await dailyRecordStore.removeRecord(id)
    emit('refresh')
  } catch (err) {
    alert('删除失败: ' + (err.message || '未知错误'))
  }
}

async function deleteInspiration(id) {
  if (!confirm('确定删除这条灵感吗？')) return
  try {
    await inspirationStore.removeRecord(id)
    emit('refresh')
  } catch (err) {
    alert('删除失败: ' + (err.message || '未知错误'))
  }
}
</script>
```

- [ ] **Step 2: 提交**

```bash
git add .
git commit -m "feat: 日期详情弹窗组件"
```

---

## Task 12: 整体页面组装与联调

**Files:**
- Modify: `frontend/src/App.vue`

**Interfaces:**
- Consumes: Task 7-11 的所有组件和 stores
- Produces: 完整的日历看板页面

- [ ] **Step 1: 组装 App.vue**

`frontend/src/App.vue`:
```vue
<template>
  <div id="app" class="min-h-screen p-4">
    <div class="max-w-7xl mx-auto">
      <!-- 顶部栏 -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl text-terminal-green">
          <span class="text-terminal-muted">$</span> 日历看板
          <span class="text-terminal-muted text-sm animate-pulse">_</span>
        </h1>
        <div class="flex items-center gap-4">
          <button @click="calendarStore.goToToday()" class="terminal-btn-secondary text-sm">
            今日
          </button>
          <CategoryFilter
            v-model="filterCategoryId"
            :categories="categoryStore.categories"
          />
        </div>
      </div>

      <!-- 日历区 -->
      <CalendarGrid @dayClick="onDayClick" class="mb-6" />

      <!-- 输入区 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DailyInput @refresh="refreshData" />
        <InspirationInput @refresh="refreshData" />
      </div>
    </div>

    <!-- 日期详情弹窗 -->
    <DayDetailModal
      :visible="showDetail"
      :date="selectedDate"
      @close="showDetail = false"
      @refresh="refreshData"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useCalendarStore } from './stores/calendar.js'
import { useCategoryStore } from './stores/category.js'
import { useDailyRecordStore } from './stores/dailyRecord.js'
import { useInspirationStore } from './stores/inspiration.js'
import CalendarGrid from './components/CalendarGrid.vue'
import CategoryFilter from './components/CategoryFilter.vue'
import DailyInput from './components/DailyInput.vue'
import InspirationInput from './components/InspirationInput.vue'
import DayDetailModal from './components/DayDetailModal.vue'

const calendarStore = useCalendarStore()
const categoryStore = useCategoryStore()
const dailyRecordStore = useDailyRecordStore()
const inspirationStore = useInspirationStore()

const filterCategoryId = ref(null)
const showDetail = ref(false)
const selectedDate = ref('')

// 加载所有数据
async function refreshData() {
  const range = calendarStore.monthRange
  const params = {
    start_date: range.start_date,
    end_date: range.end_date,
  }
  if (filterCategoryId.value) {
    params.category_id = filterCategoryId.value
  }
  await Promise.all([
    dailyRecordStore.fetchRecords(params),
    inspirationStore.fetchRecords(params),
  ])
}

function onDayClick(dateStr) {
  selectedDate.value = dateStr
  showDetail.value = true
}

// 月份变化时重新加载数据
watch(
  () => [calendarStore.currentYear, calendarStore.currentMonth],
  () => refreshData()
)

// 筛选变化时重新加载
watch(filterCategoryId, () => refreshData())

onMounted(async () => {
  await categoryStore.fetchCategories()
  await refreshData()
})
</script>
```

- [ ] **Step 2: 启动前后端联调**

确保后端在运行（端口 3001），然后启动前端：
```powershell
cd c:\Users\306\Desktop\作品集\calendar-board\frontend
npm run dev
```

打开 http://localhost:5173 验证：
1. 页面显示暗色终端风格
2. 日历显示当月日期
3. 两个输入区域可见
4. 可以输入标题和内容
5. 点击日期能弹出详情

- [ ] **Step 3: 端到端功能验证**

手动测试以下流程：
1. 在日常记录区输入标题 + 内容，选择分类，点击保存
2. 在灵感碎片区输入标题 + 内容，选择分类，点击保存
3. 日历上当天的格子显示标签摘要
4. 点击当天日期，弹窗显示刚创建的记录
5. 在弹窗中可以删除记录
6. 切换月份，日历正确更新
7. 点击"今日"按钮回到当月
8. 使用分类筛选器筛选记录

- [ ] **Step 4: 提交**

```bash
git add .
git commit -m "feat: 整体页面组装与联调，v1 版本完成"
```

---

## Task 13: 创建 .gitignore 与项目说明

**Files:**
- Create: `calendar-board/.gitignore`

- [ ] **Step 1: 创建 .gitignore**

`calendar-board/.gitignore`:
```
# 依赖
node_modules/
frontend/node_modules/
backend/node_modules/

# 环境变量
.env
backend/.env

# 上传文件
uploads/

# 构建产物
dist/
frontend/dist/

# IDE
.vscode/
.idea/

# 系统
.DS_Store
Thumbs.db
```

- [ ] **Step 2: 最终提交**

```bash
cd c:\Users\306\Desktop\作品集\calendar-board
git add .
git commit -m "chore: 添加 .gitignore，项目初始化完成"
```
