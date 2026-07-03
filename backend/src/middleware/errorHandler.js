export function notFound(req, res, next) {
  res.status(404).json({
    code: 404,
    message: `接口不存在: ${req.originalUrl}`,
    data: null,
  });
}

export function errorHandler(err, req, res, next) {
  console.error('[Error]', err.message);

  // multer 错误：文件大小超限 / 文件数量超限
  let status = err.status || 500;
  let message = err.message || '服务器内部错误';
  if (err.code === 'LIMIT_FILE_SIZE') {
    status = 400;
    message = '文件大小超过限制（5MB）';
  } else if (err.code === 'LIMIT_FILE_COUNT') {
    status = 400;
    message = '文件数量超过限制';
  } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    status = 400;
    message = '上传字段名不正确';
  }

  res.status(status).json({
    code: status,
    message,
    data: null,
  });
}
