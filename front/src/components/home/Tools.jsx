import React from "react";
import { Box, Container, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import ToolsCard from "./ToolsCard";

import atlasImg from "../../assets/atlasCard.png";
import gestesImg from "../../assets/gestesCard.png";
import laboImg from "../../assets/laboCard.png";
import recettesImg from "../../assets/recettesCard.png";

const toolsData = [
  {
    title: "L'Atlas Anatomique",
    description: "Maîtrisez chaque pièce, du squelette à la découpe finale.",
    buttonText: "Explorer l'Atlas",
    link: "/atlas",
    image: atlasImg 
  },
  {
    title: "Gestes & Techniques",
    description: "La vidéothèque des savoir-faire : désossage, parage et ficelage.",
    buttonText: "Voir les Techniques",
    link: "/videos",
    image: gestesImg 
  },
  {
    title: "Le Labo Calcul",
    description: "Calculez vos rendements, pertes et marges en temps réel.",
    buttonText: "Accéder au Calculateur",
    link: "/outils",
    image: laboImg 
  },
  {
    title: "De la Découpe à l'Assiette",
    description: "Valorisez vos produits grâce aux suggestions culinaires.",
    buttonText: "Voir les Recettes",
    link: "/recettes",
    image: recettesImg 
  }
];

const Tools = () => {
  return (
    <Box
    as="section"
    bg="brand.beige" 
    pt="84px" 
    pb="84px">

      <Container maxW="1400px"> 
        
        <Heading 
          textAlign="center"
          mb={8}
          color="brand.rouge" 
          fontFamily="title"
          fontSize={{ base: "3xl", md: "5xl" }}
        >
          Vos Outils d'Apprentissage
        </Heading>

        <Text 
            textAlign="center" 
            color="brand.gris" 
            fontSize="md" 
            maxW="600px" 
            mx="auto" 
            mb="84px"
        >
            Une suite complète de ressources interactives conçues pour vous accompagner du laboratoire à la vente.
        </Text>

        <SimpleGrid 
            columns={{ base: 1, md: 2, xl: 4 }} 
            spacing="62px" 
            justifyItems="center"
        >
          {toolsData.map((tool, index) => (
            <ToolsCard 
              key={index}
              {...tool} 
            />
          ))}
        </SimpleGrid>

      </Container>
    </Box>
  );
};

export default Tools;