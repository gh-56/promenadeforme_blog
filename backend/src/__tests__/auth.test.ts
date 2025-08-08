import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middlewares/auth';

describe('authMiddleware', () => {
  test('토큰이 없다면 401 상태코드를 반환한다', () => {
    const req = {
      headers: {
        authorization: '',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    const mockFn = jest.spyOn(jwt, 'verify').mockReturnValue({} as any);

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockFn).not.toHaveBeenCalledTimes(1);
  });

  test('토큰이 존재한다면 요청 user 객체에 저장하고 next를 반환한다', () => {
    const req = {
      headers: {
        authorization: 'bearer token1234',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest.spyOn(jwt, 'verify').mockReturnValue({} as any);

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('토큰이 만료된 경우', () => {
    const req = {
      headers: {
        authorization: 'bearer token1234',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      const error = new Error('토큰 에러');
      error.name = 'TokenExpiredError';
      throw error;
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(419);
  });

  test('유효하지 않은 토큰인 경우', () => {
    const req = {
      headers: {
        authorization: 'bearer token1234',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      const error = new Error('토큰 에러');
      throw error;
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
