import React from "react";
import { Box, Image, Text, Flex, Heading, IconButton } from "@chakra-ui/react";
import { FiClock, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUtils";

const RecetteCard = ({ recette, onToggleFavori }) => {
  const navigate = useNavigate();

  // Fonction pour retirer des favoris sans ouvrir la recette
  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavori) {
      onToggleFavori(recette.idRecette);
    }
  };

  const nomImage = recette.imageRecette || recette.image || "";

  return (
    <Box
      onClick={() => navigate(`/recettes/${recette.idRecette}`)}
      w="100%" bg="white" borderRadius="xl" overflow="hidden" boxShadow="sm" cursor="pointer"
      transition="all 0.3s ease"
      css={{ "&:hover": { transform: "translateY(-5px)", boxShadow: "var(--chakra-shadows-md)" } }}
      position="relative"
    >
      {/* LA POUBELLE POUR LE DASHBOARD */}
      <IconButton
        aria-label="Retirer des favoris"
        position="absolute"
        top="12px"
        right="12px"
        zIndex="2"
        color="red.500"
        bg="white"
        borderRadius="full"
        boxShadow="md"
        size="sm"
        onClick={handleRemove}
        _hover={{ bg: "red.50", transform: "scale(1.1)" }}
      >
        <FiTrash2 />
      </IconButton>

      <Box h="150px" w="100%" overflow="hidden">
        <Image
          src={nomImage ? getImageUrl(`recettes/${nomImage}`) : undefined}
          fallbackSrc="https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop"
          alt={recette.titre}
          w="100%" h="100%" objectFit="cover"
        />
      </Box>

      <Flex direction="column" p={4} gap={2}>
        <Heading fontFamily="title" fontSize="lg" color="brand.gris" noOfLines={1} lineHeight="1.2">
          {recette.titre}
        </Heading>
        
        {(recette.tempsPreparation !== undefined) && (
          <Flex align="center" gap={1} color="brand.brun" fontSize="sm" fontWeight="medium">
            <FiClock /> {(recette.tempsPreparation || 0) + (recette.tempsCuisson || 0)} min
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default RecetteCard;