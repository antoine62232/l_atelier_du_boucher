import React from "react";
import FilAriane from "../components/atlas/FilAriane";
import { Box, Container, Heading, Text, Flex } from "@chakra-ui/react";
import AnimalCard from "../components/atlas/AnimalCard";
import boeufImg from "../assets/cardAtlasBoeuf.jpg"; 

const Atlas = () => {
  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt="140px" pb="40px">
      <Container maxW="1360px" px={6}>
        
        {/* Fil d'ariane + Bouton (Alignés à gauche) */}
        <FilAriane
            etapes={[{ label: "Atlas", to: "#" }]}
        />

        {/* En-têtes */}
        <Box textAlign="center" mb="60px">
            <Heading as="h1"
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