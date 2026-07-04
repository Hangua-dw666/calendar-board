// 临时诊断版本：不依赖 backend，只回显请求信息
export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  const pathParts = req.query.path;
  let rest = '';
  if (Array.isArray(pathParts)) {
    rest = pathParts.join('/');
  } else if (typeof pathParts === 'string') {
    rest = pathParts;
  }
  res.status(200).json({
    ok: true,
    echo: rest,
    url: req.url,
    method: req.method,
    hasApp: false,
    note: 'diagnostic mode - backend not loaded',
  });
}
