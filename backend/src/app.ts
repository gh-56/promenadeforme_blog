import express from 'express';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connect from './schemas/index.js';
import 'dotenv/config';
import CustomError from './utils/customError.js';
import indexRouter from './routes/index.js';
import postsRouter from './routes/posts.js';
import categoriesRouter from './routes/categories.js';
import usersRouter from './routes/users.js';

const __dirname = path.resolve(process.cwd());

const app = express();

app.set('port', process.env.PORT || 4000);
connect();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api', indexRouter);
app.use('/api/posts', postsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/users', usersRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(
    `${req.method} ${req.url} 라우터가 없습니다.`,
    404
  );
  next(error);
});

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const status = err.status || 500;
  const message =
    process.env.NODE_ENV !== 'production'
      ? err.message
      : '서버 내부 오류가 발생했습니다.';

  res.status(status).json({
    status,
    message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });
});

export default app;
