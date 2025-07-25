import axios from 'axios';
import { useEffect, useState } from 'react';

interface ApiResponse {
  code: number;
  message: string;
}

function App() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    const callApi = async () => {
      try {
        const response = await axios.get<ApiResponse>('/api');
        if (response.data && typeof response === 'object') {
          setMessage(response.data.message);
          console.log('응답 코드:', response.data.code);
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
        <h1>{message}</h1>
      </div>
    </>
  );
}

export default App;
