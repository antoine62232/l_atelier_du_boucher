import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { Box, Container, Button, VStack, Breadcrumb, Spinner, Flex } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi"; 

// IMPORT DES COMPOSANTS ENFANTS
import InteractiveDiagram from "../../components/atlas/InteractiveDiagram"; 
import AtlasDetails from "../../components/atlas/AtlasDetails";

const AtlasBoeufAvantEpaule = () => {
  // --- ÉTATS ---
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [piecesData, setPiecesData] = useState([]);
  const [partieInfo, setPartieInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Vue par défaut : Interne
  const [currentFace, setCurrentFace] = useState("interne"); 

  // --- CONFIGURATION ---
  const piecesConfig = [
    { nomBdd: "Paleron", face: "externe", top: "30%", left: "50%", recetteUrl: "/recettes/paleron" },
    { nomBdd: "Jarret Avant", face: "interne", top: "60%", left: "25%", recetteUrl: "/recettes/jarret" },
    { nomBdd: "Macreuse à Braiser", face: "interne", top: "40%", left: "35%", recetteUrl: "/recettes/macreuse-braisee" },
    { nomBdd: "Macreuse à Bifteck", face: "interne", top: "25%", left: "45%", recetteUrl: "/recettes/macreuse-bifteck" },
    { nomBdd: "Jumeau à Bifteck", face: "interne", top: "30%", left: "83%", recetteUrl: "/recettes/jumeau" },
    { nomBdd: "Dessus de Palette", face: "interne", top: "25%", left: "65%", recetteUrl: "/recettes/dessus-palette" }
  ];

  // --- LOGIQUE DONNÉES ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partieRes, piecesRes] = await Promise.all([
             api.get("/parties/1"),
             api.get("/pieces/partie/1")
        ]);

        const info = Array.isArray(partieRes.data) ? partieRes.data[0] : partieRes.data;
        setPartieInfo(info);
        
        const mergedData = piecesRes.data.map(pieceBdd => {
            const config = piecesConfig.find(c => c.nomBdd === pieceBdd.nomPiece);
            return config ? { ...pieceBdd, ...config } : null;
        }).filter(item => item !== null);

        setPiecesData(mergedData);
        setLoading(false);
      } catch (error) {
        console.error("Erreur chargement:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getImageUrl = (path) => {
      if (!path) return undefined;
      const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
      return `${baseUrl}/uploads/${path}`;
  };

  const visiblePieces = piecesData.filter(p => p.face === currentFace);

  const currentBackgroundImage = partieInfo ? (
      currentFace === "externe" 
      ? getImageUrl(`parties/${partieInfo.imagePartie}`) 
      : getImageUrl(`parties/${partieInfo.imagePartieInterieur}`)
  ) : undefined;

  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt="140px" pb="40px">
      <Container maxW="1360px" px={6}>
        
        {/* HEADER */}
        <VStack align="start" spacing="12px" mb={10}>
             <Breadcrumb.Root color="gray.500" fontSize="sm">
                <Breadcrumb.List>
                    <Breadcrumb.Item><Breadcrumb.Link as={RouterLink} to="/atlas/boeuf/avant">L'Avant</Breadcrumb.Link></Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item><Breadcrumb.CurrentLink color="brand.rouge" fontWeight="medium">L'Épaule</Breadcrumb.CurrentLink></Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
            <Button 
                as={RouterLink} to="/atlas/boeuf/avant" variant="outline" borderColor="brand.brun" 
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
                    currentBackgroundImage={currentBackgroundImage}
                    visiblePieces={visiblePieces}
                    selectedPiece={selectedPiece}
                    onSelectPiece={setSelectedPiece}
                />

                {/* 2. COMPOSANT DROITE : DÉTAILS */}
                <Box w={{ base: "100%", lg: "400px" }}>

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