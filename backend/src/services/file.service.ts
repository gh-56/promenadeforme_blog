import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import Image from '../schemas/image';
import { Types } from 'mongoose';

export interface File {
  buffer: Buffer;
  originalname: string;
}

export const saveImageFile = async (file: File, userId: string, isUpdated?: boolean) => {
  const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
  const fileExt = path.extname(file.originalname);
  const newFileName = `${fileHash}${fileExt}`;
  const savePath = path.resolve(process.cwd(), 'uploads', newFileName);

  let existingImage = await Image.findOne({ hash: fileHash });

  if (existingImage) {
    if (!isUpdated) {
      existingImage.referenceCount += 1;
    }
    await existingImage.save();
  } else {
    try {
      await fs.writeFile(savePath, file.buffer);
    } catch (error) {
      console.error('파일 저장에 실패했습니다.', error);
      throw new Error('파일 저장에 실패했습니다.');
    }
    const imageUrl = `http://localhost:4000/images/${newFileName}`;
    existingImage = new Image({
      hash: fileHash,
      url: imageUrl,
      referenceCount: 1,
      author: userId,
    });
    await existingImage.save();
  }

  return existingImage;
};

export const deleteImageFile = async (imageIds: Types.ObjectId[]) => {
  for (const imageId of imageIds) {
    try {
      const image = await Image.findById(imageId);
      if (!image) {
        console.warn(`${imageId}번 이미지가 없습니다.`);
        continue;
      } else {
        if (image.url === 'http://localhost:4000/images/default-post-image.jpg') {
          image.referenceCount = 1;
        } else {
          image.referenceCount -= 1;
        }

        await image.save();

        if (image.referenceCount <= 0) {
          const fileName = path.basename(image.url as string);
          const filePath = path.resolve(process.cwd(), 'uploads', fileName);
          try {
            await fs.unlink(filePath);
            await Image.findOneAndDelete({ _id: imageId });
            console.log(`${imageId}번 이미지가 삭제되었습니다.`);
          } catch (fileError) {
            console.error(`${imageId}번 이미지 삭제에 실패했습니다.`, fileError);
          }
        }
      }
    } catch (dbError) {
      console.error(`${imageId}번 이미지 삭제에 실패했습니다.`, dbError);
    }
  }
};
