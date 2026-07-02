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
