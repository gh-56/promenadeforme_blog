import { Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import HealthCheckPage from './pages/HealthCheck';
import PostWritePage from './pages/Post/Write/index';
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
  POST_EDIT_PATH,
  POST_MY_PATH,
  MYPAGE_PATH,
} from './constant';
import ProtectedRoutes from './routes/ProtectedRoutes';
import { useUserStore } from './store';
import { useEffect } from 'react';
import PostEditPage from './pages/Post/Edit';
import MyPostReadPage from './pages/Post/Me';
import MyPage from './pages/Auth/MyPage';
import { AppShell, Button, Group, LoadingOverlay, Text } from '@mantine/core';
import Header from './layouts/Header';

function App() {
  const { init, isInitialized } = useUserStore();

  useEffect(() => {
    init();
  }, [init]);

  if (!isInitialized) {
    return (
      <div>
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'black' }}
        />
      </div>
    );
  }

  return (
    <>
      <AppShell header={{ height: 60 }} padding='md'>
        <AppShell.Header withBorder={false}>
          <Header />
        </AppShell.Header>

        <AppShell.Main>
          <Routes>
            <Route path={LOGIN_PATH()} element={<LoginPage />} />
            <Route path={JOIN_PATH()} element={<JoinPage />} />
            <Route
              path={MAIN_PATH()}
              element={
                <>
                  <Main />
                  <PostReadPage />
                </>
              }
            />
            <Route
              path={POST_DETAIL_PATH(':id')}
              element={<PostDetailPage />}
            />
            <Route path={POST_PATH()} element={<PostReadPage />} />

            <Route element={<ProtectedRoutes />}>
              <Route path={POST_WRITE_PATH()} element={<PostWritePage />} />
              <Route path={POST_MY_PATH()} element={<MyPostReadPage />} />
              <Route path={CATEGORY_PATH()} element={<CategoryPage />} />
              <Route path={POST_EDIT_PATH(':id')} element={<PostEditPage />} />
              <Route path={MYPAGE_PATH()} element={<MyPage />} />
            </Route>

            <Route path='*' element={<h1>페이지가 존재하지 않습니다.</h1>} />
            <Route path={HEALTH_CHECK_PATH()} element={<HealthCheckPage />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default App;
