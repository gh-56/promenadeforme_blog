import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [healthStatus, setHealthStatus] = useState('Checking...');
  useEffect(() => {
    const callApi = async () => {
      try {
        const response = await axios.get('/health');
        if (response.data && typeof response.data === 'string') {
          setHealthStatus(response.data);
        } else {
          console.error('API 응답이 올바르지 않습니다.');
        }
      } catch (error) {
        console.error('API 요청 오류:', error);
      }
    };
    callApi();
  }, []);

  return (
    <>
      <div>
        <h1>서버 헬스체크 상태</h1>
        <p>{healthStatus}</p>
      </div>
    </>
  );
}

export default App;
