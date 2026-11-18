import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Flex, Spinner } from '@chakra-ui/react';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Toaster from './components/ui/Toaster';
import RemonterEnHaut from './components/RemonterEnHaut';
import { lazyAvecRechargement } from './utils/lazyAvecRechargement';
import PageIntrouvable from './pages/PageIntrouvable';

import Home from './pages/Home';
const ForgotPassword = lazyAvecRechargement(() => import('./pages/ForgotPassword'));
const ResetPassword = lazyAvecRechargement(() => import('./pages/ResetPassword'));
const Atlas = lazyAvecRechargement(() => import('./pages/Atlas'));
const AtlasBoeuf = lazyAvecRechargement(() => import('./pages/atlas/AtlasBoeuf'));
const AtlasBoeufAvant = lazyAvecRechargement(() => import('./pages/atlas/AtlasBoeufAvant'));
const AtlasBoeufAvantEpaule = lazyAvecRechargement(() => import('./pages/atlas/AtlasBoeufAvantEpaule'));
const AtlasBoeufAvantCollier = lazyAvecRechargement(() => import('./pages/atlas/AtlasBoeufAvantCollier'));
const AtlasBoeufAvantCaparacon = lazyAvecRechargement(() => import('./pages/atlas/AtlasBoeufAvantCaparacon'));
const AtlasBoeufArriere = lazyAvecRechargement(() => import('./pages/atlas/AtlasBoeufArriere'));
const AtlasBoeufArriereCuisse = lazyAvecRechargement(() => import('./pages/atlas/AtlasBoeufArriereCuisse'));
const AtlasBoeufArriereCuisseDetail = lazyAvecRechargement(() => import('./pages/atlas/AtlasBoeufArriereCuisseDetail'));
const AtlasBoeufArriereBavettes = lazyAvecRechargement(() => import('./pages/atlas/AtlasBoeufArriereBavettes'));
const AtlasBoeufArriereDehanche = lazyAvecRechargement(() => import('./pages/atlas/AtlasBoeufArriereDehanche'));
const FichePiece = lazyAvecRechargement(() => import('./pages/FichePiece'));
const AtelierVideo = lazyAvecRechargement(() => import('./pages/AtelierVideo'));
const LaboCalcul = lazyAvecRechargement(() => import('./pages/LaboCalcul'));
const Recettes = lazyAvecRechargement(() => import('./pages/Recettes'));
const RecetteDetail = lazyAvecRechargement(() => import('./pages/RecetteDetail'));
const Quiz = lazyAvecRechargement(() => import('./pages/Quiz'));
const Actualites = lazyAvecRechargement(() => import('./pages/Actualites'));
const ActualiteDetail = lazyAvecRechargement(() => import('./pages/ActualiteDetail'));
const Dashboard = lazyAvecRechargement(() => import('./pages/Dashboard'));
import RequireAdmin from './components/admin/RequireAdmin';
const AdminLayout = lazyAvecRechargement(() => import('./components/admin/AdminLayout'));
const AdminAccueil = lazyAvecRechargement(() => import('./pages/admin/AdminAccueil'));
const AdminActualites = lazyAvecRechargement(() => import('./pages/admin/AdminActualites'));
const AdminActualiteForm = lazyAvecRechargement(() => import('./pages/admin/AdminActualiteForm'));




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