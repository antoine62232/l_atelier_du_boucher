import React from "react";
import ImageAvecSecours from "../ImageAvecSecours";
import { 
  Box, Image, Badge, Heading, Text, Flex, Icon, Button 
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiCalendar, FiArrowRight } from "react-icons/fi";
import { getImageUrl } from "../../utils/imageUtils";

const ActualiteCard = ({ actualite }) => {
  const dateFormatee = new Date(actualite.datePublication).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const imagePath = actualite.imageActualite?.startsWith('http') 
    ? actualite.imageActualite 
    : getImageUrl(`actualites/${actualite.imageActualite}`);

  const couperTexte = (texte, max) => {
    if (!texte) return "";
    return texte.length > max ? texte.substring(0, max).trim() + "..." : texte;
  };

  return (
    <Box 
      bg="white" 
      borderRadius="xl" 
      overflow="hidden" 
      boxShadow="md" 
      transition="transform 0.3s"
      _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
      display="flex" 
      flexDirection="column" 
      height="100%"
    >
      <Box h="200px" flexShrink={0} bg="gray.100">
        <ImageAvecSecours 
          src={imagePath} 
          alt={actualite.titre}
          w="100%"
          h="100%"
          objectFit="cover"
        />
      </Box>

      <Box p={6} display="flex" flexDirection="column" flex="1">
        
        <Flex justify="space-between" align="center" mb={4}>
          <Badge colorPalette="red" variant="subtle" px={2} py={1} borderRadius="md">
            {actualite.categorie}
          </Badge>
          <Flex align="center" gap={1} color="gray.500" fontSize="xs">
            <Icon as={FiCalendar} />
            <Text>{dateFormatee}</Text>
          </Flex>
        </Flex>

        {/* Fonction de coupe (env. 55 caractères pour le titre) */}
        <Heading 
          size="md" 
          color="brand.brun" 
          fontFamily="title" 
          lineHeight="1.4" 
          mb={3}
          minH="50px"
        >
          {couperTexte(actualite.titre, 55)}
        </Heading>

        {/* Fonction de coupe (env. 120 caractères pour l'extrait) */}
        <Text 
          color="gray.600" 
          fontSize="sm" 
          mb={6}
          minH="60px"
        >
          {couperTexte(actualite.contenu, 120)}
        </Text>

        <Button 
          asChild
          variant="plain"
          px={0}
          color="brand.rouge" 
          alignSelf="flex-start"
          mt="auto" 
          _hover={{ color: "brand.brun" }}
        >
          <RouterLink to={`/actualites/${actualite.idActualite}`}>
            Lire la suite <FiArrowRight aria-hidden="true" />
          </RouterLink>
        </Button>

      </Box>
    </Box>
  );
};

export default ActualiteCard;