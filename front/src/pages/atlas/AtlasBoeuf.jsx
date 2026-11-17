import React, { Suspense, lazy } from "react";
import FilAriane from "../../components/atlas/FilAriane";
import { Box, Container, Heading, Text, Flex, Image, Tooltip, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import boeufAvantCut from "../../assets/boeuf_avant_cut.png";
import boeufArriereCut from "../../assets/boeuf_arriere_cut.png";

const Carcasse3D = lazy(() => import("../../components/atlas/Carcasse3D"));


const AtlasBoeuf = () => {
  const navigate = useNavigate();

  const handleZoneClick = (zone) => {
    navigate(`/atlas/boeuf/${zone}`);
  };

  const commonStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    w: "100%",
    h: "auto",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    cursor: "pointer",
    _hover: {
        transform: "scale(1.08)",
        zIndex: 10,
        filter: "drop-shadow(0px 15px 25px rgba(0,0,0,0.3)) brightness(1.05)"
    }
  };

  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt={{ base: "120px", md: "140px" }} pb="40px">
      <Container maxW="1360px" px={{ base: 4, md: 6 }}>
        
        {/* En-tête */}
        <FilAriane
            etapes={[{ label: "Atlas", to: "/atlas" }, { label: "Le Bœuf", to: "#" }]}
        />

        <Box textAlign="center" mb={{ base: 6, md: 10 }}>
            <Heading as="h1" fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
                Le Bœuf : Anatomie & Découpe
            </Heading>
            <Text color="brand.gris" fontSize="md" maxW="640px" mx="auto">
                Faites pivoter la demi-carcasse sur elle-même pour observer la face de fente et l'extérieur.
            </Text>
        </Box>

        <Box maxW="900px" mx="auto" mb={{ base: 12, md: 16 }}>
            <Suspense
                fallback={
                    <Flex h={{ base: "68vh", md: "620px" }} minH="420px" align="center" justify="center" bg="brand.creme" borderRadius="2xl">
                        <Spinner size="lg" color="brand.rouge" aria-label="Chargement du modèle 3D" />
                    </Flex>
                }
            >
                <Carcasse3D />
            </Suspense>
        </Box>

        <Box textAlign="center" mb={{ base: 6, md: 10 }}>
            <Heading as="h2" fontFamily="title" color="brand.rouge" fontSize={{ base: "2xl", md: "3xl" }} mb={3}>
                Choisissez une partie
            </Heading>
            <Text color="brand.gris" fontSize="md">
                Touchez l'<strong>Arrière</strong> ou l'<strong>Avant</strong> de la carcasse pour explorer ses pièces.
            </Text>
        </Box>

        {/* 🥩 ZONE INTERACTIVE 🥩 */}
        <Flex justify="center" mb={10}>
            
            <Box position="relative" w="350px" h="600px">
                
                {/* 1. ARRIÈRE (Le HAUT) -> Tooltip à DROITE */}
                <Tooltip.Root 
                    positioning={{ placement: "right-start", flip: false, offset: { mainAxis: 10, crossAxis: 120 } }} 
                    openDelay={0} 
                    closeDelay={0}
                >
                    <Tooltip.Trigger asChild>
                        <Image 
                            src={boeufArriereCut}
                            alt="Arrière Boeuf"
                            onClick={() => handleZoneClick("arriere")}
                            {...commonStyle}
                            clipPath="inset(0 0 20% 0)" 
                        />
                    </Tooltip.Trigger>
                    
                    <Tooltip.Positioner>
                        <Tooltip.Content bg="brand.rouge" color="white" px={4} py={3} borderRadius="md" fontSize="sm">
                            <Tooltip.Arrow css={{ "--arrow-background": "var(--chakra-colors-brand-rouge)" }} />
                            <Text fontWeight="bold" fontSize="md" mb={1}>L'Arrière (ART 8)</Text>
                            <Text>Morceaux nobles à rôtir ou griller<br/>(Entrecôte, Rumsteck...)</Text>
                        </Tooltip.Content>
                    </Tooltip.Positioner>
                </Tooltip.Root>


                 {/* 2. AVANT (Le BAS) */}
                 <Tooltip.Root 

                    positioning={{ placement: "left-end", flip: false, offset: { mainAxis: 10, crossAxis: -100 } }} 
                    openDelay={0} 
                    closeDelay={0}
                >
                    <Tooltip.Trigger asChild>
                        <Image 
                            src={boeufAvantCut}
                            alt="Avant Boeuf"
                            onClick={() => handleZoneClick("avant")}
                            {...commonStyle}
                            clipPath="inset(40% 0 0 0)"
                        />
                    </Tooltip.Trigger>

                    <Tooltip.Positioner>
                        <Tooltip.Content bg="brand.brun" color="white" px={4} py={3} borderRadius="md" fontSize="sm">
                            <Tooltip.Arrow css={{ "--arrow-background": "var(--chakra-colors-brand-brun)" }} />
                            <Text fontWeight="bold" fontSize="md" mb={1}>L'Avant (CAPA)</Text>
                            <Text>Morceaux savoureux à mijoter<br/>(Collier, Épaule...)</Text>
                        </Tooltip.Content>
                    </Tooltip.Positioner>
                </Tooltip.Root>

            </Box>
        </Flex>

      </Container>
    </Box>
  );
};

export default AtlasBoeuf;