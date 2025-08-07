import { NextFunction, Request, Response } from 'express';
import { createUser, login } from '../controllers/users';
import bcrypt from 'bcrypt';
import User from '../schemas/user.js';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';

jest.mock('../schemas/user.js');

beforeEach(() => {
  jest.clearAllMocks();
});
describe('createUser', () => {
  describe('이름, 이메일, 비밀번호, 닉네임 중 하나라도 입력받지 않으면 400번 상태코드를 반환한다', () => {
    test('이름을 입력받지 못한 경우', async () => {
      const req = {
        body: {
          email: 'gh@gh.com',
          nickname: 'gh',
          password: 'Password123!',
        },
      } as Request;
      const res = {} as Response;
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      const next = jest.fn() as NextFunction;

      await createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: '필수 입력 항목이 누락되었습니다.' })
      );
    });
    test('이메일을 입력받지 못한 경우', async () => {
      const req = {
        body: {
          username: 'hello',
          nickname: 'gh',
          password: 'Password123!',
        },
      } as Request;
      const res = {} as Response;
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      const next = jest.fn() as NextFunction;

      await createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: '필수 입력 항목이 누락되었습니다.' })
      );
    });
    test('이메일과 이름을 입력받지 못한 경우', async () => {
      const req = {
        body: {
          nickname: 'gh',
          password: 'Password123!',
        },
      } as Request;
      const res = {} as Response;
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      const next = jest.fn() as NextFunction;

      await createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: '필수 입력 항목이 누락되었습니다.' })
      );
    });
  });

  test('회원가입 시 올바른 이메일 형식이 아니라면 400번 상태코드를 반환한다', async () => {
    const req = {
      body: {
        username: 'gh',
        email: '1234.com',
        nickname: 'gh',
        password: 'Password123!',
        bio: '테스트입니다',
      },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    await createUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: '올바른 이메일 형식이 아닙니다.',
      })
    );
  });

  describe('비밀번호가 8자 이상이 아니거나, 영문 대문자, 소문자, 숫자, 특수문자를 포함하지 않으면 400번 상태코드를 반환한다', () => {
    test('비밀번호가 8자 이하인 경우', async () => {
      const invalidPassword = '1234';
      const req = {
        body: {
          username: 'gh',
          email: 'gh@gh.com',
          nickname: 'gh',
          password: invalidPassword,
          bio: '테스트입니다',
        },
      } as Request;
      const res = {} as Response;
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      const next = jest.fn() as NextFunction;

      await createUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message:
            '비밀번호는 8자 이상이어야 하며, 영문 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.',
        })
      );
    });

    test('특수문자가 포함되어 있지 않는 경우', async () => {
      const invalidPassword = 'Password12';
      const req = {
        body: {
          username: 'gh',
          email: 'gh@gh.com',
          nickname: 'gh',
          password: invalidPassword,
          bio: '테스트입니다',
        },
      } as Request;
      const res = {} as Response;
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      const next = jest.fn() as NextFunction;

      await createUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message:
            '비밀번호는 8자 이상이어야 하며, 영문 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.',
        })
      );
    });
  });

  describe('이미 가입된 회원이라면 409 상태코드를 반환한다', () => {
    test('이미 가입된 이메일인 경우', async () => {
      const req = {
        body: {
          username: 'gh',
          email: 'gh@gh.com',
          nickname: 'gh',
          password: 'Password123!',
          bio: '테스트입니다',
        },
      } as Request;
      const res = {} as Response;
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      const next = jest.fn() as NextFunction;

      jest.spyOn(User, 'findOne').mockResolvedValue({
        username: 'gh123',
        email: 'gh@gh.com',
        nickname: 'gh123',
        password: 'Password123123!',
        bio: '테스트입니다123',
      });

      await createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: '이미 사용 중인 이메일입니다.' })
      );
    });

    test('이미 가입된 닉네임인 경우', async () => {
      const existingNickname = 'gh';
      const req = {
        body: {
          username: 'gh',
          email: 'gh@gh.com',
          nickname: existingNickname,
          password: 'Password123!',
          bio: '테스트입니다',
        },
      } as Request;
      const res = {} as Response;
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      const next = jest.fn() as NextFunction;

      jest.spyOn(User, 'findOne').mockResolvedValue({
        username: 'gh123',
        email: 'gh12@gh.com',
        nickname: existingNickname,
        password: 'Password123123!',
        bio: '테스트입니다123',
      });

      await createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: '이미 사용 중인 닉네임입니다.' })
      );
    });
  });

  test('회원가입에 성공하면 200 상태코드를 반환한다', async () => {
    const req = {
      body: {
        username: 'gh',
        email: 'gh@gh.com',
        nickname: 'gh',
        password: 'Password123!',
        bio: '테스트입니다',
      },
      file: {
        path: '/mock/path/temp.png',
        originalname: 'profile.png',
      } as Express.Multer.File,
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;
    jest.spyOn(User, 'findOne').mockResolvedValue({});
    jest.spyOn(fs, 'rename').mockResolvedValue();

    await createUser(req, res, next);

    expect(fs.rename).toHaveBeenCalledWith(
      req.file?.path,
      expect.stringContaining('images')
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: '회원가입이 완료되었습니다.',
      })
    );
  });

  test('회원가입 도중 에러가 발생할 경우', async () => {
    const req = {
      body: {
        username: 'gh',
        email: 'gh@gh.com',
        nickname: 'gh',
        password: 'Password123!',
        bio: '테스트입니다',
      },
      file: {
        path: '/mock/path/temp.png',
        originalname: 'profile.png',
      } as Express.Multer.File,
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest.spyOn(User, 'findOne').mockRejectedValue(new Error('DB 연결 오류'));

    await createUser(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe('login', () => {
  describe('유저 정보가 없거나 비밀번호가 다르다면 401 상태코드를 반환한다', () => {
    test('유저 정보가 없는 경우', async () => {
      const req = {
        body: { email: 'gh@gh.com', password: 'Password123!' },
      } as Request;
      const res = {} as Response;
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      const next = jest.fn() as NextFunction;

      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: '이메일 또는 비밀번호가 올바르지 않습니다.',
        })
      );
    });

    test('비밀번호가 다른 경우', async () => {
      const req = {
        body: { email: 'gh@gh.com', password: 'Password123!' },
      } as Request;
      const res = {} as Response;
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      const next = jest.fn() as NextFunction;

      jest.spyOn(User, 'findOne').mockResolvedValue({
        email: 'gh@gh.com',
        password: 'hashed_password',
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: '이메일 또는 비밀번호가 올바르지 않습니다.',
        })
      );
    });
  });
  test('로그인에 성공하면 200 상태코드를 반환한다', async () => {
    const req = {
      body: { email: 'gh@gh.com', password: 'Password123!' },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest.spyOn(User, 'findOne').mockResolvedValue({
      email: 'gh@gh.com',
      password: 'hashed_password',
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    jest.spyOn(jwt, 'sign').mockReturnValue();

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: '로그인이 완료되었습니다.',
        token: undefined,
        user: { email: 'gh@gh.com', nickname: undefined },
      })
    );
  });

  test('로그인 도중 에러가 발생한 경우', async () => {
    const req = {
      body: { email: 'gh@gh.com', password: 'Password123!' },
    } as Request;
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    const next = jest.fn() as NextFunction;

    jest.spyOn(User, 'findOne').mockRejectedValue(new Error('DB 연결 오류'));
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    jest.spyOn(jwt, 'sign').mockReturnValue();

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(res.status).not.toHaveBeenCalled();
  });
});
