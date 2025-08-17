import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: '토큰이 제공되지 않았습니다.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(419).json({ message: '토큰이 만료되었습니다.' });
    }
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};
