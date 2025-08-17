import { Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import HealthCheckPage from './pages/HealthCheck';
import PostWritePage from './pages/Post/Write';
import PostReadPage from './pages/Post/Read';
import PostDetailPage from './pages/Post/Detail';
import Container from './layouts/Container';
import CategoryPage from './pages/Category';
import JoinPage from './pages/Auth/Join';
import LoginPage from './pages/Auth/Login';
import {
  MAIN_PATH,
  POST_PATH,
  POST_WRITE_PATH,
  POST_DETAIL_PATH,
  CATEGORY_PATH,
  HEALTH_CHECK_PATH,
  LOGIN_PATH,
  JOIN_PATH,
} from './constant';
import ProtectedRoutes from './routes/ProtectedRoutes';
import { useUserStore } from './store';
import { useEffect, useState } from 'react';

function App() {
  const initStore = useUserStore((state) => state.init);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      await initStore();
      setIsLoading(false);
    };
    initializeApp();
  }, [initStore]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <Routes>
      <Route element={<Container />}>
        <Route path={MAIN_PATH()} element={<Main />} />
        <Route path={POST_DETAIL_PATH(':id')} element={<PostDetailPage />} />
        <Route path={POST_PATH()} element={<PostReadPage />} />
        <Route path={LOGIN_PATH()} element={<LoginPage />} />
        <Route path={JOIN_PATH()} element={<JoinPage />} />

        <Route element={<ProtectedRoutes />}>
          <Route path={POST_WRITE_PATH()} element={<PostWritePage />} />
          <Route path={CATEGORY_PATH()} element={<CategoryPage />} />
        </Route>

        <Route path='*' element={<h1>페이지가 존재하지 않습니다.</h1>} />
      </Route>
      <Route path={HEALTH_CHECK_PATH()} element={<HealthCheckPage />} />
    </Routes>
  );
}

export default App;
