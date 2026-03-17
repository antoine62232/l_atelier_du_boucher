import React, { useState } from "react";
import { Link as RouterLink, NavLink } from "react-router-dom";
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
  Switch,
  Collapsible,
  Portal
} from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";
import logoImg from "../assets/logoNavBar.png";
import SignUpModal from "./auth/SignUpModal";
import LoginModal from "./auth/LoginModal";

// --- COMPOSANT PRINCIPAL ---
const NavBar = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);

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
    <NavBarContainer {...props}>

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
      <MobileMenu isOpen={isOpen} openSignUpClick={openSignUp} openLoginClick={openLogin} />

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
  );
};

const DesktopLinks = () => {
    return (
      <HStack gap="32px">
        <MenuItemLink to="/atlas">Atlas</MenuItemLink>
        <MenuItemLink to="/videos">Vidéothèque</MenuItemLink>
        <MenuItemLink to="/outils">Outils</MenuItemLink>
        <MenuItemLink to="/recettes">Recettes</MenuItemLink>
        <MenuItemLink to="/quiz">Quiz</MenuItemLink>
        <MenuItemLink to="/actualites">Actualités</MenuItemLink>
      </HStack>
    )
  }
  
  const Logo = () => {
    return (
      <HStack gap="12px">
  
        <Link
          as={RouterLink}
          to="/"
  
          _focus={{ outline: "none", boxShadow: "none" }}
          _focusVisible={{ outline: "none", boxShadow: "none" }}
          textDecoration="none"
          _hover={{ textDecoration: "none" }}
        >
          <Image
            src={logoImg}
            alt="Logo"
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

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    // On recharge la page pour que le menu se mette à jour
    window.location.reload();
  };

  return (
    <Flex align="center" gap={4}>
      {/* Switch Mode Atelier */}
      <Flex align="center" gap={3}>
        <Text color="brand.gris" fontWeight="medium" fontSize="16px">
          Mode Atelier
        </Text>
        <Switch.Root size="md" colorPalette="red" cursor="pointer">
          <Switch.HiddenInput />
          <Switch.Control
            css={{
              display: "flex",
              alignItems: "center",
              bg: "gray.100",
              borderColor: "brand.acier",
              borderWidth: "1px",
              _checked: { bg: "brand.rouge", borderColor: "brand.rouge" }
            }}
          >
            <Switch.Thumb css={{ bg: "brand.gris", _checked: { bg: "#FFFCF5" } }} />
          </Switch.Control>
        </Switch.Root>
      </Flex>

      <Box h="32px" w="1px" bg="brand.gris" opacity="0.5" />
      {/* MENU PROFIL */}
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton
            variant="ghost"
            rounded="full"
            aria-label="Profil"
            color="brand.gris"
            _hover={{ bg: 'brand.rouge', color: 'white' }}
            css={{ _open: { bg: 'brand.rouge', color: 'white' } }}
            display="flex"
            alignItems="center"
            gap={2}
            w="auto"
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
              {/* Menu pour UTILISATEUR CONNECTÉ */}
              <Menu.Item value="profil" cursor="pointer" _hover={{ bg: "gray.100" }}>
                Mon Profil
              </Menu.Item>
             
            
            
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
  
        // --- FOCUS (Pas de rectangle) ---
        _focus={{ outline: "none", boxShadow: "none" }}
        _focusVisible={{ outline: "none", boxShadow: "none" }}
  
        // --- QUAND ACTIF (Page courante) ---
        css={{
          "&.active": {
            color: "#8A1C25",
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
      <Box display={{ base: "block", lg: "none" }} onClick={toggle} cursor="pointer" ml={4}>
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </Box>
    );
  };

const MobileMenu = ({ isOpen, openSignUpClick, openLoginClick }) => {
  return (
    <Collapsible.Root open={isOpen}>
      <Collapsible.Content>
        <Box pb={4} display={{ lg: 'none' }}>
          <Stack gap={4} align="center" mt={4} borderTop="1px solid" borderColor="brand.acier" pt={4}>
            {/* ... Liens ... */}
            <MenuItemLink to="/atlas">Atlas</MenuItemLink>
            <MenuItemLink to="/videos">Vidéothèque</MenuItemLink>
            <MenuItemLink to="/outils">Outils</MenuItemLink>
            <MenuItemLink to="/recettes">Recettes</MenuItemLink>
            <MenuItemLink to="/quiz">Quiz</MenuItemLink>
            <MenuItemLink to="/actu">Actualités</MenuItemLink>
            <Box pt={4}>
              <RightActions openSignUpClick={openSignUpClick} openLoginClick={openLoginClick} />
            </Box>
          </Stack>
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

// ... (SVG Icons et NavBarContainer identiques) ...
const CloseIcon = () => (
    <svg width="24" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path fill="#8A1C25" d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z" />
    </svg>
  );
  const MenuIcon = () => (
    <svg width="24px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="#8A1C25">
      <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
    </svg>
  );
  
  // --- CONTENEUR ---
  const NavBarContainer = ({ children, ...props }) => {
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
        px="24px"
        maxW="1360px"
        w="calc(100% - 48px)"
        bg="brand.creme"
        border="1px solid"
        borderColor="brand.acier"
        borderRadius="100px"
        boxShadow="0px 8px 24px rgba(44, 62, 80, 0.20)"
        minH="72px"
        {...props}
      >
        {children}
      </Flex>
    );
  };
export default NavBar;