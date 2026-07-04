import { Category } from '../models/index.js';

export async function getCategories(req, res, next) {
  try {
    const { type } = req.query;
    const where = {};
    if (type) where.type = type;
    const categories = await Category.findAll({ where, order: [['id', 'ASC']] });
    res.json({ code: 0, message: 'success', data: categories });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, type, color } = req.body;
    if (!name || !type) {
      return res.status(400).json({ code: 400, message: '分类名称和类型不能为空', data: null });
    }
    const category = await Category.create({
      name, type, color: color || '#00ff88', is_default: false,
    });
    res.status(201).json({ code: 0, message: 'success', data: category });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, color } = req.body;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ code: 404, message: '分类不存在', data: null });
    }
    if (name !== undefined) category.name = name;
    if (color !== undefined) category.color = color;
    await category.save();
    res.json({ code: 0, message: 'success', data: category });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ code: 404, message: '分类不存在', data: null });
    }
    await category.destroy();
    res.json({ code: 0, message: 'success', data: null });
  } catch (err) {
    next(err);
  }
}
