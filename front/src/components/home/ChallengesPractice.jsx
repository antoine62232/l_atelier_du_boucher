import React from "react";
import { Box, Container, Heading, Flex, Text } from "@chakra-ui/react";
import ChallengeCard from "./ChallengeCard";

const ChallengesPractice = () => {
  return (
    <Box as="section" bg="brand.beige" pb={{ base: 14, md: "84px" }}>
      <Container maxW="1400px">
        
        {/* TITRE DE SECTION */}
        <Heading 
          textAlign="center" 
          mb={4}
          color="brand.rouge" 
          fontFamily="title"
          fontSize={{ base: "3xl", md: "5xl" }}
        >
          Pratique & Challenges
        </Heading>

        <Text 
            textAlign="center" 
            color="brand.gris" 
            fontSize="md" 
            maxW="600px" 
            mx="auto" 
            mb={{ base: 10, md: "64px" }}
        >
            Testez vos connaissances théoriques et techniques à travers des quiz interactifs et des mises en situation réelles.
        </Text>

        {/* CONTENEUR FLEX */}
        <Flex 
            direction={{ base: "column", md: "row" }}
            gap={{ base: 6, md: 8, lg: 12 }}
            justify="center"
            align="stretch"
            maxW={{ base: "400px", md: "1100px" }}
            mx="auto"
        >
            
            {/* CARTE 1 : GAUCHE */}
            <Box flex="1" w="100%">
                <ChallengeCard 
                    title="Le Labo Calcul"
                    description="Prix de revient, taux de marge, pertes à la découpe... Accédez à vos outils."
                    buttonText="OUVRIR LES OUTILS"
                    link="/outils"
                    iconChar="%"
                    titleColor="brand.gris"
                    iconBg="brand.beige"
                    iconColor="brand.gris"
                    btnColor="brand.gris"
                    btnBorderColor="brand.gris"
                />
            </Box>

            {/* CARTE 2 : DROITE */}
            <Box flex="1" w="100%">
                <ChallengeCard 
                    title="Le Quiz du Jour"
                    description="Une série de questions sur les pièces, la découpe et la cuisson, avec la correction expliquée."
                    buttonText="LANCER LE DÉFI"
                    link="/quiz"
                    iconChar="?"
                    titleColor="brand.rouge" 
                    iconBg="brand.rouge"     
                    iconColor="brand.creme"
                    btnColor="brand.rouge"   
                    btnBorderColor="brand.rouge"
                />
            </Box>

        </Flex>
      </Container>
    </Box>
  );
};

export default ChallengesPractice;