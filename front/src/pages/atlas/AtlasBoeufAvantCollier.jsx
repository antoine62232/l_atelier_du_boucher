import React, { useState, useEffect } from "react";
import { Box, Container, Button, VStack, Spinner, Flex } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi"; 

import InteractiveDiagram from "../../components/atlas/InteractiveDiagram"; 
import AtlasDetails from "../../components/atlas/AtlasDetails";
// 👇 1. On importe notre service
import { getAllPieces } from "../../services/PiecesService"; 

const AtlasBoeufAvantCollier = () => {
  const [selectedPiece, setSelectedPiece] = useState(null);
  // On remplace piecesData par visiblePieces pour stocker les données fusionnées
  const [visiblePieces, setVisiblePieces] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Ici, on utilise une seule face fixe
  const currentFace = "unique"; 
  const setCurrentFace = () => {}; 

  // --- CONFIGURATION VISUELLE (Top, Left, Nom) ---
  const piecesConfig = [
    { 
      nomBdd: "Collier", 
      face: "unique", 
      top: "60%", 
      left: "40%", 
      recetteUrl: "/recettes/collier" 
    },
    { 
      nomBdd: "Basses Côtes", 
      face: "unique", 
      top: "30%", 
      left: "70%", 
      recetteUrl: "/recettes/basses-cotes" 
    }
  ];

  // 👇 2. Le useEffect pour appeler l'API et fusionner les données
  useEffect(() => {
    const fetchPiecesData = async () => {
      try {
        setLoading(true);
        const response = await getAllPieces();
        const piecesFromDB = response.data;

        // On fusionne la config avec les données de la BDD
        const mergedPieces = piecesConfig.map(config => {
          const dbData = piecesFromDB.find(p => p.nomPiece === config.nomBdd);
          
          if (dbData) {
            return {
              ...config,       
              ...dbData        
            };
          }
          return config; 
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

  const getImageUrl = (imagePath) => {
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    return `${baseUrl}/uploads/${imagePath}`;
  };

  const currentBackgroundImage = "boeuf_avant_collier.png";

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
                
                {/* 1. SCHÉMA (Sans les boutons) */}
                <InteractiveDiagram 
                    currentFace={currentFace}
                    setCurrentFace={setCurrentFace}
                    currentBackgroundImage={getImageUrl(`parties/${currentBackgroundImage}`)}
                    visiblePieces={visiblePieces} // 👈 On passe bien nos pièces fusionnées
                    selectedPiece={selectedPiece}
                    onSelectPiece={setSelectedPiece}
                    enableSwitch={false} 
                    customHeight={{ base: "400px", lg: "500px" }}
                    imageScale={1.4} 
                />

                {/* 2. DÉTAILS */}
                <Box w={{ base: "100%", lg: "400px" }}>
                    <AtlasDetails 
                        selectedPiece={selectedPiece}
                        getImageUrl={getImageUrl}
                    />
                </Box>

            </Flex>
        )}
      </Container>
    </Box>
  );
};

export default AtlasBoeufAvantCollier;