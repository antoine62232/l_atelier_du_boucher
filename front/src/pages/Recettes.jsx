import React, { useState, useEffect } from "react";
import { Box, Container, Heading, Text, Flex, SimpleGrid, Spinner, Center, Button } from "@chakra-ui/react";
import { getAllRecettes } from "../services/RecettesService";
import RecetteCard from "../components/recettes/RecetteCard";
import Pagination from "../components/common/Pagination";
import { useSearchParams, useNavigate } from "react-router-dom";

const Recettes = () => {
  const [recettes, setRecettes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // États pour les filtres
  const [activeFilter, setActiveFilter] = useState("Tout");
  const filters = ["Tout", "Facile", "Moyen", "Difficile"];

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pieceIdCible = searchParams.get("pieceId");

  useEffect(() => {
    const fetchRecettes = async () => {
      try {
        const response = await getAllRecettes();
        setRecettes(response.data);
      } catch (error) {
        console.error("Erreur récupération recettes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecettes();
  }, []);

  // 1. On filtre les recettes
  const filteredRecettes = recettes.filter(recette => {
    if (pieceIdCible && recette.pieceId.toString() !== pieceIdCible) {
        return false;
    }

    // Filtre par difficulté
    if (activeFilter === "Tout") return true;
    if (activeFilter === "Facile" && recette.difficulte === 1) return true;
    if (activeFilter === "Moyen" && recette.difficulte === 2) return true;
    if (activeFilter === "Difficile" && recette.difficulte === 3) return true;
    return false;
  });

  // 2. On découpe le tableau filtré pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecettes = filteredRecettes.slice(indexOfFirstItem, indexOfLastItem);

  // Fonction pour changer de filtre (remet la page à 1)
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1); 
  };

  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt="140px" pb="84px">
      <Container maxW="1360px" px={6}>
        
        {/* EN-TÊTE */}
        <Box textAlign="center" mb={10}>
            <Heading fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
                Le Carnet de Recettes
            </Heading>
            <Text color="brand.gris" fontSize="md" maxW="600px" mx="auto">
                De l'étal à l'assiette. Découvrez nos recettes traditionnelles pour sublimer vos pièces de viande.
            </Text>
        </Box>

        {/* FILTRES */}
        <Flex justify="center" wrap="wrap" gap={4} mb={12}>
            {filters.map((filter) => (
                <Button
                    key={filter}
                    onClick={() => handleFilterClick(filter)}
                    bg={activeFilter === filter ? "brand.rouge" : "transparent"}
                    color={activeFilter === filter ? "white" : "brand.brun"}
                    border={activeFilter === filter ? "none" : "1px solid"}
                    borderColor="brand.brun"
                    borderRadius="full"
                    px={6}
                    _hover={{ bg: activeFilter === filter ? "brand.rouge" : "brand.brun", color: "white" }}
                >
                    {filter}
                </Button>
            ))}
        </Flex>

        {/* CONTENU : GRILLE OU CHARGEMENT */}
        {loading ? (
            <Center h="300px"><Spinner size="xl" color="brand.rouge" /></Center>
        ) : currentRecettes.length > 0 ? (
            <>
                {/* La Grille des recettes de la page actuelle */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
                    {currentRecettes.map((recette) => (
                        <RecetteCard key={recette.idRecette} recette={recette} />
                    ))}
                </SimpleGrid>

                {/* La Pagination isolée */}
                <Pagination 
                    currentPage={currentPage} 
                    totalItems={filteredRecettes.length} 
                    itemsPerPage={itemsPerPage} 
                    onPageChange={setCurrentPage} 
                />
            </>
        ) : (
            <Center h="200px">
                <Text color="gray.500" fontStyle="italic">Aucune recette trouvée pour ce filtre.</Text>
            </Center>
        )}

      </Container>
    </Box>
  );
};

export default Recettes;