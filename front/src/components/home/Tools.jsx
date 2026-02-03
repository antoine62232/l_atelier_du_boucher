import React from "react";
import { Box, Container, Heading, SimpleGrid } from "@chakra-ui/react";
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
          mb="84px"
          color="brand.rouge" 
          fontFamily="title"
          fontSize={{ base: "3xl", md: "5xl" }}
        >
          Vos Outils d'Apprentissage
        </Heading>

        <SimpleGrid 
            // BREAKPOINTS ADAPTÉS :
            // base (Mobile) : 1 colonne
            // md (Tablette) : 2 colonnes
            // xl (Grand écran > 1280px) : 4 colonnes (C'est là qu'on aura tout aligné)
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