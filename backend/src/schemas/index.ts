import mongoose from 'mongoose';

const connect = () => {
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }

  mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => {
      console.log('몽고디비 연결 성공');
    })
    .catch((error) => {
      console.error('몽고디비 연결 실패', error);
    });
};

mongoose.connection.on('error', (error) => {
  console.error('몽고디비 연결 에러', error);
});

mongoose.connection.on('disconnected', () => {
  console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
  connect();
});

export default connect;
