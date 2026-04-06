import React, { useState, useEffect } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { 
    Box, Container, Heading, Text, Button, VStack, Flex, 
    Spinner, Center, Image, Badge, SimpleGrid, Icon 
} from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import api from "../../api/api"; 

// Import des composants et utilitaires cohérents
import AtlasDetails from "../../components/atlas/AtlasDetails"; 
import { getImageUrl } from "../../utils/imageUtils"; 

const AtlasBoeufArriereCuisseDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [partie, setPartie] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Récupération de la partie (ex: Arrière Cuisse / Rumsteck)
        const resPartie = await api.get(`/parties/${id}`);
        const dataPartie = Array.isArray(resPartie.data) ? resPartie.data[0] : resPartie.data;
        
        // Récupération de tous les morceaux rattachés
        const resPieces = await api.get(`/pieces/partie/${id}`);
        
        setPartie(dataPartie);
        setPieces(resPieces.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="brand.rouge" thickness="4px" />
      </Center>
    );
  }

  if (!partie) {
    return (
      <Center h="50vh">
        <VStack>
          <Heading size="md" color="gray.500">Partie introuvable</Heading>
          <Button mt={4} onClick={() => navigate("/atlas")} colorScheme="red">Retour à l'Atlas</Button>
        </VStack>
      </Center>
    );
  }

  return (
    <Box bg="brand.fond" minH="100vh" py={10} fontFamily="body">
      <Container maxW="container.xl">
        
        {/* BOUTON RETOUR ET TITRE */}
        <VStack align="start" spacing={4} mb={10}>
            <Button variant="ghost" color="gray.600" onClick={() => navigate(-1)} _hover={{ bg: "whiteAlpha.500" }}>
                <Icon as={FiArrowLeft} mr={2} /> Retour à la découpe
            </Button>
            
            <Flex align="center" gap={4}>
                <Heading size="2xl" color="brand.rouge" fontFamily="title">{partie.nomPartie}</Heading>
                <Badge colorScheme="red" variant="solid" borderRadius="full" px={3}>
                    {pieces.length} morceaux
                </Badge>
            </Flex>
            <Text fontSize="lg" color="gray.700" maxW="4xl">
                {partie.descriptionPartie}
            </Text>
        </VStack>

        {/* ORGANISATION EN DEUX COLONNES */}
        <Flex direction={{ base: "column", lg: "row" }} gap={12} align="start">
          
          {/* COLONNE GAUCHE : LA PIÈCE MAÎTRESSE (Fixe au scroll sur desktop) */}
          <Box flex="1" position={{ lg: "sticky" }} top="20px">
             <Heading size="md" color="brand.brun" mb={4} textTransform="uppercase" letterSpacing="wider">
                Vue d'ensemble
             </Heading>
             <Box bg="gray.50" borderRadius="2xl" overflow="hidden" shadow="2xl" border="4px solid white">
                <Image 
                    src={getImageUrl(`parties/${partie.imagePartie}`)} 
                    alt={partie.nomPartie}
                    fallbackSrc="https://via.placeholder.com/600x400?text=Image+en+cours"
                />
             </Box>
          </Box>

          {/* COLONNE DROITE : TOUTES LES PIÈCES DÉTAILLÉES */}
          <Box flex="1.5">
            <Heading size="md" color="brand.brun" mb={6} textTransform="uppercase" letterSpacing="wider">
                Détail des morceaux
            </Heading>
            
            {pieces.length === 0 ? (
                <Text color="gray.500" fontStyle="italic">Aucun morceau enregistré pour cette zone.</Text>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {pieces.map((piece) => (
                        <AtlasDetails 
                            key={piece.idPiece} 
                            selectedPiece={piece} 
                            getImageUrl={getImageUrl} 
                        />
                    ))}
                </SimpleGrid>
            )}
          </Box>

        </Flex>
      </Container>
    </Box>
  );
};

export default AtlasBoeufArriereCuisseDetail;