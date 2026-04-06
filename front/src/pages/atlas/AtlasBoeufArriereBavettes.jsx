import React, { useState, useEffect } from "react";
import { Box, Container, Button, VStack, Spinner, Flex } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi"; 

import InteractiveDiagram from "../../components/atlas/InteractiveDiagram"; 
import AtlasDetails from "../../components/atlas/AtlasDetails";
import { getAllPieces } from "../../services/PiecesService"; 

const AtlasBoeufArriereBavettes = () => {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [visiblePieces, setVisiblePieces] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Vue fixe (pas de switch intérieur/extérieur)
  const currentFace = "unique"; 
  const setCurrentFace = () => {}; 

  // --- CONFIGURATION VISUELLE DES BAVETTES ---
  // J'ai mis des pourcentages par défaut. Tu pourras ajuster `top` et `left` 
  // en fonction de ton image exacte pour que les pastilles tombent parfaitement sur les viandes.
  const piecesConfig = [
    { 
      nomBdd: "Bavette d'aloyau", 
      face: "unique", 
      top: "40%", 
      left: "50%"
    },
    { 
      nomBdd: "Bavette de flanchet", 
      face: "unique", 
      top: "50%", 
      left: "55%"
    }
  ];

  useEffect(() => {
    const fetchPiecesData = async () => {
      try {
        setLoading(true);
        const response = await getAllPieces();
        const piecesFromDB = response.data;

        // Fusion de la config visuelle avec les vraies données de la BDD
        const mergedPieces = piecesConfig.map(config => {
          // On cherche la pièce dans la base de données selon son nom exact
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

  // Fonction pour récupérer l'URL absolue des images (Vite.js)
  const getImageUrl = (imagePath) => {
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    return `${baseUrl}/uploads/${imagePath}`;
  };

  // Image de fond correspondant à la zone des bavettes
  const currentBackgroundImage = "boeuf_arriere_bavettes.png";

  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt="140px" pb="40px">
      <Container maxW="1360px" px={6}>
        
        {/* BOUTON RETOUR (Pointe vers l'Arrière au lieu de l'Avant) */}
        <VStack align="start" spacing="12px" mb={10}>
            <Button 
                as={RouterLink} to="/atlas/boeuf/arriere"
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
                
                {/* 1. SCHÉMA INTERACTIF DES BAVETTES */}
                <InteractiveDiagram 
                    currentFace={currentFace}
                    setCurrentFace={setCurrentFace}
                    currentBackgroundImage={getImageUrl(`parties/${currentBackgroundImage}`)}
                    visiblePieces={visiblePieces}
                    selectedPiece={selectedPiece}
                    onSelectPiece={setSelectedPiece}
                    enableSwitch={false} 
                    customHeight={{ base: "400px", lg: "500px" }}
                    imageScale={2.8} 
                    imageTranslateX="0%"
                    imageTranslateY="20%"
                />

                {/* 2. COMPOSANT DÉTAILS */}
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

export default AtlasBoeufArriereBavettes;