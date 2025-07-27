import { Routes, Route } from 'react-router-dom';
import HealthCheckPage from './pages/HealthCheckPage';
import PostWritePage from './pages/PostWritePage';
import PostReadPage from './pages/PostReadPage';
import PostDetailPage from './pages/PostDetailPage';

function App() {
  return (
    <Routes>
      <Route path='/health' element={<HealthCheckPage />} />
      <Route path='/posts' element={<PostReadPage />} />
      <Route path='/posts/write' element={<PostWritePage />} />
      <Route path='/posts/:id' element={<PostDetailPage />} />
    </Routes>
  );
}

export default App;
