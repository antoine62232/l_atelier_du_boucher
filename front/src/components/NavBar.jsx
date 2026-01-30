import { Box, Flex, Text, Link, HStack, Image, Switch, FormLabel, FormControl, IconButton } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiUser } from "react-icons/fi";
import logo from '../assets/logoNavBar.png';

export default function NavBar() {
  const LINKS = [
    { name: 'Atlas', href: '/atlas' },
    { name: 'Vidéothèque', href: '/videos' },
    { name: 'Outils', href: '/outils' },
    { name: 'Recettes', href: '/recettes' },
    { name: 'Quiz', href: '/quiz' },
    { name: 'Actualités', href: '/actu' },
  ];

  return (
    <Box w="100%" px={4} mt={4}>
      
      <Flex
        as="nav"
        // --- DIMENSIONS & POSITION ---
        h="72px"
        maxW="1360px"
        w="100%"
        mx="auto"
        align="center"
        justify="space-between"
        px="24px"
        bg="brand.creme"
        border="1px solid"
        borderColor="brand.acier"
        borderRadius="100px"
        boxShadow="sm"
      >

        {/* 1. LOGO / TITRE (Cliquable vers l'accueil) */}
        <Link 
          as={RouterLink} 
          to="/" 
          _hover={{ textDecoration: 'none' }}
        >
          <HStack spacing={"12px"}>
            <Image 
              src={logo} 
              alt="Logo Atelier du Boucher" 
              h="45px"
              objectFit="contain"
            />
            <Text
              fontFamily="titre"
              fontWeight="bold"
              fontSize="20px"
              letterSpacing="normal"
              color="brand.rouge"
              display={{ base: 'none', sm: 'block' }}
            >
              L'ATELIER DU BOUCHER
            </Text>
          </HStack>
        </Link>

        {/* 2. LIENS (Menu Central) */}
        <HStack spacing={8} display={{ base: 'none', lg: 'flex' }}>
          {LINKS.map((link) => (
            <Link
              as={RouterLink} // Utilise le RouterLink pour la navigation fluide
              to={link.href}  // "to" au lieu de "href" pour RouterLink
              key={link.name}
              fontSize="15px"
              fontWeight="medium"
              color="brand.gris"
              _hover={{
                textDecoration: 'none',
                color: 'brand.rouge',
              }}
            >
              {link.name}
            </Link>
          ))}
        </HStack>

        {/* 3. ACTIONS (Boutons Droite) */}
        <FormControl display='flex' alignItems='center' width="auto">
            <FormLabel 
                htmlFor='chakra-switch' 
                mb='0' 
                mr={3} 
                color="brand.gris" 
                fontWeight="normal"
                fontSize="16px"
                cursor="pointer"
            >
                Mode Atelier
            </FormLabel>
            <Switch 
    id='chakra-switch' 
    colorScheme="red" // La barre devient Rouge quand activée
    size="md"
    sx={{
        // Cible le rond (Thumb)
        'span.chakra-switch__thumb': {
            bg: 'brand.gris', // Couleur du rond quand DÉSACTIVÉ (Gris Ardoise)
            _checked: {
                bg: 'white', // Couleur du rond quand ACTIVÉ (Brun Croûte)
            }
        },
        // (Optionnel) Si tu veux aussi changer la barre grise par défaut
        'span.chakra-switch__track': {
            bg: '#E5E7EB', // Couleur de la barre quand désactivée
            border : '1px solid #AAB7B8',
            _checked: {
                bg: 'brand.rouge', // Couleur de la barre quand activée
                borderColor: 'brand.rouge', // Couleur de la barre quand activée
            }
        }
    }}
/>
        </FormControl>

        <Box
            h="32px"
            w="1px"
            bg="brand.gris"
            opacity="0.5"
            ml="24px"
            mr="24px"
            />
        <IconButton
        as={RouterLink}
        to="/profil"
        icon={<FiUser size={24} />}
        variant="ghost"
        isRound={true}
        aria-label="Mon profil"
        color="brand.gris"
        _hover={{
            bg: "brand.rouge", color: "white",
        }}
        />
            

      </Flex>
    </Box>
  );
}