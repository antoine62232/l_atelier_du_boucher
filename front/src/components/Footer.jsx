import React from "react";
import { Box, SimpleGrid, Text, Link, Stack, Image, Flex, Icon, Separator } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa"; 

import logoFooter from "../assets/logoFooter.png"; 

const Footer = () => {
  return (
    <Box 
      as="footer" 
      bg="brand.gris" 
      color="brand.beige"
      w="100%"
      py={{ base: 10, lg: "57px" }} 
      px={{ base: 6, lg: "120px" }}
      h="auto"
      display="flex"
      alignItems="center"
      justifyContent="center"

    >
      <Box w="100%">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} alignItems="start">
          
          {/* ---------------- COLONNE 1 : MARQUE ---------------- */}
          <Stack spacing={4} align="start">
            {/* Logo */}
            <Box w={{ base: "100px", md: "150px" }} mb={2}>
               <Image src={logoFooter} alt="Logo Atelier du Boucher" opacity={0.9} />
            </Box>

            <Box mb="24px">
                <Text fontFamily="title" fontSize="2xl" fontWeight="bold" letterSpacing="wide" color="brand.beige">
                L'ATELIER DU BOUCHER
                </Text>
                <Text fontSize="sm" color="brand.beige" mt={2} lineHeight="1.6" maxW="300px">
                L'Atlas numérique et compagnon technique des futurs artisans.
                </Text>
            </Box>

            {/* Réseaux Sociaux */}
            <Flex gap={4} >
              <Link 
                href="https://facebook.com" 
                isExternal 
                color="brand.beige"
                _hover={{ color: "brand.rouge" } }
                transition="color 0.3s"
                >
                <Icon as={FaFacebook} boxSize={5} />
              </Link>
              <Link href="https://instagram.com" 
              isExternal 
              color="brand.beige"
              _hover={{ color: "brand.rouge" }}
              transition="color 0.3s"
              >
                <Icon as={FaInstagram} boxSize={5}/>
              </Link>
              <Link href="https://linkedin.com" 
              isExternal 
              color="brand.beige"
              _hover={{ color: "brand.rouge" }}
              transition="color 0.3s"
              >
                <Icon as={FaLinkedin} boxSize={5} />
              </Link>
            </Flex>
          </Stack>

          {/* ---------------- COLONNE 2 : AIDE & CONTACT ---------------- */}
          <Stack spacing={0} align={{ base: "start", md: "center" }}>
            <Text 
                color="brand.brun" 
                fontFamily="title" 
                fontWeight="bold" 
                fontSize="lg" 
                mb={6}
                textTransform="uppercase"
            >
              Aide & Contact
            </Text>

            <Stack spacing={3} textAlign={{ base: "left", md: "center" }} mb={8}>
              <Link as={RouterLink} to="/contact" color="brand.beige" _hover={{ color: "brand.brun" }} fontSize="sm">
                Contacter l'Atelier /Admin
              </Link>
              <Link as={RouterLink} to="/support" color="brand.beige" _hover={{ color: "brand.brun" }} fontSize="sm">
                Support Technique
              </Link>
              <Link as={RouterLink} to="/faq" color="brand.beige" _hover={{ color: "brand.brun" }} fontSize="sm">
                FAQ (Foire Aux Questions)
              </Link>
            </Stack>

            {/* Copyright */}
            <Box w="100%" maxW="250px" mx="auto">
                <Separator borderColor="brand.beige" opacity={0.3} mb={4} />
                <Text fontSize="xs" color="brand.beige" textAlign="center">
                © 2026 L'Atelier du Boucher. Tous droits réservés
                </Text>
            </Box>
          </Stack>

          {/* ---------------- COLONNE 3 : INFORMATIONS LEGALES ---------------- */}
          <Stack spacing={0} align={{ base: "start", md: "end" }} textAlign={{ base: "left", md: "right" }}>
            <Text 
                color="brand.brun" 
                fontFamily="title" 
                fontWeight="bold" 
                fontSize="lg" 
                mb={6}
                textTransform="uppercase"
            >
              Informations Legales
            </Text>

            <Stack spacing={3} align={{ base: "start", md: "end" }}>
              <Link as={RouterLink} to="/mentions-legales" color="brand.beige" _hover={{ color: "brand.brun" }} fontSize="sm">
                Mentions Légales
              </Link>
              <Link as={RouterLink} to="/cgu" color="brand.beige" _hover={{ color: "brand.brun" }} fontSize="sm">
                Conditions Générales (CGU)
              </Link>
              <Link as={RouterLink} to="/politique-confidentialite" color="brand.beige" _hover={{ color: "brand.brun" }} fontSize="sm">
                Politique de Confidentialité
              </Link>
            </Stack>
          </Stack>

        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default Footer;