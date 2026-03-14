import React, { useState, useEffect } from "react";
import { Box, Container, Button, VStack, Spinner, Flex } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi"; 

import InteractiveDiagram from "../../components/atlas/InteractiveDiagram"; 
import AtlasDetails from "../../components/atlas/AtlasDetails";
import { getAllPieces } from "../../services/PiecesService"; 

const AtlasBoeufAvantCaparacon = () => {
  const [selectedPiece, setSelectedPiece] = useState(null);
  // On stockera nos pièces fusionnées (Config Visuelle + Données BDD)
  const [visiblePieces, setVisiblePieces] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const currentFace = "unique"; 
  const setCurrentFace = () => {}; 

  // --- CONFIGURATION VISUELLE ---
  const piecesConfig = [
    { 
      nomBdd: "Gros Bout de Poitrine", 
      face: "unique", 
      top: "50%",  
      left: "35%", 
      recetteUrl: "/recettes/gros-bout-poitrine" 
    },
    { 
      nomBdd: "Milieu de Poitrine", 
      face: "unique", 
      top: "50%", 
      left: "65%", 
      recetteUrl: "/recettes/milieu-poitrine" 
    }
  ];

  useEffect(() => {
    const fetchPiecesData = async () => {
      try {
        setLoading(true);
        const response = await getAllPieces();
        const piecesFromDB = response.data;
        const mergedPieces = piecesConfig.map(config => {
          const dbData = piecesFromDB.find(p => p.nomPiece === config.nomBdd);
          
          if (dbData) {
            return {
              ...config,
              ...dbData 
            };
          }
          return config; // Sécurité si la pièce n'est pas encore dans la BDD
        });

        setVisiblePieces(mergedPieces);
      } catch (error) {
        console.error("Erreur lors de la récupération des pièces :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPiecesData();
  }, []);

  // Fonction pour gérer l'URL de l'image (si besoin pour AtlasDetails)
  const getImageUrl = (imagePath) => {
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    return `${baseUrl}/uploads/${imagePath}`;
  };

  const currentBackgroundImage = "boeuf_avant_caparacon.png";

  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt="140px" pb="40px">
      <Container maxW="1360px" px={6}>
        
        <VStack align="start" spacing="12px" mb={10}>
            <Button 
                as={RouterLink} to="/atlas/boeuf/avant"
                variant="outline" borderColor="brand.brun" 
                color="brand.brun" borderRadius="full" bg="white"
                _hover={{ bg: "brand.brun", color: "white" }} size="md" px={8} fontSize="sm"
            >
                <FiArrowLeft style={{ marginRight: "8px" }} /> Retour
            </Button>
        </VStack>

        {loading ? (
             <Flex justify="center" align="center" h="400px"><Spinner size="xl" color="brand.rouge" /></Flex>
        ) : (
            <Flex direction={{ base: "column", lg: "row" }} gap={10} justify="center" align="start">
                
                {/* 1. SCHÉMA */}
                <InteractiveDiagram 
                    currentFace={currentFace}
                    setCurrentFace={setCurrentFace}
                    currentBackgroundImage={getImageUrl(`parties/${currentBackgroundImage}`)}
                    visiblePieces={visiblePieces}
                    selectedPiece={selectedPiece}
                    onSelectPiece={setSelectedPiece}
                    enableSwitch={false}
                    customHeight={{ base: "400px", lg: "550px" }} 
                    imageScale={1.3} 
                />

                {/* 2. DÉTAILS */}
                <Box w={{ base: "100%", lg: "400px" }}>
                    <AtlasDetails 
                        selectedPiece={selectedPiece} // selectedPiece contient maintenant la data de la BDD !
                        getImageUrl={getImageUrl}
                    />
                </Box>

            </Flex>
        )}
      </Container>
    </Box>
  );
};

export default AtlasBoeufAvantCaparacon;