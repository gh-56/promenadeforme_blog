import app from './app.js';
import { config } from './config/index.js';
import connectDB from './config/db.js';

connectDB();

app.listen(config.port, () => {
  console.log(`🚀 서버가 ${config.port}번 포트에서 실행 중입니다.`);
  console.log(`🔗 http://localhost:${config.port}`);
});
