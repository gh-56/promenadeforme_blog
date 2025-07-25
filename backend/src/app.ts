import express from 'express';
import cors from 'cors';

const app = express();

app.set('port', process.env.PORT || 4000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/api', (req, res) => {
  res.json({ code: 200, message: 'Promenadeforme 블로그 백엔드 API' });
});

app.listen(app.get('port'), () => {
  console.log(`서버가 ${app.get('port')}번 포트에서 실행 중입니다.`);
  console.log(`http://localhost:${app.get('port')}`);
});

export default app;
