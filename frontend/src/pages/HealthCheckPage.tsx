import { useEffect, useState } from 'react';
import { fetchHealthStatus } from '../api/health';

const HealthCheckPage = () => {
  const [healthStatus, setHealthStatus] = useState('Checking...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStatus = async () => {
      try {
        const data = await fetchHealthStatus();
        if (data && typeof data === 'string') {
          setHealthStatus(data);
        } else {
          console.error('API 응답이 올바르지 않습니다.');
          setHealthStatus('응답 오류');
        }
      } catch (error) {
        console.error('API 요청 오류:', error);
        setHealthStatus('서버 연결 실패');
      } finally {
        setLoading(false);
      }
    };
    getStatus();
  }, []);

  return (
    <>
      <div>
        <h1>서버 헬스체크 상태</h1>
        {loading ? (
          <p>서버 상태를 확인 중입니다...</p>
        ) : (
          <p>서버 상태 : {healthStatus}</p>
        )}
      </div>
    </>
  );
};

export default HealthCheckPage;
