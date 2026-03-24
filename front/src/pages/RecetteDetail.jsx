import React, { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { 
  Box, Container, Heading, Text, Flex, VStack, HStack, 
  Badge, Spinner, Center, SimpleGrid, Icon, Image
} from "@chakra-ui/react";
import { FiClock, FiUser, FiArrowLeft, FiCheckCircle } from "react-icons/fi";

import { 
    getRecetteById, 
    getIngredientsByRecette, 
    getInstructionsByRecette 
} from "../services/RecettesService";

import { getImageUrl } from "../utils/imageUtils";
import FavoriteButton from "../components/common/FavoriteButton";

const RecetteDetail = () => {
  const { id } = useParams();
  const [recette, setRecette] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecetteData = async () => {
      try {
        const [recetteRes, ingredientsRes, instructionsRes] = await Promise.all([
          getRecetteById(id),
          getIngredientsByRecette(id),
          getInstructionsByRecette(id)
        ]);
        
        setRecette(recetteRes.data);
        setIngredients(ingredientsRes.data);
        setInstructions(instructionsRes.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecetteData();
  }, [id]);

  const getDifficulte = (niveau) => {
    if (niveau === 1) return { label: "Facile", color: "green.500" };
    if (niveau === 2) return { label: "Moyen", color: "orange.400" };
    if (niveau === 3) return { label: "Difficile", color: "red.500" };
    return { label: "Non défini", color: "gray.500" };
  };

  const getCout = (niveau) => {
    if (niveau === 1) return "Bon marché";
    if (niveau === 2) return "Moyen";
    if (niveau === 3) return "Élevé";
    return "Non défini";
  };

  if (loading) {
    return <Center h="100vh"><Spinner size="xl" color="brand.rouge" /></Center>;
  }

  if (!recette) {
    return <Center h="100vh"><Text fontSize="xl">Recette introuvable.</Text></Center>;
  }

  const difficulte = getDifficulte(recette.difficulte);

  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt="140px" pb="84px">
      <Container maxW="1200px" px={6}>
        
        <Flex as={RouterLink} to="/recettes" align="center" gap={2} color="brand.brun" fontWeight="bold" mb={6} _hover={{ color: "brand.rouge" }}>
            <FiArrowLeft /> Retour aux recettes
        </Flex>

        {/* En-tête */}
        <Box bg="white" borderRadius="2xl" overflow="hidden" boxShadow="lg" mb={10}>
            
            {/* L'image de couverture*/}
            <Box position="relative" w="100%" h={{ base: "250px", md: "400px" }}>
                
                {/* 👈 LE BOUTON COEUR */}
                <FavoriteButton 
                  itemId={recette.idRecette} 
                  type="recette" 
                  isInitiallyFavorite={recette.isFavori || false} 
                />

                <Image 
                    src={getImageUrl(`recettes/${recette.imageRecette}`)} 
                    fallbackSrc="https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1200&auto=format&fit=crop"
                    alt={recette.titre} 
                    w="100%" 
                    h="100%" 
                    objectFit="cover"
                />
            </Box>

            {/* Le bloc de texte (Titre, Badges, Temps...)*/}
            <Box p={{ base: 6, md: 10 }}>
                <Flex justify="space-between" align="flex-start" wrap="wrap" gap={4}>
                    <Box>
                        <Heading fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
                            {recette.titre}
                        </Heading>
                        <HStack spacing={4} color="gray.600" fontSize="lg" flexWrap="wrap">
                            <Badge bg={difficulte.color} color="white" px={3} py={1} borderRadius="full">
                                {difficulte.label}
                            </Badge>
                            <Badge bg="gray.200" color="gray.700" px={3} py={1} borderRadius="full">
                                Coût : {getCout(recette.cout)}
                            </Badge>
                            <Text fontWeight="bold" color="brand.brun">Pièce : {recette.nomPiece}</Text>
                        </HStack>
                    </Box>
                </Flex>

                <Box borderBottom="1px solid" borderColor="gray.300" w="100%" my={8} />

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} textAlign="center" color="brand.brun">
                    <VStack>
                        <FiClock size={30} />
                        <Text fontWeight="bold">Préparation</Text>
                        <Text>{recette.tempsPreparation} min</Text>
                    </VStack>
                    <VStack borderX={{ md: "1px solid #E2E8F0" }}>
                        <FiClock size={30} color="#8A1C25" />
                        <Text fontWeight="bold">Cuisson</Text>
                        <Text>{recette.tempsCuisson} min</Text>
                    </VStack>
                    <VStack>
                        <FiUser size={30} />
                        <Text fontWeight="bold">Portions</Text>
                        <Text>{recette.nbPersonnes} personnes</Text>
                    </VStack>
                </SimpleGrid>
            </Box>
        </Box>

        {/* Ingrédients et Préparation */}
        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={10} alignItems="start">
            
            <Box bg="white" p={8} borderRadius="xl" boxShadow="md" gridColumn={{ lg: "span 1" }}>
                <Heading size="lg" color="brand.brun" mb={6} fontFamily="title">Ingrédients</Heading>
                <VStack align="stretch" spacing={3}>
                    {ingredients.length > 0 ? (
                        ingredients.map((ing) => (
                            <Flex key={ing.ingredientId} justify="space-between" align="center" borderBottom="1px dashed" borderColor="gray.200" pb={2}>
                                <Text fontWeight="medium" color="gray.700">{ing.nomIngredient}</Text>
                                <Text fontWeight="bold" color="brand.rouge">
                                    {ing.quantiteValeur} {ing.unite}
                                </Text>
                            </Flex>
                        ))
                    ) : (
                        <Text color="gray.500" fontStyle="italic">Aucun ingrédient renseigné.</Text>
                    )}
                </VStack>
            </Box>

            <Box bg="white" p={8} borderRadius="xl" boxShadow="md" gridColumn={{ lg: "span 2" }}>
                <Heading size="lg" color="brand.brun" mb={6} fontFamily="title">Préparation</Heading>
                <VStack align="stretch" spacing={6}>
                    {instructions.length > 0 ? (
                        instructions.map((etape) => (
                            <Flex key={etape.ordreEtape} gap={4}>
                                <Flex 
                                    minW="40px" h="40px" bg="brand.rouge" color="white" 
                                    borderRadius="full" align="center" justify="center" 
                                    fontWeight="bold" fontSize="lg"
                                >
                                    {etape.ordreEtape}
                                </Flex>
                                <Box mt={1}>
                                    <Text color="gray.700" lineHeight="1.7" fontSize="md">
                                        {etape.descriptionEtape}
                                    </Text>
                                </Box>
                            </Flex>
                        ))
                    ) : (
                        <Text color="gray.500" fontStyle="italic">Aucune étape renseignée.</Text>
                    )}
                </VStack>
            </Box>

        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default RecetteDetail;