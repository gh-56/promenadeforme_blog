import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import connect from './schemas/index.js';
import 'dotenv/config';
import CustomError from './utils/customError.js';

const app = express();

app.set('port', process.env.PORT || 4000);
connect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use((req, res, next) => {
  const error = new CustomError(
    `${req.method} ${req.url} 라우터가 없습니다.`,
    404
  );
  next(error);
});

app.use((err: any, req: any, res: any, next: any) => {
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

app.listen(app.get('port'), () => {
  console.log(`서버가 ${app.get('port')}번 포트에서 실행 중입니다.`);
  console.log(`http://localhost:${app.get('port')}`);
});

export default app;
