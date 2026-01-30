import { Box } from '@chakra-ui/react';
import NavBar from './components/NavBar'; // Import de ta Navbar
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Box minH="100vh" bg="brand.beige"> {/* Fond général "Papier Kraft" pour tout le site */}
      
      {/* --- C'EST ICI : La Navbar est posée une seule fois --- */}
      <NavBar /> 

      {/* Zone de contenu qui change (La Toile) */}
      <Box p={8}> 
        <Routes>
          {/* Pour l'instant on met des textes provisoires pour tester */}
          <Route path="/" element={<h1>Bienvenue sur l'Accueil</h1>} />
          <Route path="/atlas" element={<h1>Page Atlas (à venir)</h1>} />
          <Route path="/videos" element={<h1>Page Vidéothèque (à venir)</h1>} />
          <Route path="/outils" element={<h1>Page Outils (à venir)</h1>} />
        </Routes>
      </Box>

    </Box>
  );
}

export default App;
