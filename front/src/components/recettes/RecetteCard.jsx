import React from "react";
import { Box, Image, Text, Badge, Flex, Heading } from "@chakra-ui/react";
import { FiClock, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUtils";
import FavoriteButton from "../common/FavoriteButton";

const RecetteCard = ({ recette }) => {
  const navigate = useNavigate();

  const getDifficulteLabel = (niveau) => {
    if (niveau === 1) return "Facile";
    if (niveau === 2) return "Moyen";
    if (niveau === 3) return "Difficile";
    return "Non défini";
  };

  return (
    <Box
      onClick={() => navigate(`/recettes/${recette.idRecette}`)}
      w="100%" bg="white" borderRadius="xl" overflow="hidden" boxShadow="md" cursor="pointer" 
      transition="all 0.3s ease" 
      css={{ 
        "&:hover": { transform: "translateY(-5px)", boxShadow: "var(--chakra-shadows-xl)" }, 
        "&:hover .recette-image": { transform: "scale(1.05)" }
      }}
    >
      <Box position="relative" h="200px" w="100%" overflow="hidden">
        
        {/* LE BOUTON COEUR */}
        <FavoriteButton 
          itemId={recette.idRecette} 
          type="recette" 
          isInitiallyFavorite={recette.isFavori || false} 
        />

        <Image 
          src={getImageUrl(`recettes/${recette.imageRecette}`)} 
          alt={recette.titre} 
          w="100%" 
          h="100%" 
          objectFit="cover" 
          transition="transform 0.4s ease"
          className="recette-image" 
        />
        
        <Badge position="absolute" top={3} left={3} bg="brand.rouge" color="white" px={3} py={1} borderRadius="full" fontWeight="bold">
            {getDifficulteLabel(recette.difficulte)}
        </Badge>
      </Box>

      <Flex direction="column" p={5} gap={3}>
        <Heading fontFamily="title" fontSize="xl" color="brand.gris" lineHeight="1.2" noOfLines={2}>
            {recette.titre}
        </Heading>
        <Text color="gray.500" fontSize="sm" noOfLines={2}>
            Découvrez cette délicieuse recette...
        </Text>
        <Box borderBottom="1px solid" borderColor="gray.200" my={1} />
        <Flex justify="space-between" align="center" color="brand.brun" fontSize="sm" fontWeight="medium">
            <Flex align="center" gap={1}>
                <FiClock /> {recette.tempsPreparation + recette.tempsCuisson} min
            </Flex>
            <Flex align="center" gap={1}>
                <FiUser /> {recette.nbPersonnes || 4} pers.
            </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default RecetteCard;