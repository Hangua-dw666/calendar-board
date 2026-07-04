import supabase from '../config/supabase.js';

// bucket 名走环境变量，默认 calendar-board
const BUCKET = process.env.SUPABASE_BUCKET_NAME || 'calendar-board';

/**
 * 批量删除 Supabase Storage 上的图片文件。
 * 如果 Supabase 未配置或删除失败，仅打印警告，不抛错（避免阻断主流程）。
 * @param {string[]} paths - Supabase 存储路径数组
 */
export async function removeSupabaseFiles(paths) {
  if (!supabase || !paths || paths.length === 0) return;
  try {
    const { error } = await supabase.storage.from(BUCKET).remove(paths);
    if (error) {
      console.warn('[Supabase] 删除文件失败（不影响主流程）:', error.message);
    }
  } catch (err) {
    console.warn('[Supabase] 删除文件异常（不影响主流程）:', err.message);
  }
}
