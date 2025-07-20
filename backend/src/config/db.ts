import mongoose from 'mongoose';
import { config } from './index';

const connectDB = async () => {
  try {
    if (!config.mongoUri) {
      throw new Error('MONGO_URI 환경 변수가 정의되어 있지 않습니다.');
    }

    await mongoose.connect(config.mongoUri);
    console.log('✅ MongoDB 연결 성공!');
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error);
    process.exit(1); // 1은 비정상 종료를 의미합니다.
  }
};

export default connectDB;
