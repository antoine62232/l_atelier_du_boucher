import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';

import NavBar from './components/NavBar';
import Footer from './components/Footer';

import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Atlas from './pages/Atlas';

function App() {
  return (
    <Flex direction="column" minH="100vh">
      <NavBar />
    <Box flex="1">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        <Route path="/atlas" element={<Atlas />} />
      </Routes>
    </Box>
    <Footer />
    </Flex>
  );
}

export default App;