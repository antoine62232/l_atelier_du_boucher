import React from "react";
import { Box, Container, Heading, Flex } from "@chakra-ui/react";
import ChallengeCard from "./ChallengeCard";

const ChallengesPractice = () => {
  return (
    <Box as="section" bg="brand.beige" pb="84px">
      <Container maxW="1400px">
        
        {/* TITRE DE SECTION */}
        <Heading 
          textAlign="center" 
          mb="84px"
          color="brand.rouge" 
          fontFamily="title"
          fontSize={{ base: "3xl", md: "5xl" }}
        >
          Pratique & Challenges
        </Heading>

        {/* CONTENEUR FLEX (Plus robuste pour l'espacement) */}
        <Flex 
            direction={{ base: "column", md: "row" }}
            gap="106px"
            justify="center"
            align="stretch"
            maxW="1280px"
            mx="auto"
        >
            
            {/* CARTE 1 : GAUCHE */}
            <Box flex="1" w="100%"> {/* flex="1" assure que les cartes font la même taille */}
                <ChallengeCard 
                    title="Le Labo Calcul"
                    description="Prix de revient, taux de marge, pertes à la découpe... Accédez à vos outils."
                    buttonText="OUVRIR LES OUTILS"
                    link="/outils"
                    iconChar="%"
                    titleColor="brand.gris"
                    iconBg="#F7F9FA"       
                    iconColor="brand.gris" 
                    btnColor="brand.acier" 
                    btnBorderColor="brand.acier"
                />
            </Box>

            {/* CARTE 2 : DROITE */}
            <Box flex="1" w="100%">
                <ChallengeCard 
                    title="Le Quiz du Jour"
                    description="Testez vos connaissances : Reconnaître les morceaux du Bœuf (Niveau 1)"
                    buttonText="LANCER LE DÉFI"
                    link="/quiz"
                    iconChar="?"
                    titleColor="brand.rouge" 
                    iconBg="brand.rouge"     
                    iconColor="#581218"      
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