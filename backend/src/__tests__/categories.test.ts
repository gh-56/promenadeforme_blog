import { NextFunction, Request, Response } from 'express';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from '../controllers/categories';
import Category from '../schemas/category';

afterEach(() => jest.restoreAllMocks());
describe('createCategory', () => {
  test('카테고리명을 받지 못하면 400 상태코드를 반환한다', async () => {
    const req = {
      body: {
        name: false,
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    const mockSave = jest
      .spyOn(Category.prototype, 'save')
      .mockResolvedValue(true);

    await createCategory(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: '카테고리 이름을 입력하세요.',
      })
    );
    expect(mockSave).not.toHaveBeenCalled();
  });

  test('카테고리 생성에 성공하면 201 상태코드를 반환한다', async () => {
    const req = {
      body: {
        name: 'testCategory',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    const mockSave = jest
      .spyOn(Category.prototype, 'save')
      .mockResolvedValue(true);

    await createCategory(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: '새로운 카테고리가 생성되었습니다.',
        category: expect.any(Object),
      })
    );
    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  test('이미 존재하는 카테고리를 생성하면 400 상태코드를 반환한다', async () => {
    const req = {
      body: {
        name: 'testCategory',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    const mockError = { code: 11000 };
    const mockSave = jest
      .spyOn(Category.prototype, 'save')
      .mockRejectedValue(mockError);

    await createCategory(req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: '이미 존재하는 카테고리 이름입니다.',
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('카테고리를 생성하는 도중 알 수 없는 에러가 발생할 경우', async () => {
    const req = {
      body: {
        name: 'testCategory',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest
      .spyOn(Category.prototype, 'save')
      .mockRejectedValue(new Error('DB 연결 오류'));

    await createCategory(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe('getCategories', () => {
  test('모든 카테고리 불러오면 200 상태코드를 반환한다', async () => {
    const req = {} as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    const mockCategories = [
      { _id: 'mockId1', name: '프론트엔드' },
      { _id: 'mockId2', name: '백엔드' },
    ];

    jest.spyOn(Category, 'find').mockResolvedValue(mockCategories);

    await getCategories(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('카테고리를 불러오는 도중 에러가 발생할 경우', async () => {
    const req = {} as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    const mockCategories = [
      { _id: 'mockId1', name: '프론트엔드' },
      { _id: 'mockId2', name: '백엔드' },
    ];

    jest.spyOn(Category, 'find').mockRejectedValue(new Error('DB 연결 오류'));

    await getCategories(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('updateCategory', () => {
  test('카테고리명이 전달되지 않으면 400 상태코드를 반환한다', async () => {
    const req = {
      body: {
        name: false,
      },
      params: {
        id: '1',
      } as any,
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    await updateCategory(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: '수정할 카테고리 이름을 입력하세요.' })
    );
  });

  test('카테고리를 찾지 못하면 404 상태코드를 반환한다', async () => {
    const req = {
      body: {
        name: 'testCategory',
      },
      params: {
        id: '1',
      } as any,
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest.spyOn(Category, 'findByIdAndUpdate').mockResolvedValue(null);

    await updateCategory(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: '카테고리를 찾을 수 없습니다.' })
    );
  });

  test('카테고리를 성공적으로 수정하면 200 상태코드를 반환한다', async () => {
    const req = {
      body: {
        name: 'testCategory',
      },
      params: {
        id: '1',
      } as any,
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest.spyOn(Category, 'findByIdAndUpdate').mockResolvedValue({
      name: 'updateCategory',
    });

    await updateCategory(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: '카테고리가 성공적으로 수정되었습니다.',
      })
    );
  });

  test('이미 카테고리가 존재하는 경우', async () => {
    const req = {
      body: {
        name: 'testCategory',
      },
      params: {
        id: '1',
      } as any,
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    const mockError = { code: 11000 };
    jest.spyOn(Category, 'findByIdAndUpdate').mockRejectedValue(mockError);

    await updateCategory(req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: '이미 존재하는 카테고리 이름입니다.',
      })
    );
  });

  test('카테고리 수정 도중 에러가 발생한 경우', async () => {
    const req = {
      body: {
        name: 'testCategory',
      },
      params: {
        id: '1',
      } as any,
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest
      .spyOn(Category, 'findByIdAndUpdate')
      .mockRejectedValue(new Error('DB 연결 오류'));

    await updateCategory(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('deleteCategory', () => {
  test('요청한 카테고리를 찾을 수 없으면 404 상태코드를 반환한다', async () => {
    const req = {
      body: {
        name: 'testCategory',
      },
      params: {
        id: '1',
      } as any,
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest.spyOn(Category, 'findByIdAndDelete').mockResolvedValue(null);
    await deleteCategory(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: '카테고리를 찾을 수 없습니다.',
      })
    );
  });

  test('카테고리 삭제에 성공하면 200 상태코드를 반환한다', async () => {
    const req = {
      body: {
        name: 'testCategory',
      },
      params: {
        id: '1',
      } as any,
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest.spyOn(Category, 'findByIdAndDelete').mockResolvedValue({});
    await deleteCategory(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: '카테고리가 성공적으로 삭제되었습니다.',
      })
    );
  });

  test('카테고리 삭제 도중 에러가 발행한 경우', async () => {
    const req = {
      body: {
        name: 'testCategory',
      },
      params: {
        id: '1',
      } as any,
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest
      .spyOn(Category, 'findByIdAndDelete')
      .mockRejectedValue(new Error('DB 연결 오류'));
    await deleteCategory(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
