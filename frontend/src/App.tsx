import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import ViewSingleTransaction from './pages/ViewSingleTransaction.tsx';
import { Box } from '@mui/material';
import { Navigate } from 'react-router';

function App() {
  return (
    <Box>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/transactions/:id" element={<ViewSingleTransaction />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
}

export default App;