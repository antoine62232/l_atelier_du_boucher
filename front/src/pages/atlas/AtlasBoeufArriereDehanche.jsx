import React, { useState, useEffect } from "react";
import { Box, Container, Button, VStack, Spinner, Flex, Breadcrumb } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi"; 

import InteractiveDiagram from "../../components/atlas/InteractiveDiagram"; 
import AtlasDetails from "../../components/atlas/AtlasDetails";
import { getAllPieces } from "../../services/PiecesService"; 

const AtlasBoeufArriereDehanche = () => {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [visiblePieces, setVisiblePieces] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const currentFace = "unique"; 
  const setCurrentFace = () => {}; 

  // --- CONFIGURATION VISUELLE DU DÉHANCHÉ ---
  const piecesConfig = [
    { 
      nomBdd: "Filet", 
      face: "unique", 
      top: "55%",   // À ajuster selon l'image
      left: "60%" 
    },
    { 
      nomBdd: "Faux-filet", 
      face: "unique", 
      top: "45%",   // À ajuster
      left: "65%" 
    },
    { 
      nomBdd: "Milieu de train de côtes", 
      face: "unique", 
      top: "65%",   // À ajuster
      left: "65%" 
    }
  ];

  useEffect(() => {
    // Remonter en haut de page au chargement
    window.scrollTo(0, 0);

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

  const currentBackgroundImage = "boeuf_arriere_dehanche.png";

  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt="140px" pb="40px">
      <Container maxW="1360px" px={6}>
        
        {/* HEADER & FIL D'ARIANE */}
        <VStack align="start" spacing="12px" mb={10}>
             <Breadcrumb.Root color="gray.500" fontSize="sm">
                <Breadcrumb.List>
                    <Breadcrumb.Item><Breadcrumb.Link as={RouterLink} to="/atlas/boeuf">Le Bœuf</Breadcrumb.Link></Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item><Breadcrumb.Link as={RouterLink} to="/atlas/boeuf/arriere">L'Arrière</Breadcrumb.Link></Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item><Breadcrumb.CurrentLink color="brand.rouge" fontWeight="medium">Déhanché & Train de Côtes</Breadcrumb.CurrentLink></Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>

            <Button 
                as={RouterLink} to="/atlas/boeuf/arriere"
                variant="outline" borderColor="brand.brun" 
                color="brand.brun" borderRadius="full" bg="white" leftIcon={<FiArrowLeft />}
                _hover={{ bg: "brand.brun", color: "white" }} size="md" px={8} fontSize="sm"
            >
                Retour à l'Arrière
            </Button>
        </VStack>

        {loading ? (
             <Flex justify="center" align="center" h="400px"><Spinner size="xl" color="brand.rouge" /></Flex>
        ) : (
            <Flex direction={{ base: "column", lg: "row" }} gap={10} justify="center" align="start">
                
                {/* 1. SCHÉMA INTERACTIF */}
                <InteractiveDiagram 
                    currentFace={currentFace}
                    setCurrentFace={setCurrentFace}
                    currentBackgroundImage={getImageUrl(`parties/${currentBackgroundImage}`)}
                    visiblePieces={visiblePieces}
                    selectedPiece={selectedPiece}
                    onSelectPiece={setSelectedPiece}
                    enableSwitch={false} 
                    customHeight={{ base: "400px", lg: "500px" }}
                    
                    /* PARAMÈTRES DE RECADRAGE À AJUSTER */
                    imageScale={2.4} 
                    imageTranslateX="-25%" 
                    imageTranslateY="-10%" 
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

export default AtlasBoeufArriereDehanche;