import React from "react";
import { Box, Container, Heading, Text, Button, Flex, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import AnimalCard from "../components/atlas/AnimalCard";
import boeufImg from "../assets/cardAtlasBoeuf.jpg"; 

const Atlas = () => {
  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt="140px" pb="40px">
      <Container maxW="1360px" px={6}>
        
        {/* Fil d'ariane + Bouton (Alignés à gauche) */}
        <VStack align="start" spacing="12px" mb={10}>
             {/* Fil d'ariane */}
             <Text fontSize="sm" color="gray.500">
                <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    Accueil
                </RouterLink> 
                &nbsp; &gt; &nbsp; 
                <Text as="span" color="brand.rouge" fontWeight="medium">
                    Atlas Anatomique
                </Text>
            </Text>

            {/* Bouton Retour */}
            <Button 
                as={RouterLink} 
                to="/"
                variant="outline" 
                borderColor="brand.brun" 
                color="brand.brun" 
                borderRadius="full"
                bg="white"
                _hover={{ bg: "brand.brun", color: "white" }}
                size="md"
                px={8}
                fontSize="sm"
                fontWeight="normal"
            >
                Retour à l'accueil
            </Button>
        </VStack>

        {/* En-têtes */}
        <Box textAlign="center" mb="60px">
            <Heading 
                fontFamily="title" 
                color="brand.rouge" 
                fontSize={{ base: "3xl", md: "5xl" }} 
                mb={4}
            >
                Choisissez votre animal
            </Heading>
            <Text color="brand.gris" fontSize="md">
                Sélectionnez une espèce pour explorer ses découpes, ses pièces et nos spécificités bouchères
            </Text>
        </Box>

        {/* Cartes */}
        <Flex justify="center" align="center" w="100%" mb={10}>
            <AnimalCard 
                name="Le Bœuf" 
                image={boeufImg} 
                link="/atlas/boeuf" 
            />
        </Flex>

      </Container>
    </Box>
  );
};

export default Atlas;