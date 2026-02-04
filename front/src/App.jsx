import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <Box>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Box>
  );
}

export default App;