import { Request, Response, NextFunction } from 'express';
import User from '../schemas/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import process from 'process';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password, nickname, bio } = req.body;
    const profileImageFile = req.file;

    if (!username || !email || !password || !nickname) {
      return res
        .status(400)
        .json({ message: '필수 입력 항목이 누락되었습니다.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: '올바른 이메일 형식이 아닙니다.' });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          '비밀번호는 8자 이상이어야 하며, 영문 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.',
      });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { nickname }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res
          .status(409)
          .json({ message: '이미 사용 중인 이메일입니다.' });
      }
      if (existingUser.nickname === nickname) {
        return res
          .status(409)
          .json({ message: '이미 사용 중인 닉네임입니다.' });
      }
    }

    let profileImageUrl = 'http://localhost:4000/images/default-profile.png';
    if (profileImageFile) {
      const __dirname = path.resolve(process.cwd());
      const tempPath = profileImageFile.path;
      const newFileName = `${Date.now()}-${profileImageFile.originalname}`;
      const finalPath = path.join(__dirname, 'public/images/', newFileName);

      await fs.rename(tempPath, finalPath);

      profileImageUrl = `http://localhost:4000/images/${newFileName}`;
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      nickname,
      password: hashPassword,
      profileImage: profileImageUrl,
      bio,
    });

    await newUser.save();

    const userResponse = {
      username: newUser.username,
      email: newUser.email,
      nickname: newUser.nickname,
      profileImage: newUser.profileImage,
      bio: newUser.bio,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    res
      .status(201)
      .json({ message: '회원가입이 완료되었습니다.', user: userResponse });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const userResponse = {
      email: user.email,
      nickname: user.nickname,
    };

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h',
      }
    );

    res
      .status(200)
      .json({ message: '로그인이 완료되었습니다.', user: userResponse, token });
  } catch (error) {
    next(error);
  }
};
