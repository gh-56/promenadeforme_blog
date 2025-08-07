import app from './app.js';

app.listen(app.get('port'), () => {
  console.log(`서버가 ${app.get('port')}번 포트에서 실행 중입니다.`);
  console.log(`http://localhost:${app.get('port')}`);
});
