import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import NavBar from './components/NavBar';
import Home from './pages/Home'; // Import de ta nouvelle page

function App() {
  return (
    <>
    <Box position="relative" minH="100vh" pt="20px">
      <NavBar /> {/* La Navbar est toujours visible */}
      
      <Routes>
        <Route path="/" element={<Home />} /> {/* La page d'accueil */}
        {/* Les autres routes (Atlas, Vidéos...) viendront ici */}
      </Routes>
    </Box>
    </>
  );
}

export default App;
