import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import CustomError from '../utils/customError';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new CustomError('토큰이 제공되지 않았습니다.', 401));
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (error: any) {
    return next(new CustomError('유효하지 않은 토큰입니다.', 401));
  }
};
