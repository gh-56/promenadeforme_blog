import { Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import HealthCheckPage from './pages/HealthCheck';
import PostWritePage from './pages/Post/Write';
import PostReadPage from './pages/Post/Read';
import PostDetailPage from './pages/Post/Detail';
import Container from './layouts/Container';
import {
  MAIN_PATH,
  POST_PATH,
  POST_WRITE_PATH,
  POST_DETAIL_PATH,
  CATEGORY_PATH,
  HEALTH_CHECK_PATH,
} from './constant';
import CategoryPage from './pages/Category';

function App() {
  return (
    <Routes>
      <Route element={<Container />}>
        <Route path={MAIN_PATH()} element={<Main />} />
        <Route path={POST_WRITE_PATH()} element={<PostWritePage />} />
        <Route path={POST_DETAIL_PATH(':id')} element={<PostDetailPage />} />
        <Route path={POST_PATH()} element={<PostReadPage />} />
        <Route path={CATEGORY_PATH()} element={<CategoryPage />} />
        <Route path='*' element={<h1>페이지가 존재하지 않습니다.</h1>} />
      </Route>
      <Route path={HEALTH_CHECK_PATH()} element={<HealthCheckPage />} />
    </Routes>
  );
}

export default App;
