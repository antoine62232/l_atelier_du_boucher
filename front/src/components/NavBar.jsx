import React from "react";
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
  Collapsible 
} from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";
import logoImg from "../assets/logoNavBar.png";

// --- COMPOSANT PRINCIPAL ---
const NavBar = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);

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

      {/* 3. ZONE DROITE (Actions ou Toggle Mobile) */}
      <Flex flex={{ base: 1, lg: 1 }} justify="flex-end" align="center">
        
        {/* Sur PC */}
        <Box display={{ base: "none", lg: "block" }}>
            <RightActions />
        </Box>

        {/* Sur Mobile */}
        <MenuToggle toggle={toggle} isOpen={isOpen} />
        
      </Flex>

      {/* 4. MENU DÉROULANT MOBILE */}
      <MobileMenu isOpen={isOpen} />

    </NavBarContainer>
  );
};

// --- LES COMPOSANTS DÉTAILLÉS ---

const DesktopLinks = () => {
    return (
        <HStack gap="32px"> {/* "spacing" devient souvent "gap" en v3 */}
            <MenuItemLink to="/atlas">Atlas</MenuItemLink>
            <MenuItemLink to="/videos">Vidéothèque</MenuItemLink>
            <MenuItemLink to="/outils">Outils</MenuItemLink>
            <MenuItemLink to="/recettes">Recettes</MenuItemLink>
            <MenuItemLink to="/quiz">Quiz</MenuItemLink>
            <MenuItemLink to="/actu">Actualités</MenuItemLink>
        </HStack>
    )
}

const Logo = () => {
  return (
    <HStack gap="12px">
      
      {/* 1. SEULEMENT L'IMAGE EST UN LIEN */}
      <Link 
        as={RouterLink} 
        to="/" 
        
        // Supprime le rectangle gris (focus ring) au clic
        _focus={{ outline: "none", boxShadow: "none" }}
        _focusVisible={{ outline: "none", boxShadow: "none" }}
        
        // Supprime le soulignement par défaut des liens
        textDecoration="none"
        _hover={{ textDecoration: "none" }}
      >
        <Image 
            src={logoImg} 
            alt="Logo" 
            h="45px" 
            fit="contain" 
            // Petit bonus : léger zoom au survol pour montrer que c'est cliquable
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
        />
      </Link>

      {/* 2. LE TEXTE EST JUSTE DU TEXTE (Non cliquable) */}
      <Text
        fontFamily="heading"
        fontWeight="bold"
        fontSize="20px"
        color="brand.rouge"
        display={{ base: 'none', xl: 'block' }}
        cursor="default" // Le curseur reste une flèche (pas une main)
        userSelect="none" // Empêche de sélectionner le texte (effet plus "App")
      >
        L'ATELIER DU BOUCHER
      </Text>

    </HStack>
  );
};

const RightActions = () => {
    return (
        <Flex align="center" gap={4}>
            {/* SWITCH V3 (Structure composée) */}
            <Flex align="center" gap={3}>
                <Text 
                    color="brand.gris" 
                    fontWeight="medium" 
                    fontSize="16px"  
                >
                    Mode Atelier
                </Text>
                
                <Switch.Root size="md" colorPalette="red" cursor="pointer">
                    <Switch.HiddenInput />
                    <Switch.Control 
                        // Style personnalisé du Track (la barre)
                        css={{
                          display: "flex",
                          alignItems: "center",
                            bg: "gray.100",
                            borderColor: "brand.acier",
                            borderWidth: "1px",
                            _checked: { 
                                bg: "brand.rouge", 
                                borderColor: "brand.rouge" 
                            }
                        }}
                    >
                        <Switch.Thumb 
                             // Style personnalisé du Thumb (le rond)
                             css={{
                                bg: "brand.gris",
                                _checked: { bg: "#FFFCF5" }
                             }}
                        />
                    </Switch.Control>
                </Switch.Root>
            </Flex>

            {/* TRAIT SÉPARATEUR */}
            <Box h="32px" w="1px" bg="brand.gris" opacity="0.5" />

            {/* MENU PROFIL V3 (Syntaxe Menu.Root) */}
            <Menu.Root>
                <Menu.Trigger asChild>
                    <IconButton
                        variant="ghost"
                        rounded="full" // isRound -> rounded="full"
                        aria-label="Profil"
                        color="brand.gris"
                        _hover={{ bg: 'brand.rouge', color: 'white' }}
                        css={{ _open: { bg: 'brand.rouge', color: 'white' } }} // _active -> _open
                    >
                        <FiUser size={24} />
                    </IconButton>
                </Menu.Trigger>
                
                <Menu.Positioner>
                    <Menu.Content 
                        bg="brand.creme" 
                        borderColor="brand.acier" 
                        boxShadow="lg"
                    >
                        <Menu.Item asChild value="connexion">
                            <RouterLink to="/connexion">Connexion</RouterLink>
                        </Menu.Item>
                        <Menu.Item asChild value="inscription">
                            <RouterLink to="/inscription">Inscription</RouterLink>
                        </Menu.Item>
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
      fontWeight="medium" // On reste en medium tout le temps
      color="brand.gris"
      textDecoration="none"

      // --- AU SURVOL ---
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
            color: "#8A1C25", // Rouge Bœuf
            // Plus de fontWeight: "bold" ici -> Plus de décalage !
        }
      }}

      {...rest}
    >
      {children}
    </Link>
  );
};

// --- GESTION DU MOBILE ---

const MenuToggle = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", lg: "none" }} onClick={toggle} cursor="pointer" ml={4}>
      {isOpen ? <CloseIcon /> : <MenuIcon />}
    </Box>
  );
};

const MobileMenu = ({ isOpen }) => {
    return (
        <Collapsible.Root open={isOpen}>
             <Collapsible.Content>
                <Box pb={4} display={{ lg: 'none' }}>
                    <Stack gap={4} align="center" mt={4} borderTop="1px solid" borderColor="brand.acier" pt={4}>
                        <MenuItemLink to="/atlas">Atlas</MenuItemLink>
                        <MenuItemLink to="/videos">Vidéothèque</MenuItemLink>
                        <MenuItemLink to="/outils">Outils</MenuItemLink>
                        <MenuItemLink to="/recettes">Recettes</MenuItemLink>
                        <MenuItemLink to="/quiz">Quiz</MenuItemLink>
                        <MenuItemLink to="/actu">Actualités</MenuItemLink>
                        <Box pt={4}>
                             <RightActions />
                        </Box>
                    </Stack>
                </Box>
            </Collapsible.Content>
        </Collapsible.Root>
    )
}

// --- ICONES SVG ---
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
      mt="20px"
      px="24px"
      maxW="1360px"
      mx="auto"
      w="calc(100% - 80px)"
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