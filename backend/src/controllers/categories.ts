import { Request, Response, NextFunction } from 'express';
import Category from '../schemas/category.js';
import CustomError from '../utils/customError.js';

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const userId = req.user!.userId;

    if (!name) {
      return next(new CustomError('카테고리 이름을 입력하세요.', 400));
    }
    const newCategory = new Category({ name: name, author: userId });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error: any) {
    if (error.code === 11000) {
      return next(new CustomError('이미 존재하는 카테고리 이름입니다.', 409));
    }
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const categories = await Category.find({ author: userId });
    if (!categories) {
      return next(new CustomError('카테고리를 찾을 수 없습니다.', 404));
    }
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user!.userId;

    if (!name) {
      return next(new CustomError('수정할 카테고리 이름을 입력하세요.', 400));
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      { _id: id, author: userId },
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      const categoryExists = await Category.findById(id);
      if (!categoryExists) {
        return next(new CustomError('카테고리를 찾을 수 없습니다.', 404));
      } else {
        return next(new CustomError('수정 권한이 없습니다.', 403));
      }
    }
    res.status(200).json(updatedCategory);
  } catch (error: any) {
    if (error.code === 11000) {
      return next(new CustomError('이미 존재하는 카테고리 이름입니다.', 409));
    }
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const deletedCategory = await Category.findByIdAndDelete({
      _id: id,
      author: userId,
    });
    if (!deletedCategory) {
      const categoryExists = await Category.findById(id);
      if (!categoryExists) {
        return next(new CustomError('카테고리를 찾을 수 없습니다.', 404));
      } else {
        return next(new CustomError('삭제 권한이 없습니다.', 403));
      }
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
