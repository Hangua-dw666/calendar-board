// 诊断版本 2：动态 import backend，捕获加载错误
export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  try {
    const { default: app } = await import('../backend/src/app.js');
    const pathParts = req.query.path;
    let rest = '';
    if (Array.isArray(pathParts)) {
      rest = pathParts.join('/');
    } else if (typeof pathParts === 'string') {
      rest = pathParts;
    }
    req.url = '/api/' + rest;
    return app(req, res);
  } catch (err) {
    res.status(500).json({
      error: err.message,
      name: err.name,
      stack: err.stack ? err.stack.split('\n').slice(0, 10) : null,
      cwd: process.cwd(),
      nodeVersion: process.version,
      envKeys: Object.keys(process.env).filter(k => k.startsWith('DB_') || k.startsWith('SUPABASE_')),
    });
  }
}
