import sharp from 'sharp';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import Image from '../schemas/image';
import { Types } from 'mongoose';
import { Storage } from '@google-cloud/storage';

const storage = new Storage();

let bucketName = process.env.GCLOUD_STORAGE_BUCKET as string;

if (process.env.NODE_ENV !== 'production') {
  bucketName = 'uploads';
}

export interface File {
  buffer: Buffer;
  originalname: string;
}

export const saveImageFile = async (
  file: File,
  userId: string,
  isUpdated?: boolean,
) => {
  const fileHash = crypto
    .createHash('sha256')
    .update(file.buffer)
    .digest('hex');

  // const fileExt = path.extname(file.originalname);
  // const newFileName = `${fileHash}${fileExt}`;

  let existingImage = await Image.findOne({ hash: fileHash });

  if (existingImage) {
    if (!isUpdated) {
      existingImage.referenceCount += 1;
    }
    await existingImage.save();
  } else {
    const newFileName = `${fileHash}.webp`;

    const optimizedBuffer = await sharp(file.buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .toFormat('webp', { quality: 80 })
      .toBuffer();

    try {
      if (process.env.NODE_ENV === 'production') {
        // GCP 버킷에 파일 업로드
        const bucket = storage.bucket(bucketName);
        const fileRef = bucket.file(newFileName);

        await fileRef.save(optimizedBuffer);
        console.log(`파일 ${newFileName}이 GCS에 업로드되었습니다.`);
      } else {
        // 로컬에 파일 업로드
        const savePath = path.resolve(process.cwd(), 'uploads', newFileName);
        await fs.writeFile(savePath, optimizedBuffer);
      }
    } catch (error) {
      console.error('파일 저장에 실패했습니다.', error);
      throw new Error('파일 저장에 실패했습니다.');
    }

    const imageUrl = `${process.env.GCLOUD_STORAGE_IMAGE_URL}/${bucketName}/${newFileName}`;
    // const imageUrl = `http://localhost:4000/images/${newFileName}`;
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

export const saveProfileImageFile = async (file: File) => {
  const fileHash = crypto
    .createHash('sha256')
    .update(file.buffer)
    .digest('hex');

  // const fileExt = path.extname(file.originalname);
  // const newFileName = `${fileHash}${fileExt}`;

  let existingImage = await Image.findOne({ hash: fileHash });

  if (existingImage) {
    await existingImage.save();
  } else {
    const newFileName = `${fileHash}.webp`;

    const optimizedBuffer = await sharp(file.buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .toFormat('webp', { quality: 80 })
      .toBuffer();
    try {
      if (process.env.NODE_ENV === 'production') {
        // GCP 버킷에 파일 업로드
        const bucket = storage.bucket(bucketName);
        const fileRef = bucket.file(newFileName);

        await fileRef.save(optimizedBuffer);
        console.log(`파일 ${newFileName}이 GCS에 업로드되었습니다.`);
      } else {
        // 로컬에 파일 업로드
        const savePath = path.resolve(process.cwd(), 'uploads', newFileName);
        await fs.writeFile(savePath, optimizedBuffer);
      }
    } catch (error) {
      console.error('파일 저장에 실패했습니다.', error);
      throw new Error('파일 저장에 실패했습니다.');
    }

    // GCS 저장 경로
    const imageUrl = `${process.env.GCLOUD_STORAGE_IMAGE_URL}/${bucketName}/${newFileName}`;
    // 로컬 저장
    // const imageUrl = `http://localhost:4000/images/${newFileName}`;
    existingImage = new Image({
      hash: fileHash,
      url: imageUrl,
      referenceCount: 1,
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
        if (
          image.url ===
          `${process.env.GCLOUD_STORAGE_IMAGE_URL}/${bucketName}/default-post-image.webp`
          // image.url === 'http://localhost:4000/images/default-post-image.jpg'
        ) {
          image.referenceCount = 1;
        } else {
          image.referenceCount -= 1;
        }

        await image.save();

        if (image.referenceCount <= 0) {
          try {
            const fileName = path.basename(image.url as string);
            if (process.env.NODE_ENV === 'production') {
              await storage.bucket(bucketName).file(fileName).delete();
              console.log(`${imageId}번 이미지가 GCS에서 삭제되었습니다.`);
            } else {
              const filePath = path.resolve(process.cwd(), 'uploads', fileName);
              await fs.unlink(filePath);
              await Image.findOneAndDelete({ _id: imageId });
              console.log(`${imageId}번 이미지가 삭제되었습니다.`);
            }
          } catch (fileError) {
            console.error(
              `${imageId}번 이미지 삭제에 실패했습니다.`,
              fileError,
            );
          }
        }
      }
    } catch (dbError) {
      console.error(`${imageId}번 이미지 삭제에 실패했습니다.`, dbError);
    }
  }
};
