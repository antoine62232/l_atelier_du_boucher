import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';

import NavBar from './components/NavBar';
import Footer from './components/Footer';

import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Atlas from './pages/Atlas';
import AtlasBoeuf from './pages/atlas/AtlasBoeuf';
import AtlasBoeufAvant from './pages/atlas/AtlasBoeufAvant';
import AtlasBoeufAvantEpaule from './pages/atlas/AtlasBoeufAvantEpaule';
import AtlasBoeufAvantCollier from './pages/atlas/AtlasBoeufAvantCollier';
import AtlasBoeufAvantCaparacon from './pages/atlas/AtlasBoeufAvantCaparacon';
import AtlasBoeufArriere from './pages/atlas/AtlasBoeufArriere';
import AtlasBoeufArriereCuisse from './pages/atlas/AtlasBoeufArriereCuisse';
import AtlasBoeufArriereCuisseDetail from './pages/atlas/AtlasBoeufArriereCuisseDetail';
import AtelierVideo from './pages/AtelierVideo';
import LaboCalcul from './pages/LaboCalcul';
import Recettes from './pages/Recettes';
import RecetteDetail from './pages/RecetteDetail';
import Quiz from './pages/Quiz';
import Actualites from './pages/Actualites';
import ActualiteDetail from './pages/ActualiteDetail';


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
        <Route path="/atlas/boeuf" element={<AtlasBoeuf />} />
        <Route path="/atlas/boeuf/avant" element={<AtlasBoeufAvant />} />
        <Route path="/atlas/boeuf/avant/epaule" element={<AtlasBoeufAvantEpaule />} />
        <Route path="/atlas/boeuf/avant/collier" element={<AtlasBoeufAvantCollier />} />
        <Route path="/atlas/boeuf/avant/caparacon" element={<AtlasBoeufAvantCaparacon />} />
        <Route path="/atlas/boeuf/arriere" element={<AtlasBoeufArriere />} />
        <Route path="/atlas/boeuf/arriere/cuisse" element={<AtlasBoeufArriereCuisse />} />
        <Route path="/atlas/boeuf/arriere/cuisse/:id" element={<AtlasBoeufArriereCuisseDetail />} />
        <Route path="/videos" element={<AtelierVideo />} />
        <Route path="/outils" element={<LaboCalcul />} />
        <Route path="/recettes" element={<Recettes />} />
        <Route path="/recettes/:id" element={<RecetteDetail />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/actualites/" element={<Actualites />} />
        <Route path="/actualites/:id" element={<ActualiteDetail />} />


      </Routes>
    </Box>
    <Footer />
    </Flex>
  );
}

export default App;