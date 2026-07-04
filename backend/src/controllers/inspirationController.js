import { Inspiration, Image, Category } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import { removeSupabaseFiles } from '../utils/storage.js';

async function validateCategoryId(category_id, type) {
  if (!category_id) return null;
  const cat = await Category.findByPk(category_id);
  if (!cat) {
    const err = new Error(`分类不存在: ${category_id}`);
    err.status = 400;
    throw err;
  }
  if (cat.type !== type) {
    const err = new Error(`分类类型不匹配，需要 ${type} 类型`);
    err.status = 400;
    throw err;
  }
  return category_id;
}

export async function getInspirations(req, res, next) {
  try {
    const { start_date, end_date, category_id } = req.query;
    const where = {};
    if (start_date || end_date) {
      where.record_date = {};
      if (start_date) where.record_date[Op.gte] = start_date;
      if (end_date) where.record_date[Op.lte] = end_date;
    }
    if (category_id) where.category_id = category_id;
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

export async function getInspiration(req, res, next) {
  try {
    const { id } = req.params;
    const record = await Inspiration.findByPk(id, {
      include: [{ model: Category, as: 'category' }, { model: Image, as: 'images' }],
    });
    if (!record) {
      return res.status(404).json({ code: 404, message: '灵感不存在', data: null });
    }
    res.json({ code: 0, message: 'success', data: record });
  } catch (err) {
    next(err);
  }
}

export async function createInspiration(req, res, next) {
  try {
    const { title, content, record_date, category_id, images } = req.body;
    if (!title || !record_date) {
      return res.status(400).json({ code: 400, message: '标题和日期不能为空', data: null });
    }
    if (title.length > 200) {
      return res.status(400).json({ code: 400, message: '标题不能超过 200 字', data: null });
    }
    const validCategoryId = await validateCategoryId(category_id, 'inspiration');
    const record = await Inspiration.create({
      title, content: content || '', record_date, category_id: validCategoryId,
    });
    if (images && Array.isArray(images) && images.length > 0) {
      await Image.bulkCreate(
        images.map((img) => ({
          supabase_url: img.url, supabase_path: img.path,
          record_type: 'inspiration', record_id: record.id,
        }))
      );
    }
    const result = await Inspiration.findByPk(record.id, {
      include: [{ model: Category, as: 'category' }, { model: Image, as: 'images' }],
    });
    res.status(201).json({ code: 0, message: 'success', data: result });
  } catch (err) {
    next(err);
  }
}

export async function updateInspiration(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content, record_date, category_id, images } = req.body;
    const record = await Inspiration.findByPk(id);
    if (!record) {
      return res.status(404).json({ code: 404, message: '灵感不存在', data: null });
    }
    if (title !== undefined && title.length > 200) {
      return res.status(400).json({ code: 400, message: '标题不能超过 200 字', data: null });
    }
    let validCategoryId = record.category_id;
    if (category_id !== undefined) {
      validCategoryId = await validateCategoryId(category_id, 'inspiration');
    }

    await sequelize.transaction(async (t) => {
      if (title !== undefined) record.title = title;
      if (content !== undefined) record.content = content;
      if (record_date !== undefined) record.record_date = record_date;
      if (category_id !== undefined) record.category_id = validCategoryId;
      await record.save({ transaction: t });

      if (images && Array.isArray(images)) {
        const oldImages = await Image.findAll({
          where: { record_type: 'inspiration', record_id: id },
          attributes: ['supabase_path'],
          transaction: t,
        });
        await Image.destroy({
          where: { record_type: 'inspiration', record_id: id },
          transaction: t,
        });
        if (images.length > 0) {
          await Image.bulkCreate(
            images.map((img) => ({
              supabase_url: img.url, supabase_path: img.path,
              record_type: 'inspiration', record_id: id,
            })),
            { transaction: t }
          );
        }
        const oldPaths = oldImages.map(i => i.supabase_path).filter(Boolean);
        if (oldPaths.length > 0) {
          removeSupabaseFiles(oldPaths);
        }
      }
    });

    const result = await Inspiration.findByPk(id, {
      include: [{ model: Category, as: 'category' }, { model: Image, as: 'images' }],
    });
    res.json({ code: 0, message: 'success', data: result });
  } catch (err) {
    next(err);
  }
}

export async function deleteInspiration(req, res, next) {
  try {
    const { id } = req.params;
    const record = await Inspiration.findByPk(id);
    if (!record) {
      return res.status(404).json({ code: 404, message: '灵感不存在', data: null });
    }

    await sequelize.transaction(async (t) => {
      const oldImages = await Image.findAll({
        where: { record_type: 'inspiration', record_id: id },
        attributes: ['supabase_path'],
        transaction: t,
      });
      await Image.destroy({
        where: { record_type: 'inspiration', record_id: id },
        transaction: t,
      });
      await record.destroy({ transaction: t });

      const oldPaths = oldImages.map(i => i.supabase_path).filter(Boolean);
      if (oldPaths.length > 0) {
        removeSupabaseFiles(oldPaths); // 异步清理，不阻塞响应
      }
    });

    res.json({ code: 0, message: 'success', data: null });
  } catch (err) {
    next(err);
  }
}
