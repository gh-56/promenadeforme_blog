import { Routes, Route } from 'react-router-dom';
import HealthCheckPage from './pages/HealthCheckPage';

function App() {
  return (
    <Routes>
      <Route path='/health' element={<HealthCheckPage />} />
    </Routes>
  );
}

export default App;
