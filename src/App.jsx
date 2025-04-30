import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import Home from '@/pages/Home';
import PlayPage from '@/pages/PlayPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="play" element={<PlayPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
