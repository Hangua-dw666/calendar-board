# 日历看板应用设计文档

**日期**: 2026-07-02
**版本**: v1.0
**状态**: 设计阶段

---

## 1. 项目概述

### 1.1 项目名称
个人日历看板应用

### 1.2 项目定位
一个以日历为核心的个人看板应用，支持日常记录和灵感碎片的管理，以暗色终端风格呈现。

### 1.3 核心功能
- 月视图日历看板，点击日期查看详情
- 双输入区：日常记录 + 灵感碎片
- 文字输入 + 图片上传
- 日历日期上显示内容标签摘要
- 分类系统（预设 + 自定义）

### 1.4 目标用户
个人用户，用于记录日常和收集灵感

---

## 2. 技术架构

### 2.1 整体架构
经典前后端分离架构

### 2.2 技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| 前端框架 | Vue 3 + Vite | 组合式 API |
| 样式方案 | Tailwind CSS | 原子化 CSS |
| 状态管理 | Pinia | Vue 官方推荐 |
| 后端框架 | Node.js + Express | RESTful API |
| 数据库 | MySQL | 关系型数据库 |
| ORM | Sequelize | Node.js ORM |
| 图片存储 | Supabase Storage | 云端对象存储 |
| 跨域处理 | CORS 中间件 | 开发环境配置 |

### 2.3 项目结构

```
calendar-board/
├── frontend/                  # Vue 3 前端项目
│   ├── src/
│   │   ├── components/        # 可复用组件
│   │   ├── views/             # 页面视图
│   │   ├── api/               # API 请求封装
│   │   ├── stores/            # Pinia 状态管理
│   │   ├── assets/            # 静态资源
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── backend/                   # Express 后端项目
│   ├── src/
│   │   ├── routes/            # API 路由
│   │   ├── controllers/       # 控制器
│   │   ├── models/            # Sequelize 模型
│   │   ├── config/            # 配置文件
│   │   └── app.js             # 入口文件
│   └── package.json
└── docs/                      # 文档
    └── superpowers/
        └── specs/
            └── 2026-07-02-calendar-board-design.md
```

### 2.4 数据流

```
用户操作 → Vue 组件 → API 调用 → Express 后端 → MySQL 数据库
     ↓                                            ↓
  界面更新  ←  状态管理  ←  返回数据  ←  业务逻辑  ←
```

---

## 3. 前端设计

### 3.1 页面布局

单页面应用，整体分为三个区域：

1. **顶部栏**：标题、今日跳转、分类筛选
2. **日历区**：月视图日历网格，显示每日标签摘要
3. **输入区**：左右双栏布局 - 日常记录 + 灵感碎片

### 3.2 组件设计

| 组件名 | 说明 | 关键属性 |
|--------|------|----------|
| `CalendarGrid` | 月历网格组件 | year, month, records |
| `DayDetailModal` | 单日详情弹窗 | date, records |
| `DailyInput` | 日常记录输入区 | - |
| `InspirationInput` | 灵感碎片输入区 | - |
| `CategoryFilter` | 分类筛选器 | categories, activeCategory |
| `ImageUploader` | 图片上传组件 | multiple, maxSize |
| `CategorySelect` | 分类下拉选择 | type, v-model |

### 3.3 视觉风格

- **风格定位**：暗色终端风格（参考不二的个人看板）
- **主背景色**：#0a0a0f（深黑蓝）
- **卡片背景**：#111118 / #161b22
- **边框色**：#21262d
- **主色调（点缀）**：#00ff88（霓虹绿）/ #58a6ff（青蓝）
- **文字主色**：#e6edf3
- **文字次色**：#8b949e
- **字体**：等宽字体（JetBrains Mono / Fira Code / Consolas / monospace）
- **圆角**：4px-8px，微圆角
- **阴影**：低调的 box-shadow，微妙的发光效果

### 3.4 状态管理

使用 Pinia 管理以下状态：

- **calendarStore**：当前年月、选中日期、日历数据
- **recordStore**：日常记录列表、当前筛选条件
- **inspirationStore**：灵感碎片列表、当前筛选条件
- **categoryStore**：分类列表

---

## 4. 后端设计

### 4.1 API 设计规范

- 基础路径：`/api`
- 数据格式：JSON
- 响应格式：

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 4.2 分类管理 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/categories` | 获取所有分类（支持按 type 筛选） |
| POST | `/api/categories` | 新增分类 |
| PUT | `/api/categories/:id` | 修改分类 |
| DELETE | `/api/categories/:id` | 删除分类（仅非预设分类） |

### 4.3 日常记录 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/daily-records` | 获取日常记录列表（支持按日期范围/分类筛选） |
| GET | `/api/daily-records/:id` | 获取单条日常记录详情 |
| POST | `/api/daily-records` | 新增日常记录 |
| PUT | `/api/daily-records/:id` | 修改日常记录 |
| DELETE | `/api/daily-records/:id` | 删除日常记录 |

### 4.4 灵感碎片 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/inspirations` | 获取灵感碎片列表（支持按日期范围/分类筛选） |
| GET | `/api/inspirations/:id` | 获取单条灵感碎片详情 |
| POST | `/api/inspirations` | 新增灵感碎片 |
| PUT | `/api/inspirations/:id` | 修改灵感碎片 |
| DELETE | `/api/inspirations/:id` | 删除灵感碎片 |

### 4.5 图片上传 API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/upload/image` | 上传图片到 Supabase Storage，返回 URL |

---

## 5. 数据库设计

### 5.1 categories - 分类表

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 分类 ID |
| name | VARCHAR(50) | NOT NULL | 分类名称 |
| type | ENUM('daily', 'inspiration') | NOT NULL | 分类类型 |
| color | VARCHAR(20) | DEFAULT '#00ff88' | 标签颜色 |
| is_default | BOOLEAN | DEFAULT FALSE | 是否预设分类 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**预设分类数据**：
- 日常：工作、生活、学习、健康
- 灵感：创意、灵感、待办、收藏

### 5.2 daily_records - 日常记录表

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 记录 ID |
| title | VARCHAR(200) | NOT NULL | 标题 |
| content | TEXT | - | 内容 |
| record_date | DATE | NOT NULL, INDEX | 记录日期 |
| category_id | INT | FOREIGN KEY REFERENCES categories(id) | 分类 ID |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

### 5.3 inspirations - 灵感碎片表

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 灵感 ID |
| title | VARCHAR(200) | NOT NULL | 标题 |
| content | TEXT | - | 内容 |
| record_date | DATE | NOT NULL, INDEX | 记录日期 |
| category_id | INT | FOREIGN KEY REFERENCES categories(id) | 分类 ID |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

### 5.4 images - 图片表

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 图片 ID |
| supabase_url | VARCHAR(500) | NOT NULL | Supabase 访问 URL |
| supabase_path | VARCHAR(200) | NOT NULL | Supabase 存储路径 |
| record_type | ENUM('daily', 'inspiration') | NOT NULL, INDEX | 关联记录类型 |
| record_id | INT | NOT NULL, INDEX | 关联记录 ID |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

---

## 6. 关键功能说明

### 6.1 日历月视图
- 显示当月所有日期，按周一到周日排列
- 每个日期格子显示当天的记录数量和分类标签摘要
- 点击日期弹出详情面板，查看当天所有日常记录和灵感碎片
- 支持切换上一月/下一月

### 6.2 日常记录
- 标题、内容两个输入字段
- 分类选择下拉框
- 图片上传（支持多图）
- 保存后自动更新日历视图

### 6.3 灵感碎片
- 标题、内容两个输入字段
- 分类选择下拉框
- 图片上传（支持多图）
- 保存后自动更新日历视图

### 6.4 分类管理
- 预设分类不可删除，可修改颜色
- 自定义分类可增删改
- 分类有颜色标识，在日历上以颜色标签展示

### 6.5 图片上传
- 前端选择图片后预览
- 上传到 Supabase Storage
- 返回图片 URL 与记录关联
- 支持单条记录多张图片

---

## 7. 错误处理

### 7.1 前端
- API 请求失败时显示友好提示
- 表单验证（必填项、长度限制）
- 图片大小/格式校验

### 7.2 后端
- 统一错误响应格式
- 参数校验
- 数据库操作异常捕获
- Supabase 上传异常处理

---

## 8. 部署说明（后续规划）

### 本地开发
- 前端：`npm run dev`（Vite dev server）
- 后端：`npm run dev`（nodemon）
- 数据库：本地 MySQL

### 生产部署（后续）
- 前端可打包为静态文件，部署到任何静态托管
- 后端可部署到 VPS / Serverless 平台
- 数据库可迁移到云数据库或 Supabase
- 图片已存在 Supabase Storage，无需迁移
