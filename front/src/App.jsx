import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Flex, Spinner } from '@chakra-ui/react';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Toaster from './components/ui/Toaster';
import RemonterEnHaut from './components/RemonterEnHaut';
import PageIntrouvable from './pages/PageIntrouvable';

import Home from './pages/Home';
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Atlas = lazy(() => import('./pages/Atlas'));
const AtlasBoeuf = lazy(() => import('./pages/atlas/AtlasBoeuf'));
const AtlasBoeufAvant = lazy(() => import('./pages/atlas/AtlasBoeufAvant'));
const AtlasBoeufAvantEpaule = lazy(() => import('./pages/atlas/AtlasBoeufAvantEpaule'));
const AtlasBoeufAvantCollier = lazy(() => import('./pages/atlas/AtlasBoeufAvantCollier'));
const AtlasBoeufAvantCaparacon = lazy(() => import('./pages/atlas/AtlasBoeufAvantCaparacon'));
const AtlasBoeufArriere = lazy(() => import('./pages/atlas/AtlasBoeufArriere'));
const AtlasBoeufArriereCuisse = lazy(() => import('./pages/atlas/AtlasBoeufArriereCuisse'));
const AtlasBoeufArriereCuisseDetail = lazy(() => import('./pages/atlas/AtlasBoeufArriereCuisseDetail'));
const AtlasBoeufArriereBavettes = lazy(() => import('./pages/atlas/AtlasBoeufArriereBavettes'));
const AtlasBoeufArriereDehanche = lazy(() => import('./pages/atlas/AtlasBoeufArriereDehanche'));
const FichePiece = lazy(() => import('./pages/FichePiece'));
const AtelierVideo = lazy(() => import('./pages/AtelierVideo'));
const LaboCalcul = lazy(() => import('./pages/LaboCalcul'));
const Recettes = lazy(() => import('./pages/Recettes'));
const RecetteDetail = lazy(() => import('./pages/RecetteDetail'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Actualites = lazy(() => import('./pages/Actualites'));
const ActualiteDetail = lazy(() => import('./pages/ActualiteDetail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
import RequireAdmin from './components/admin/RequireAdmin';
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminAccueil = lazy(() => import('./pages/admin/AdminAccueil'));
const AdminActualites = lazy(() => import('./pages/admin/AdminActualites'));
const AdminActualiteForm = lazy(() => import('./pages/admin/AdminActualiteForm'));




function App() {
  return (
    <Flex direction="column" minH="100vh">
      <RemonterEnHaut />
      <NavBar />
    <Box as="main" flex="1">
      <Suspense
        fallback={
          <Flex minH="60vh" align="center" justify="center" role="status" aria-label="Chargement de la page">
            <Spinner size="lg" color="brand.rouge" />
          </Flex>
        }
      >
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
        <Route path="/atlas/boeuf/arriere/bavettes" element={<AtlasBoeufArriereBavettes />} />
        <Route path="/atlas/boeuf/arriere/dehanche" element={<AtlasBoeufArriereDehanche />} />
        <Route path="/pieces/:id" element={<FichePiece />} />
        <Route path="/videos" element={<AtelierVideo />} />
        <Route path="/outils" element={<LaboCalcul />} />
        <Route path="/recettes" element={<Recettes />} />
        <Route path="/recettes/:id" element={<RecetteDetail />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/actualites/" element={<Actualites />} />
        <Route path="/actualites/:id" element={<ActualiteDetail />} />
        <Route path="/profil" element={<Dashboard />} />
        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<AdminAccueil />} />
          <Route path="actualites" element={<AdminActualites />} />
          <Route path="actualites/nouvelle" element={<AdminActualiteForm />} />
          <Route path="actualites/:id" element={<AdminActualiteForm />} />
        </Route>
        <Route path="*" element={<PageIntrouvable />} />
      </Routes>
      </Suspense>
    </Box>
    <Footer />
    <Toaster />
    </Flex>
  );
}

export default App;