import { Routes, Route } from 'react-router-dom';
import {
  MAIN_PATH,
  POST_WRITE_PATH,
  POST_DETAIL_PATH,
  CATEGORY_PATH,
  HEALTH_CHECK_PATH,
  LOGIN_PATH,
  JOIN_PATH,
  POST_EDIT_PATH,
  POST_MY_PATH,
  MYPAGE_PATH,
  CATEGORY_POSTS_PATH,
} from './constant';
import { useUserStore } from './store';
import React, { Suspense, useEffect } from 'react';

import MainLayout from './layouts/MainLayout';
import ProtectedRoutes from './routes/ProtectedRoutes';
import PostReadPage from './pages/Post/Read';

import { LoadingOverlay } from '@mantine/core';

const LoginPage = React.lazy(() => import('./pages/Auth/Login'));
const JoinPage = React.lazy(() => import('./pages/Auth/Join'));
const PostWritePage = React.lazy(() => import('./pages/Post/Write'));
const PostDetailPage = React.lazy(() => import('./pages/Post/Detail'));
const PostEditPage = React.lazy(() => import('./pages/Post/Edit'));
const CategoryPage = React.lazy(() => import('./pages/Category'));
const MyPostReadPage = React.lazy(() => import('./pages/Post/Me'));
const MyPage = React.lazy(() => import('./pages/Auth/MyPage'));
const CategoryPostListPage = React.lazy(
  () => import('./pages/Post/CategoryPostList'),
);
const HealthCheckPage = React.lazy(() => import('./pages/HealthCheck'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const ServerError = React.lazy(() => import('./pages/ServerError'));

const LoadingFallback = () => (
  <div>
    <LoadingOverlay
      visible={true}
      zIndex={1000}
      overlayProps={{ radius: 'sm', blur: 2 }}
      loaderProps={{ color: 'black' }}
    />
  </div>
);

function App() {
  // const { init, isInitialized } = useUserStore();
  const { init } = useUserStore();

  useEffect(() => {
    init();
  }, [init]);

  // if (!isInitialized) {
  //   return (
  //     <div>
  //       <LoadingOverlay
  //         visible={true}
  //         zIndex={1000}
  //         overlayProps={{ radius: 'sm', blur: 2 }}
  //         loaderProps={{ color: 'black' }}
  //       />
  //     </div>
  //   );
  // }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path={LOGIN_PATH()} element={<LoginPage />} />
        <Route path={JOIN_PATH()} element={<JoinPage />} />

        <Route path={HEALTH_CHECK_PATH()} element={<HealthCheckPage />} />
        <Route path='/error' element={<ServerError />} />

        <Route element={<ProtectedRoutes />}>
          <Route path={POST_WRITE_PATH()} element={<PostWritePage />} />
          <Route path={POST_EDIT_PATH(':id')} element={<PostEditPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path={MAIN_PATH()} element={<PostReadPage />} />
          <Route path={POST_DETAIL_PATH(':id')} element={<PostDetailPage />} />
          <Route
            path={CATEGORY_POSTS_PATH(':categoryName')}
            element={<CategoryPostListPage />}
          />

          <Route element={<ProtectedRoutes />}>
            <Route path={POST_MY_PATH()} element={<MyPostReadPage />} />
            <Route path={CATEGORY_PATH()} element={<CategoryPage />} />
            <Route path={MYPAGE_PATH()} element={<MyPage />} />
          </Route>

          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
