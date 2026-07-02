import { Inspiration, Image, Category } from '../models/index.js';
import { Op } from 'sequelize';

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
    const record = await Inspiration.create({
      title, content: content || '', record_date, category_id: category_id || null,
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
    if (title !== undefined) record.title = title;
    if (content !== undefined) record.content = content;
    if (record_date !== undefined) record.record_date = record_date;
    if (category_id !== undefined) record.category_id = category_id;
    await record.save();
    if (images && Array.isArray(images)) {
      await Image.destroy({ where: { record_type: 'inspiration', record_id: id } });
      if (images.length > 0) {
        await Image.bulkCreate(
          images.map((img) => ({
            supabase_url: img.url, supabase_path: img.path,
            record_type: 'inspiration', record_id: id,
          }))
        );
      }
    }
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
    await Image.destroy({ where: { record_type: 'inspiration', record_id: id } });
    await record.destroy();
    res.json({ code: 0, message: 'success', data: null });
  } catch (err) {
    next(err);
  }
}
