import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { Box, Container, Button, VStack, Breadcrumb, Spinner, Flex } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi"; 

import InteractiveDiagram from "../../components/atlas/InteractiveDiagram"; 
import AtlasDetails from "../../components/atlas/AtlasDetails";

const AtlasBoeufAvantCollier = () => {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [piecesData, setPiecesData] = useState([]);
  const [partieInfo, setPartieInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Ici, on utilise une seule face fixe
  const currentFace = "unique"; 
  const setCurrentFace = () => {}; // Fonction vide car pas de changement

  // --- CONFIGURATION ---
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

  // --- CHARGEMENT ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partieRes, piecesRes] = await Promise.all([
             api.get("/parties/2"),
             api.get("/pieces/partie/2")
        ]);

        const info = Array.isArray(partieRes.data) ? partieRes.data[0] : partieRes.data;
        setPartieInfo(info);
        
        const mergedData = piecesRes.data.map(pieceBdd => {
            const config = piecesConfig.find(c => c.nomBdd === pieceBdd.nomPiece);
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

  // On prend toutes les pièces configurées en "unique"
  const visiblePieces = piecesData.filter(p => p.face === "unique");

  // On prend juste l'image principale
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
                    <Breadcrumb.Item><Breadcrumb.CurrentLink color="brand.rouge" fontWeight="medium">Collier & Basses Côtes</Breadcrumb.CurrentLink></Breadcrumb.Item>
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
                
                {/* 1. SCHÉMA (Sans les boutons) */}
                <InteractiveDiagram 
                    currentFace={currentFace}
                    setCurrentFace={setCurrentFace}
                    currentBackgroundImage={currentBackgroundImage}
                    visiblePieces={visiblePieces}
                    selectedPiece={selectedPiece}
                    onSelectPiece={setSelectedPiece}
                    enableSwitch={false} // 👈 On cache les boutons ici
                    customHeight={{ base: "400px", lg: "500px" }}
                    imageScale={1.4} // 👈 On zoome à 150%
                />

                {/* 2. DÉTAILS (Aligné directement car pas de boutons en face) */}
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