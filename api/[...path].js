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
