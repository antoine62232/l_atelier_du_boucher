import React from "react";
import { Box, Container, Heading, Text, Button, VStack, Flex, Image, Tooltip, Breadcrumb } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import imgEpaule from "../../assets/boeuf_avant_epaule.png";
import imgCollier from "../../assets/boeuf_avant_collier.png";
import imgCaparacon from "../../assets/boeuf_avant_caparacon.png";

const AtlasBoeufAvant = () => {
  const navigate = useNavigate();

  const handleZoneClick = (partie) => {
    navigate(`/atlas/boeuf/avant/${partie}`);
  };

  const interactiveStyle = {
    transition: "transform 0.3s ease",
    cursor: "pointer",
    _hover: {
        transform: "scale(1.05)",
        zIndex: 100, 
        filter: "drop-shadow(0px 8px 15px rgba(0,0,0,0.3))"
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
                        <Breadcrumb.Link as={RouterLink} to="/atlas/boeuf">Le Bœuf</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.CurrentLink color="brand.rouge" fontWeight="medium">
                            L'Avant (CAPA)
                        </Breadcrumb.CurrentLink>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
            <Button 
                as={RouterLink} to="/atlas/boeuf" variant="outline" borderColor="brand.brun" 
                color="brand.brun" borderRadius="full" bg="white" leftIcon={<FiArrowLeft />}
                _hover={{ bg: "brand.brun", color: "white" }} size="md" px={8} fontSize="sm" fontWeight="normal"
            >
                Retour à la carcasse
            </Button>
        </VStack>

        <Box textAlign="center" mb="40px">
            <Heading fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
                L'Avant : Détail des parties
            </Heading>
            <Text color="brand.gris" fontSize="md">
                Survolez les zones pour identifier les parties .
            </Text>
        </Box>

        {/* LES 3 PARTIES */}
        <Flex justify="center" align="center" mb={10}>
            
            <Box 
            position="relative" 
            w="450px" 
            h="650px"
            top="-100px"
            left="-60px"
            >
                
                {/* 1. L'ÉPAULE -> BAS GAUCHE */}
                <Tooltip.Root positioning={{ placement: "left-end", offset: { mainAxis: 10 } }} openDelay={0} closeDelay={0}>
                    <Tooltip.Trigger asChild>
                        <Image 
                            src={imgEpaule} 
                            alt="Épaule"
                            onClick={() => handleZoneClick("epaule")}
                            {...interactiveStyle}
                            
                            position="absolute"
                            zIndex={1} 
                            
                            // RÉGLAGES POSITION
                            bottom="15%"       
                            right="16%"
                            w="55%"           
                        />
                    </Tooltip.Trigger>
                    <Tooltip.Positioner>
                        <Tooltip.Content bg="brand.rouge" color="white" px={4} py={3} borderRadius="md" fontSize="sm">
                            <Tooltip.Arrow css={{ "--arrow-background": "var(--chakra-colors-brand-rouge)" }} />
                            <Text fontWeight="bold" fontSize="md" mb={1}>L'Épaule</Text>
                            <Text>Macreuse, Jumeau, Paleron...</Text>
                        </Tooltip.Content>
                    </Tooltip.Positioner>
                </Tooltip.Root>


                {/* 2. LE COLLIER -> BAS DROITE */}
                <Tooltip.Root positioning={{ placement: "right-end", offset: { mainAxis: 10 } }} openDelay={0} closeDelay={0}>
                    <Tooltip.Trigger asChild>
                        <Image 
                            src={imgCollier} 
                            alt="Collier"
                            onClick={() => handleZoneClick("collier")}
                            {...interactiveStyle}
                            
                            position="absolute"
                            zIndex={2} 
                            
                            // RÉGLAGES POSITION
                            bottom="0"   
                            right="8%"
                            w="55%"       
                        />
                    </Tooltip.Trigger>
                    <Tooltip.Positioner>
                        <Tooltip.Content bg="brand.brun" color="white" px={4} py={3} borderRadius="md" fontSize="sm">
                            <Tooltip.Arrow css={{ "--arrow-background": "var(--chakra-colors-brand-brun)" }} />
                            <Text fontWeight="bold" fontSize="md" mb={1}>Collier & Basses Côtes</Text>
                            <Text>Morceaux à mijoter ou braiser</Text>
                        </Tooltip.Content>
                    </Tooltip.Positioner>
                </Tooltip.Root>


                {/* 3. LE CAPARAÇON -> HAUT */}
                <Tooltip.Root positioning={{ placement: "top", offset: { mainAxis: 10 } }} openDelay={0} closeDelay={0}>
                    <Tooltip.Trigger asChild>
                        <Image 
                            src={imgCaparacon} 
                            alt="Caparaçon"
                            onClick={() => handleZoneClick("caparacon")}
                            {...interactiveStyle}
                            
                            position="absolute"
                            zIndex={3} 

                            _hover={{
                                transform: "translateX(-50%) scale(1.05)", 
                                zIndex: 100, 
                                filter: "drop-shadow(0px 8px 15px rgba(0,0,0,0.3))"
                            }}
                            
                            // RÉGLAGES POSITION
                            bottom="17%"
                            left="65.5%"
                            transform="translateX(-50%)" 
                            w="60%" 
                        />
                    </Tooltip.Trigger>
                    <Tooltip.Positioner>
                        <Tooltip.Content bg="orange.600" color="white" px={4} py={3} borderRadius="md" fontSize="sm">
                            <Tooltip.Arrow css={{ "--arrow-background": "var(--chakra-colors-orange-600)" }} />
                            <Text fontWeight="bold" fontSize="md" mb={1}>Le Caparaçon</Text>
                            <Text>Plat de côtes, Flanchet...</Text>
                        </Tooltip.Content>
                    </Tooltip.Positioner>
                </Tooltip.Root>

            </Box>
        </Flex>

      </Container>
    </Box>
  );
};

export default AtlasBoeufAvant;