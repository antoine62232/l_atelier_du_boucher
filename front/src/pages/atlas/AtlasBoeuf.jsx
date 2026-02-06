import React from "react";
import { Box, Container, Heading, Text, Button, VStack, Flex, Image, Tooltip, Breadcrumb } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import boeufAvantCut from "../../assets/boeuf_avant_cut.png";
import boeufArriereCut from "../../assets/boeuf_arriere_cut.png";


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
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt="140px" pb="40px">
      <Container maxW="1360px" px={6}>
        
        {/* En-tête */}
        <VStack align="start" spacing="12px" mb={10}>
             <Breadcrumb.Root color="gray.500" fontSize="sm">
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link as={RouterLink} to="/">Accueil</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.Link as={RouterLink} to="/atlas">Atlas Anatomique</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.CurrentLink color="brand.rouge" fontWeight="medium">
                            Le Bœuf
                        </Breadcrumb.CurrentLink>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
            <Button 
                as={RouterLink} to="/atlas" variant="outline" borderColor="brand.brun" 
                color="brand.brun" borderRadius="full" bg="white" leftIcon={<FiArrowLeft />}
                _hover={{ bg: "brand.brun", color: "white" }} size="md" px={8} fontSize="sm" fontWeight="normal"
            >
                Retour au choix de l'animal
            </Button>
        </VStack>

        <Box textAlign="center" mb="40px">
            <Heading fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
                Le Bœuf : Anatomie & Découpe
            </Heading>
            <Text color="brand.gris" fontSize="md">
                Cliquez sur la partie <strong>Arrière</strong> ou <strong>Avant</strong> de la carcasse pour explorer les parties.
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