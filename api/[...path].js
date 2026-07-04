import app from '../backend/src/app.js';

// 让 multer 处理 multipart/form-data，禁用 Vercel 内置 bodyParser
export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  // Vercel rewrites 已保留原始 req.url（如 /api/health），直接交给 Express
  return app(req, res);
}
