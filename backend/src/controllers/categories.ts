import { Request, Response, NextFunction } from 'express';
import Category from '../schemas/category.js';

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: '카테고리 이름을 입력하세요.' });
    }
    const newCategory = new Category({ name });
    await newCategory.save();

    res.status(201).json({
      message: '새로운 카테고리가 생성되었습니다.',
      category: newCategory,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: '이미 존재하는 카테고리 이름입니다.' });
    }
    next(error);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: '수정할 카테고리 이름을 입력하세요.' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: '카테고리를 찾을 수 없습니다.' });
    }
    res.status(200).json({
      message: '카테고리가 성공적으로 수정되었습니다.',
      category: updatedCategory,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: '이미 존재하는 카테고리 이름입니다.' });
    }
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: '카테고리를 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '카테고리가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    next(error);
  }
};
