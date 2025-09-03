import { Request, Response, NextFunction } from 'express';
import User from '../schemas/user.js';
import Image from '../schemas/image.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import CustomError from '../utils/customError.js';
import mongoose, { ObjectId } from 'mongoose';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password, nickname, profileImage, bio } = req.body;
    // const profileImageFile = req.file;

    if (!username || !email || !password || !nickname) {
      return next(new CustomError('필수 입력 항목이 누락되었습니다.', 400));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new CustomError('올바른 이메일 형식이 아닙니다.', 400));
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return next(
        new CustomError(
          '비밀번호는 8자 이상이어야 하며, 영문 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.',
          400,
        ),
      );
    }

    const existingUser = await User.findOne({ $or: [{ email }, { nickname }] });
    if (existingUser && existingUser.email === email) {
      return next(new CustomError('이미 사용 중인 이메일입니다.', 409));
    }
    if (existingUser && existingUser.nickname === nickname) {
      return next(new CustomError('이미 사용 중인 닉네임입니다.', 409));
    }

    let imageId: mongoose.Types.ObjectId;
    if (profileImage) {
      imageId = profileImage;
    } else {
      let defaultImage = await Image.findOne({
        url: `${process.env.GCLOUD_STORAGE_IMAGE_URL}/${process.env.GCLOUD_STORAGE_BUCKET}/default-profile.png`,
      });
      if (defaultImage) {
        imageId = defaultImage._id;
      } else {
        defaultImage = new Image({
          url: `${process.env.GCLOUD_STORAGE_IMAGE_URL}/${process.env.GCLOUD_STORAGE_BUCKET}/default-profile.png`,
          // url: 'http://localhost:4000/images/default-profile.png',
        });
        await defaultImage.save();
        imageId = defaultImage._id;
      }
    }
    // if (profileImageFile) {
    //   const rootPath = path.resolve(process.cwd());
    //   const tempPath = profileImageFile.path;
    //   const newFileName = `${Date.now()}-${profileImageFile.originalname}`;
    //   const finalPath = path.join(rootPath, 'public/images/', newFileName);
    //
    //   await fs.rename(tempPath, finalPath);
    //
    //   profileImageUrl = `http://localhost:4000/images/${newFileName}`;
    // } else {
    //   profileImageUrl = 'http://localhost:4000/images/default-profile.png';
    // }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      nickname,
      password: hashPassword,
      profileImage: imageId,
      bio,
    });

    await newUser.save();

    // 패스워드 없이 반환
    const userResponse = {
      username: newUser.username,
      email: newUser.email,
      nickname: newUser.nickname,
      profileImage: newUser.profileImage,
      bio: newUser.bio,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    res.status(201).json(userResponse);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(
        new CustomError('이메일 또는 비밀번호가 올바르지 않습니다.', 401),
      );
    }

    const loginResponse = {
      _id: user._id,
      nickname: user.nickname,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
    };

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' },
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: '7d' },
    );

    const cookieMaxAge = 7 * 24 * 60 * 60 * 1000;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge,
    });

    res.status(200).json({ user: loginResponse, accessToken });
  } catch (error) {
    next(error);
  }
};

// 토큰 재발급
export const refresh = (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(new CustomError('토큰이 존재하지 않습니다.', 401));
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    );
    const newAccessToken = jwt.sign(
      { userId: (decoded as jwt.JwtPayload).userId },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' },
    );
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    next(new CustomError('유효하지 않은 refresh token 입니다.', 401));
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.status(204).end();
};

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const user = await User.findById(userId).populate('profileImage', 'url');

    if (!user) {
      return next(new CustomError('사용자를 찾을 수 없습니다.', 404));
    }

    const userProfileResponse = {
      _id: user._id,
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
    };

    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' },
    );

    res
      .status(200)
      .json({ user: userProfileResponse, accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      username,
      email,
      nickname,
      password,
      newPassword,
      bio,
      profileImage,
    } = req.body;
    const userId = req.user!.userId;

    const registerdUser = await User.findById(userId);

    if (!registerdUser) {
      return next(new CustomError('사용자를 찾을 수 없습니다.', 404));
    }

    if (!password) {
      return next(new CustomError('비밀번호를 입력하여야 합니다.', 400));
    }

    const isMatch = await bcrypt.compare(password, registerdUser.password);
    if (!isMatch) {
      return next(new CustomError('비밀번호가 일치하지 않습니다.', 400));
    }

    if (newPassword) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return next(
          new CustomError(
            '비밀번호는 8자 이상이어야 하며, 영문 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.',
            400,
          ),
        );
      }

      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      registerdUser.password = newHashedPassword;
    }

    if (username) registerdUser.username = username;
    if (email) registerdUser.email = email;
    if (nickname) registerdUser.nickname = nickname;
    if (bio) registerdUser.bio = bio;
    if (profileImage) registerdUser.profileImage = profileImage;

    await registerdUser.save();

    const updatedUser = {
      username,
      email,
      nickname,
      bio,
      profileImage,
    };

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
