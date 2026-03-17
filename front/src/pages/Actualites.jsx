import React, { useState, useEffect } from "react";
import { 
  Box, Container, Heading, Text, SimpleGrid, 
  Spinner, Center, VStack 
} from "@chakra-ui/react";
import { getAllActualites } from "../services/ActualitesService";
import ActualiteCard from "../components/actualites/ActualiteCard";

const Actualites = () => {
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActualites = async () => {
      try {
        const response = await getAllActualites();
        setActualites(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des actualités:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActualites();
  }, []);

  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt="140px" pb="84px">
      <Container maxW="1200px" px={6}>
        
        {/* EN-TÊTE (Harmonisé avec Quiz et Recettes) */}
        <Box textAlign="center" mb={12}>
            <Heading fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
                Le Coin des Actualités
            </Heading>
            <Text color="gray.600" fontSize="md" maxW="600px" mx="auto">
                Suivez les actualités de la filière, nos conseils de saison et la vie de l'Atelier du Boucher.
            </Text>
        </Box>

        {/* CONTENU */}
        {loading ? (
            <Center h="300px"><Spinner size="xl" color="brand.rouge" /></Center>
        ) : actualites.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
                {actualites.map((actu) => (
                    <ActualiteCard key={actu.idActualite} actualite={actu} />
                ))}
            </SimpleGrid>
        ) : (
            <Center h="200px">
                <Text color="gray.500" fontStyle="italic">Aucune actualité publiée pour le moment.</Text>
            </Center>
        )}

      </Container>
    </Box>
  );
};

export default Actualites;