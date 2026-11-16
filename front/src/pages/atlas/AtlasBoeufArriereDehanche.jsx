import React, { useState, useEffect } from "react";
import FilAriane from "../../components/atlas/FilAriane";
import { Box, Container, Spinner, Flex } from "@chakra-ui/react";
 

import InteractiveDiagram from "../../components/atlas/InteractiveDiagram"; 
import AtlasDetails from "../../components/atlas/AtlasDetails";
import { getAllPieces } from "../../services/PiecesService"; 

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

const AtlasBoeufArriereDehanche = () => {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [visiblePieces, setVisiblePieces] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const currentFace = "unique"; 
  const setCurrentFace = () => {}; 


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
        <FilAriane
            etapes={[{ label: "Atlas", to: "/atlas" }, { label: "Le Bœuf", to: "/atlas/boeuf" }, { label: "L'Arrière", to: "/atlas/boeuf/arriere" }, { label: "Déhanché et train de côtes", to: "#" }]}
            titre="Déhanché et train de côtes"
        />

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