import { Types } from 'mongoose';
import Image from '../../schemas/image.js';
import {
  deleteImageFile,
  type File,
  saveImageFile,
} from '../../services/file.service';
import fs from 'fs/promises';
import { prototype } from 'events';

afterEach(() => {
  jest.resetAllMocks();
});
describe('saveImageFile', () => {
  test('이미지가 저장소에 존재하지만 게시글 수정이 아닌 경우, 참조 카운트를 1 증가한다', async () => {
    const file: File = {
      buffer: Buffer.from('mock file data'),
      originalname: 'mock.png',
    };
    const userId: string = '1';

    const mockImageDocument = new Image({
      hash: 'testHash',
      url: 'testUrl',
      referenceCount: 1,
      author: '1',
    });

    const mockFind = jest
      .spyOn(Image, 'findOne')
      .mockResolvedValue(mockImageDocument);
    const mockSave = jest
      .spyOn(Image.prototype, 'save')
      .mockResolvedValue(mockImageDocument);

    await saveImageFile(file, userId);

    expect(mockImageDocument.referenceCount).toBe(2);
    expect(mockFind).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  test('이미지가 저장소에 존재하며 게시글을 수정한 경우 참조 카운트를 증가시키지 않는다', async () => {
    const file: File = {
      buffer: Buffer.from('mock file data'),
      originalname: 'mock.png',
    };
    const userId: string = '1';
    const isUpdated: boolean = true;

    const mockImageDocument = new Image({
      hash: 'testHash',
      url: 'testUrl',
      referenceCount: 1,
      author: '1',
    });

    const mockFind = jest
      .spyOn(Image, 'findOne')
      .mockResolvedValue(mockImageDocument);
    const mockSave = jest
      .spyOn(Image.prototype, 'save')
      .mockResolvedValue(mockImageDocument);
    const mockWriteFile = jest.spyOn(fs, 'writeFile').mockResolvedValue();

    await saveImageFile(file, userId, isUpdated);

    expect(mockImageDocument.referenceCount).toBe(1);
    expect(mockFind).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(mockWriteFile).toHaveBeenCalledTimes(0);
  });

  test('이미지가 저장소에 없는 경우,(findOne으로 찾지 못한 경우) 이미지를 저장한다', async () => {
    const file: File = {
      buffer: Buffer.from('mock file data'),
      originalname: 'mock.png',
    };
    const userId: string = '1';

    const mockImageDocument = new Image({
      hash: 'testHash',
      url: 'testUrl',
      referenceCount: 1,
      author: '1',
    });

    jest.spyOn(Image, 'findOne').mockResolvedValue(null);
    const mockWriteFile = jest.spyOn(fs, 'writeFile').mockResolvedValue();
    const mockSave = jest
      .spyOn(Image.prototype, 'save')
      .mockResolvedValue(mockImageDocument);

    await saveImageFile(file, userId);

    expect(mockWriteFile).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  test('파일 저장에 실패한 경우 에러를 반환한다', async () => {
    const file: File = {
      buffer: Buffer.from('mock file data'),
      originalname: 'mock.png',
    };
    const userId: string = '1';

    jest.spyOn(Image, 'findOne').mockResolvedValue(null);
    const mockWriteFile = jest
      .spyOn(fs, 'writeFile')
      .mockRejectedValue(new Error('파일 저장에 실패했습니다.'));

    await expect(saveImageFile(file, userId)).rejects.toThrow(
      '파일 저장에 실패했습니다.'
    );
  });
});

describe('deleteImageFile', () => {
  test('삭제할 이미지가 없는 경우, 다음 이미지로 넘어간다 ', async () => {
    const imageId = new Types.ObjectId('60a12345678901234567890a');
    const imageIds: Types.ObjectId[] = [imageId];
    const mockFindById = jest.spyOn(Image, 'findById').mockResolvedValue(null);
    const mockSave = jest
      .spyOn(Image.prototype, 'save')
      .mockResolvedValue(imageId);

    await deleteImageFile(imageIds);

    expect(mockFindById).toHaveBeenCalledTimes(1);
    expect(mockSave).not.toHaveBeenCalledTimes(1);
  });

  test('삭제할 이미지의 참조 카운트가 0보다 크다면, 참조 카운트를 감소만 한다', async () => {
    const imageId = new Types.ObjectId('60a12345678901234567890a');
    const imageIds: Types.ObjectId[] = [imageId];

    const mockImageDocument = new Image({
      hash: 'testHash',
      url: 'testUrl',
      referenceCount: 2,
      author: 'tester',
    });

    jest.spyOn(Image, 'findById').mockResolvedValue(mockImageDocument);
    const mockSave = jest
      .spyOn(Image.prototype, 'save')
      .mockResolvedValue(mockImageDocument);

    await deleteImageFile(imageIds);

    expect(mockImageDocument.referenceCount).toBe(1);
    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  test('삭제할 이미지의 참조 카운트가 0 이하라면 이미지를 삭제한다', async () => {
    const imageId = new Types.ObjectId('60a12345678901234567890a');
    const imageIds: Types.ObjectId[] = [imageId];

    const mockImageDocument = new Image({
      hash: 'testHash',
      url: 'testUrl',
      referenceCount: 1,
      author: 'tester',
    });

    jest.spyOn(Image, 'findById').mockResolvedValue(mockImageDocument);
    const mockSave = jest
      .spyOn(Image.prototype, 'save')
      .mockResolvedValue(mockImageDocument);

    jest.spyOn(fs, 'unlink').mockResolvedValue();
    const mockFindOneAndDelete = jest
      .spyOn(Image, 'findOneAndDelete')
      .mockResolvedValue(mockImageDocument);

    await deleteImageFile(imageIds);

    expect(mockImageDocument.referenceCount).toBe(0);
    expect(mockFindOneAndDelete).toHaveBeenCalledTimes(1);
  });

  test('이미지를 찾거나 저장 중 DB에서 에러가 발생한 경우', async () => {
    const imageId = new Types.ObjectId('60a12345678901234567890a');
    const imageIds: Types.ObjectId[] = [imageId];

    const mockImageDocument = new Image({
      hash: 'testHash',
      url: 'testUrl',
      referenceCount: 1,
      author: 'tester',
    });

    // 찾는 중 에러 발생
    jest.spyOn(Image, 'findById').mockRejectedValue(new Error('db 에러'));
    // 저장 중 에러 발생
    // jest.spyOn(Image.prototype, 'save').mockRejectedValue(new Error('db 에러'));

    jest.spyOn(fs, 'unlink').mockResolvedValue();
    const mockFindOneAndDelete = jest
      .spyOn(Image, 'findOneAndDelete')
      .mockResolvedValue(mockImageDocument);

    await deleteImageFile(imageIds);

    expect(mockFindOneAndDelete).not.toHaveBeenCalledTimes(1);
  });

  test('이미지를 삭제하는 중 에러가 발생한 경우', async () => {
    const imageId = new Types.ObjectId('60a12345678901234567890a');
    const imageIds: Types.ObjectId[] = [imageId];

    const mockImageDocument = new Image({
      hash: 'testHash',
      url: 'testUrl',
      referenceCount: 1,
      author: 'tester',
    });

    jest.spyOn(Image, 'findById').mockResolvedValue(mockImageDocument);
    jest.spyOn(Image.prototype, 'save').mockResolvedValue(mockImageDocument);

    // 파일 삭제 중 에러 발생
    jest.spyOn(fs, 'unlink').mockRejectedValue(new Error('에러 발생'));
    // db에서 삭제 중 에러
    // jest
    //   .spyOn(Image, 'findOneAndDelete')
    //   .mockRejectedValue(new Error('에러 발생'));

    const mockConsoleError = jest.spyOn(console, 'error').mockReturnValue();

    await deleteImageFile(imageIds);

    expect(mockConsoleError).toHaveBeenCalledTimes(1);
  });
});
