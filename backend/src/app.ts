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
import imagesRouter from './routes/images.js';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';

const rootPath = path.resolve(process.cwd());
const swaggerDocument = yaml.load('src/utils/swagger.yaml');

const app = express();

app.set('port', process.env.PORT || 4000);
connect();

app.use(
  cors({
    origin: ['https://promenadeforme-blog.vercel.app', 'http://localhost:5173'],
    credentials: true,
  }),
);
app.use(express.static(path.join(rootPath, 'public')));
app.use('/images', express.static(path.join(rootPath, 'uploads')));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api', indexRouter);
app.use('/api/posts', postsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/users', usersRouter);
app.use('/api/images', imagesRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(
    `${req.method} ${req.url} 라우터가 없습니다.`,
    404,
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
    code: status,
    message: message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });
});

export default app;
