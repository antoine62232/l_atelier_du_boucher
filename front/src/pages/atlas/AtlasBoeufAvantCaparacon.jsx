import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { Box, Container, Button, VStack, Breadcrumb, Spinner, Flex } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi"; 

import InteractiveDiagram from "../../components/atlas/InteractiveDiagram"; 
import AtlasDetails from "../../components/atlas/AtlasDetails";

const AtlasBoeufAvantCaparacon = () => {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [piecesData, setPiecesData] = useState([]);
  const [partieInfo, setPartieInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const currentFace = "unique"; 
  const setCurrentFace = () => {}; 

  // --- CONFIGURATION ---
  const piecesConfig = [
    { 
      nomBdd: "Gros Bout de Poitrine", 
      face: "unique", 
      top: "50%",  // Tout en haut, la partie la plus épaisse
      left: "35%", // Légèrement à gauche (côté charnu)
      recetteUrl: "/recettes/gros-bout-poitrine" 
    },
    { 
      nomBdd: "Milieu de Poitrine", 
      face: "unique", 
      top: "50%",  // Juste en dessous du Gros Bout
      left: "20%", // Au centre de la masse de viande
      recetteUrl: "/recettes/milieu-poitrine" 
    },
    { 
      nomBdd: "Tendron", 
      face: "unique", 
      top: "70%",  // Au milieu verticalement
      left: "20%", // Tout au bord GAUCHE (c'est la partie cartilagineuse/sternum)
      recetteUrl: "/recettes/tendron" 
    },
    { 
      nomBdd: "Plat de Côtes Couvert", 
      face: "unique", 
      top: "25%",  // En haut
      left: "65%", // Sur la droite (là où on voit bien les os/côtes)
      recetteUrl: "/recettes/plat-cotes" 
    },
    { 
      nomBdd: "Plat de Côtes Découvert", 
      face: "unique", 
      top: "50%",  // Au milieu, sous le couvert
      left: "50%", // Sur la droite (partie plus maigre des côtes)
      recetteUrl: "/recettes/plat-cotes" 
    },
    { 
      nomBdd: "Flanchet", 
      face: "unique", 
      top: "80%",  // Tout en BAS (la pointe)
      left: "45%", // Au centre de la pointe
      recetteUrl: "/recettes/flanchet" 
    }
  ];

  // --- CHARGEMENT ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partieRes, piecesRes] = await Promise.all([
             api.get("/parties/3"), 
             api.get("/pieces/partie/3")
        ]);

        const info = Array.isArray(partieRes.data) ? partieRes.data[0] : partieRes.data;
        setPartieInfo(info);
        
        const mergedData = piecesRes.data.map(pieceBdd => {
            const config = piecesConfig.find(c => c.nomBdd === pieceBdd.nomPiece);
            // Si pas de config, on place au centre
            return config ? { ...pieceBdd, ...config } : { ...pieceBdd, face: "unique", top: "50%", left: "50%" };
        });

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

  const visiblePieces = piecesData.filter(p => p.face === "unique");

  const currentBackgroundImage = partieInfo 
      ? getImageUrl(`parties/${partieInfo.imagePartie}`) 
      : undefined;

  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt="140px" pb="40px">
      <Container maxW="1360px" px={6}>
        
        {/* HEADER */}
        <VStack align="start" spacing="12px" mb={10}>
             <Breadcrumb.Root color="gray.500" fontSize="sm">
                <Breadcrumb.List>
                    <Breadcrumb.Item><Breadcrumb.Link as={RouterLink} to="/atlas/boeuf/avant">L'Avant</Breadcrumb.Link></Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item><Breadcrumb.CurrentLink color="brand.rouge" fontWeight="medium">Le Caparaçon</Breadcrumb.CurrentLink></Breadcrumb.Item>
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
                
                {/* 1. SCHÉMA */}
                <InteractiveDiagram 
                    currentFace={currentFace}
                    setCurrentFace={setCurrentFace}
                    currentBackgroundImage={currentBackgroundImage}
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

export default AtlasBoeufAvantCaparacon;