import { Request, Response, NextFunction } from 'express';
import { saveImageFile } from '../services/file.service';

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file as Express.Multer.File;
    const userId = req.user!.userId;

    const image = await saveImageFile(file, userId);

    const imageResponse = {
      _id: image._id,
      url: image.url,
    };

    res.status(201).json(imageResponse);
  } catch (error) {
    next(error);
  }
};
