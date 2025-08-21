import api from './axios.js';

export const fetchHealthStatus = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('API 요청 오류: ', error);
    throw new Error('서버에 접속할 수 없습니다.');
  }
};
