import { Routes, Route } from 'react-router-dom';
import HealthCheckPage from './pages/HealthCheckPage';
import PostWritePage from './pages/PostWritePage';

function App() {
  return (
    <Routes>
      <Route path='/health' element={<HealthCheckPage />} />
      <Route path='/write' element={<PostWritePage />} />
    </Routes>
  );
}

export default App;
