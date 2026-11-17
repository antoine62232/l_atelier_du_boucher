import React, { useEffect, useState } from "react";
import { Link as RouterLink, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Stack,
  Link,
  Image,
  HStack,
  IconButton,
  Menu,
  Portal
} from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";
import logoImg from "../assets/logoNavBar.webp";
import { estAdmin } from "../utils/auth";
import SignUpModal from "./auth/SignUpModal";
import LoginModal from "./auth/LoginModal";

// --- COMPOSANT PRINCIPAL ---
const NavBar = (props) => {
  const location = useLocation();
  const [cheminMenuOuvert, setCheminMenuOuvert] = useState(null);
  const isOpen = cheminMenuOuvert === location.pathname;
  const toggle = () => setCheminMenuOuvert(isOpen ? null : location.pathname);
  const fermer = () => setCheminMenuOuvert(null);

  // Échap ferme le menu mobile.
  useEffect(() => {
    if (!isOpen) return undefined;
    const surTouche = (e) => {
      if (e.key === "Escape") setCheminMenuOuvert(null);
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [isOpen]);

  // --- GESTION DES MODALES ---
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Fonction pour ouvrir Inscription (et fermer Login si ouvert)
  const openSignUp = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(true);
  };

  // Fonction pour ouvrir Connexion (et fermer Inscription si ouvert)
  const openLogin = () => {
    setIsSignUpOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <>
    {/* Toucher en dehors du menu ouvert le referme. */}
    {isOpen && (
      <Box
        position="fixed"
        inset="0"
        zIndex="999"
        bg="rgba(44, 62, 80, 0.25)"
        display={{ base: "block", lg: "none" }}
        onClick={fermer}
        aria-hidden="true"
      />
    )}
    <NavBarContainer isOpen={isOpen} {...props}>

      {/* 1. ZONE GAUCHE (Logo) */}
      <Flex flex={{ base: 1, lg: 1 }} justify="flex-start" align="center">
        <Logo />
      </Flex>

      {/* 2. ZONE CENTRALE (Liens Desktop) */}
      <Flex flex={{ base: 0, lg: 1 }} justify="center" display={{ base: "none", lg: "flex" }}>
        <DesktopLinks />
      </Flex>

      {/* 3. ZONE DROITE */}
      <Flex flex={{ base: 1, lg: 1 }} justify="flex-end" align="center">
        {/* Sur PC */}
        <Box display={{ base: "none", lg: "block" }}>
          {/* ✅ 3. ON PASSE LES DEUX FONCTIONS */}
          <RightActions openSignUpClick={openSignUp} openLoginClick={openLogin} />
        </Box>

        {/* Sur Mobile */}
        <MenuToggle toggle={toggle} isOpen={isOpen} />
      </Flex>

      {/* 4. MENU DÉROULANT MOBILE */}
      <MobileMenu
        isOpen={isOpen}
        fermer={fermer}
        openSignUpClick={() => { fermer(); openSignUp(); }}
        openLoginClick={() => { fermer(); openLogin(); }}
      />

      {/* 5. MODALES DANS LE PORTAL */}
      <Portal>
        <SignUpModal 
            isOpen={isSignUpOpen} 
            onClose={() => setIsSignUpOpen(false)} 
            onSwitchToLogin={openLogin} // ✅ Pour switcher vers Login
        />
        <LoginModal 
            isOpen={isLoginOpen} 
            onClose={() => setIsLoginOpen(false)} 
            onSwitchToSignUp={openSignUp} // ✅ Pour switcher vers Inscription
        />
      </Portal>

    </NavBarContainer>
    </>
  );
};

const LIENS = [
  { to: "/atlas", label: "Atlas" },
  { to: "/videos", label: "Vidéothèque" },
  { to: "/outils", label: "Outils" },
  { to: "/recettes", label: "Recettes" },
  { to: "/quiz", label: "Quiz" },
  { to: "/actualites", label: "Actualités" },
];

const DesktopLinks = () => {
    return (
      <HStack gap="32px">
        {LIENS.map((lien) => (
          <MenuItemLink key={lien.to} to={lien.to} py="10px">
            {lien.label}
          </MenuItemLink>
        ))}
      </HStack>
    )
  }
  
  const Logo = () => {
    return (
      <HStack gap="12px">
  
        <Link
          as={RouterLink}
          to="/"
  
          aria-label="L'Atelier du Boucher, retour à l'accueil"
          display="flex"
          alignItems="center"
          minH="44px"
          rounded="md"
          textDecoration="none"
          _hover={{ textDecoration: "none" }}
        >
          <Image
            src={logoImg}
            alt=""
            h="45px"
            fit="contain"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
          />
        </Link>
  
        <Text
          fontFamily="title"
          fontWeight="bold"
          fontSize="20px"
          color="brand.rouge"
          display={{ base: 'none', xl: 'block' }}
        >
          L'ATELIER DU BOUCHER
        </Text>
  
      </HStack>
    );
  };

const RightActions = ({ openSignUpClick, openLoginClick }) => {
  // On récupère les infos de l'utilisateur
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  
  // ✅ Outil de navigation React Router
  const navigate = useNavigate();

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    // On recharge la page pour que le menu se mette à jour
    window.location.reload();
  };

  return (
    <Flex align="center" gap={4}>
      {/* MENU PROFIL */}
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton
            variant="ghost"
            rounded="full"
            aria-label={user ? `Mon compte (${user.prenom})` : "Connexion ou inscription"}
            color="brand.gris"
            _hover={{ bg: 'brand.rouge', color: 'white' }}
            css={{ _open: { bg: 'brand.rouge', color: 'white' } }}
            display="flex"
            alignItems="center"
            gap={2}
            w="auto"
            minW="44px"
            h="44px"
            px={2}
          >
            {/* AFFICHER LE PRÉNOM SI CONNECTÉ */}
            {user ? (
              <>
              <FiUser size={24} />
              <Text fontSize="sm" fontWeight="bold" display={{ base: "none", lg: "block" }}>
                {user.prenom}
                </Text>
              </>
            
            ) : (
            <FiUser size={24} />
            )}
          </IconButton>
        </Menu.Trigger>

        <Menu.Positioner>
          <Menu.Content bg="brand.creme" borderColor="brand.acier" boxShadow="lg">

            {user ? (
              <>
              {/* ✅ REDIRECTION VERS LE DASHBOARD ICI */}
              <Menu.Item 
                value="profil" 
                cursor="pointer" 
                _hover={{ bg: "gray.100" }}
                onClick={() => navigate('/profil')}
              >
                Mon Profil
              </Menu.Item>

              {estAdmin(user) && (
                <Menu.Item
                  value="admin"
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  onClick={() => navigate('/admin')}
                >
                  Administration
                </Menu.Item>
              )}
             
            <Menu.Item 
                value="logout" 
                color="red.500"
                onClick={handleLogout}
                cursor="pointer"
                _hover={{ bg: "red.50" }}
            >
              Déconnexion
            </Menu.Item>
            </>
            ) : (
            <>
                    {/* Menu pour VISITEUR */}
                    <Menu.Item 
                        value="connexion" 
                        onClick={openLoginClick}
                        cursor="pointer"
                        _hover={{ bg: "gray.100" }}
                    >
                        Connexion
                    </Menu.Item>
        
                    <Menu.Item
                        value="inscription"
                        onClick={openSignUpClick}
                        cursor="pointer"
                        _hover={{ bg: "gray.100" }}
                    >
                        Inscription
                    </Menu.Item>
                </>
            )}

          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </Flex>
  )
}

const MenuItemLink = ({ children, to = "/", ...rest }) => {
    return (
      <Link
        as={NavLink}
        to={to}
  
        // --- STYLE DE BASE ---
        display="block"
        fontSize="15px"
        fontWeight="medium"
        color="brand.gris"
        textDecoration="none"
  
        _hover={{
          color: 'brand.rouge',
          textDecoration: 'none'
        }}
  
        rounded="md"
        // --- QUAND ACTIF (Page courante) ---
        css={{
          "&.active": {
            color: "brand.rouge",
          }
        }}
  
        {...rest}
      >
        {children}
      </Link>
    );
  };

// --- MOBILE ---
const MenuToggle = ({ toggle, isOpen }) => {
    return (
      <IconButton
        display={{ base: "inline-flex", lg: "none" }}
        onClick={toggle}
        variant="ghost"
        rounded="full"
        w="44px"
        h="44px"
        ml={2}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
        aria-controls="menu-mobile"
        _hover={{ bg: "brand.beige" }}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
    );
  };

// Affichage simple plutôt que Collapsible : l'animation de fermeture de Chakra
// restait bloquée et le menu ne se refermait plus.
const MobileMenu = ({ isOpen, fermer, openSignUpClick, openLoginClick }) => {
  return (
    <Box
      id="menu-mobile"
      w="100%"
      flexBasis="100%"
      display={{ base: isOpen ? "block" : "none", lg: "none" }}
      css={{
        animation: "ouvertureMenu 0.18s ease-out",
        "@keyframes ouvertureMenu": {
          from: { opacity: 0, transform: "translateY(-6px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      }}
    >
      <Box pb={3}>
        <Stack gap={0} mt={2} borderTop="1px solid" borderColor="brand.acier" pt={2}>
          {LIENS.map((lien) => (
            <MenuItemLink
              key={lien.to}
              to={lien.to}
              onClick={fermer}
              fontSize="17px"
              py="12px"
              px={3}
              _hover={{ bg: "brand.beige", color: "brand.rouge" }}
            >
              {lien.label}
            </MenuItemLink>
          ))}
          <Flex justify="flex-end" borderTop="1px solid" borderColor="brand.acier" mt={2} pt={3}>
            <RightActions openSignUpClick={openSignUpClick} openLoginClick={openLoginClick} />
          </Flex>
        </Stack>
      </Box>
    </Box>
  );
};

// ... (SVG Icons et NavBarContainer identiques) ...
const CloseIcon = () => (
    <svg width="22" aria-hidden="true" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path fill="#8A1C25" d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z" />
    </svg>
  );
  const MenuIcon = () => (
    <svg width="22px" aria-hidden="true" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="#8A1C25">
      <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
    </svg>
  );
  
  // --- CONTENEUR ---
  const NavBarContainer = ({ children, isOpen, ...props }) => {
    return (
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        position="absolute"
        zIndex="1000"
        top="20px"
        left="50%"
        transform="translateX(-50%)"
        px={{ base: "16px", md: "24px" }}
        maxW="1360px"
        w={{ base: "calc(100% - 24px)", md: "calc(100% - 48px)" }}
        bg="brand.creme"
        border="1px solid"
        borderColor="brand.acier"
        borderRadius={isOpen ? "24px" : "100px"}
        transition="border-radius 0.2s"
        boxShadow="0px 8px 24px rgba(44, 62, 80, 0.20)"
        minH="72px"
        {...props}
      >
        {children}
      </Flex>
    );
  };
export default NavBar;