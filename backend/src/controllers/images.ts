import { Request, Response, NextFunction } from 'express';
import { saveImageFile } from '../services/file.service';
import { Types } from 'mongoose';

interface UploadedImageResponse {
  _id: Types.ObjectId;
  url: string;
}

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const images = req.files as Express.Multer.File[];
    const userId = req.user!.userId;
    const imageResponse: UploadedImageResponse[] = [];

    for (const image of images) {
      const savedImage = await saveImageFile(image, userId);
      imageResponse.push({ _id: savedImage._id, url: savedImage.url });
    }

    res.status(201).json(imageResponse);
  } catch (error) {
    next(error);
  }
};
