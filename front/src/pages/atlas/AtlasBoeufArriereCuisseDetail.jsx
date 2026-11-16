import React, { useState, useEffect } from "react";
import ImageAvecSecours from "../../components/ImageAvecSecours";
import FilAriane from "../../components/atlas/FilAriane";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Box, Container, Heading, Text, Button, VStack, Flex, Spinner, Center, Image, Badge, SimpleGrid } from "@chakra-ui/react";
import api from "../../api/api"; 

import AtlasDetails from "../../components/atlas/AtlasDetails"; 
import { getImageUrl } from "../../utils/imageUtils"; 

const AtlasBoeufArriereCuisseDetail = () => {
  const { id } = useParams(); 

  const [partie, setPartie] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retour en haut de la page à chaque chargement de détail
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        setLoading(true);
        const resPartie = await api.get(`/parties/${id}`);
        const dataPartie = Array.isArray(resPartie.data) ? resPartie.data[0] : resPartie.data;
        
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
          <Button as={RouterLink} to="/atlas" mt={4} colorPalette="red">Retour à l'Atlas</Button>
        </VStack>
      </Center>
    );
  }

  return (
    <Box bg="brand.fond" minH="100vh" pt="140px" pb={10} fontFamily="body">
      <Container maxW="container.xl">
        
        {/* HEADER & FIL D'ARIANE */}
        <FilAriane
            etapes={[{ label: "Atlas", to: "/atlas" }, { label: "Le Bœuf", to: "/atlas/boeuf" }, { label: "L'Arrière", to: "/atlas/boeuf/arriere" }, { label: "Cuisse et hanche", to: "/atlas/boeuf/arriere/cuisse" }, { label: partie.nomPartie, to: "#" }]}
        />

        {/* TITRE CENTRAL DYNAMIQUE */}
        <Box textAlign="center" mb="40px">
            <Heading as="h1" fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
                {partie.nomPartie}
            </Heading>
            <Text color="gray.700" fontSize="md" maxW="3xl" mx="auto">
                {partie.descriptionPartie}
            </Text>
            <Badge colorPalette="red" variant="solid" borderRadius="full" px={4} py={1} mt={4} fontSize="sm">
                {pieces.length} morceaux
            </Badge>
        </Box>

        {/* ORGANISATION MASTER-DETAIL */}
        <Flex direction={{ base: "column", lg: "row" }} gap={12} align="start">
          
          {/* COLONNE GAUCHE : LA PIÈCE MAÎTRESSE */}
          <Box flex="1" position={{ lg: "sticky" }} top="20px">
             <Heading size="md" color="brand.brun" mb={4} textTransform="uppercase" letterSpacing="wider">
                Vue d'ensemble
             </Heading>
             <Box bg="white" borderRadius="2xl" overflow="hidden" shadow="2xl" border="4px solid white">
                <ImageAvecSecours 
                    src={getImageUrl(`parties/${partie.imagePartie}`)} 
                    alt={partie.nomPartie}
                />
             </Box>
          </Box>

          {/* COLONNE DROITE : GRILLE DES MORCEAUX */}
          <Box flex="1.5">
            <Heading size="md" color="brand.brun" mb={6} textTransform="uppercase" letterSpacing="wider">
                Détail des morceaux
            </Heading>
            
            {pieces.length === 0 ? (
                <Text color="gray.500" fontStyle="italic">Aucun morceau enregistré pour cette zone.</Text>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
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