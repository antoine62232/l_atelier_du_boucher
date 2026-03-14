import React, { useState, useEffect } from "react";
import { Box, Container, Button, VStack, Spinner, Flex } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi"; 

import InteractiveDiagram from "../../components/atlas/InteractiveDiagram"; 
import AtlasDetails from "../../components/atlas/AtlasDetails";
import { getAllPieces } from "../../services/PiecesService";

const AtlasBoeufAvantEpaule = () => {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [allMergedPieces, setAllMergedPieces] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Vue par défaut : Interne
  const [currentFace, setCurrentFace] = useState("interne"); 

  // --- CONFIGURATION DE TOUTES LES PASTILLES ---
  const piecesConfig = [
    // --- Face Externe ---
    { nomBdd: "Paleron", face: "externe", top: "30%", left: "50%", recetteUrl: "/recettes/paleron" },
    
    // --- Face Interne ---
    { nomBdd: "Dessus de Palette", face: "interne", top: "20%", left: "45%", recetteUrl: "/recettes/dessus-palette" },
    { nomBdd: "Jarret Avant", face: "interne", top: "60%", left: "25%", recetteUrl: "/recettes/jarret" },
    { nomBdd: "Macreuse à Braiser", face: "interne", top: "40%", left: "35%", recetteUrl: "/recettes/macreuse-braiser" },
    { nomBdd: "Jumeau à pot-au-feu", face: "interne", top: "25%", left: "30%", recetteUrl: "/recettes/jumeau-pot-au-feu" },
    { nomBdd: "Macreuse à Bifteck", face: "interne", top: "50%", left: "45%", recetteUrl: "/recettes/macreuse-bifteck" },
    { nomBdd: "Jumeau à Bifteck", face: "interne", top: "35%", left: "50%", recetteUrl: "/recettes/jumeau-bifteck" }
  ];

  useEffect(() => {
    const fetchPiecesData = async () => {
      try {
        setLoading(true);
        const response = await getAllPieces();
        const piecesFromDB = response.data;

        // Fusion Config Visuelle + BDD (Insensible à la casse)
        const mergedPieces = piecesConfig.map(config => {
          const dbData = piecesFromDB.find(p => 
            p.nomPiece.toLowerCase().trim() === config.nomBdd.toLowerCase().trim()
          );
          
          if (dbData) {
            return { ...config, ...dbData };
          } else {
            console.warn(`⚠️ ERREUR DE LIAISON : La pièce "${config.nomBdd}" n'a pas été trouvée dans la base de données.`);
            return config;
          }
        });

        setAllMergedPieces(mergedPieces);
      } catch (error) {
        console.error("Erreur lors de la récupération des pièces :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPiecesData();
  }, []);

  // Filtre les pièces selon la face affichée
  const visiblePieces = allMergedPieces.filter(piece => piece.face === currentFace);

  const getImageUrl = (imagePath) => {
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    return `${baseUrl}/uploads/${imagePath}`;
  };

  const currentBackgroundImage = currentFace === "interne" 
    ? "boeuf_epaule_interieur.png" 
    : "boeuf_epaule_exterieur.png";

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
                
                {/* 1. COMPOSANT GAUCHE : SCHÉMA */}
                <InteractiveDiagram 
                    currentFace={currentFace}
                    setCurrentFace={setCurrentFace}
                    currentBackgroundImage={getImageUrl(`parties/${currentBackgroundImage}`)}
                    visiblePieces={visiblePieces}
                    selectedPiece={selectedPiece}
                    onSelectPiece={setSelectedPiece}
                    enableSwitch={true}
                    customHeight={{ base: "400px", lg: "550px" }}
                />

                {/* 2. COMPOSANT DROITE : DÉTAILS */}
                <Box w={{ base: "100%", lg: "400px" }}>
                    
                    {/* Espacement invisible pour compenser la hauteur du bouton Switch */}
                    <Box h={{ base: "0px", lg: "80px" }} w="100%" />

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

export default AtlasBoeufAvantEpaule;