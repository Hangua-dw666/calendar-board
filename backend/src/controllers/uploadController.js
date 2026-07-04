import supabase from '../config/supabase.js';

// bucket 名走环境变量，默认 calendar-board
const BUCKET = process.env.SUPABASE_BUCKET_NAME || 'calendar-board';

export async function uploadImage(req, res, next) {
  try {
    if (!supabase) {
      return res.status(503).json({ code: 503, message: 'Supabase 未配置，图片上传不可用', data: null });
    }
    if (!req.file) {
      return res.status(400).json({ code: 400, message: '请选择要上传的图片', data: null });
    }
    const file = req.file;
    const ext = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `images/${fileName}`;
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: false });
    if (error) {
      console.error('[Supabase] 上传失败:', error.message);
      return res.status(500).json({ code: 500, message: '图片上传失败: ' + error.message, data: null });
    }
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath);
    res.json({ code: 0, message: 'success', data: { url: urlData.publicUrl, path: filePath } });
  } catch (err) {
    next(err);
  }
}
