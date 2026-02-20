import React from "react";
import { Box, Container, Heading, Text, Button, VStack, Flex, Image, Tooltip, Breadcrumb } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const AtlasBoeufArriere = () => {
  const navigate = useNavigate();
  const getImageUrl = (imageName) => {
      const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
      return `${baseUrl}/uploads/parties/${imageName}`;
  };

  const handleZoneClick = (route) => {
    navigate(`/atlas/boeuf/arriere/${route}`);
  };

  const interactiveStyle = {
    transition: "transform 0.3s ease",
    cursor: "pointer",
    position: "absolute",
    _hover: {
        transform: "scale(1.05)",
        zIndex: 100,
        filter: "drop-shadow(0px 8px 15px rgba(0,0,0,0.3))"
    }
  };

  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt="140px" pb="40px">
      <Container maxW="1360px" px={6}>
        
        {/* HEADER */}
        <VStack align="start" spacing="12px" mb={10}>
             <Breadcrumb.Root color="gray.500" fontSize="sm">
                <Breadcrumb.List>
                    <Breadcrumb.Item><Breadcrumb.Link as={RouterLink} to="/atlas/boeuf">Le Bœuf</Breadcrumb.Link></Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item><Breadcrumb.CurrentLink color="brand.rouge" fontWeight="medium">L'Arrière</Breadcrumb.CurrentLink></Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
            <Button 
                as={RouterLink} to="/atlas/boeuf" variant="outline" borderColor="brand.brun" 
                color="brand.brun" borderRadius="full" bg="white" leftIcon={<FiArrowLeft />}
                _hover={{ bg: "brand.brun", color: "white" }} size="md" px={8} fontSize="sm"
            >
                Retour à la carcasse
            </Button>
        </VStack>

        <Box textAlign="center" mb="40px">
            <Heading fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
                L'Arrière
            </Heading>
            <Text color="brand.gris" fontSize="md">
                Cliquez sur une partie pour voir le détail.
            </Text>
        </Box>

        {/* PUZZLE 3 PIÈCES (Images chargées depuis le Back) */}
        <Flex justify="center" align="center" mb={10}>
            <Box position="relative" w="600px" h="600px">
                
                {/* 1. DÉHANCHÉ */}
                <Tooltip.Root positioning={{ placement: "right", offset: { mainAxis: 10 } }} openDelay={0} closeDelay={0}>
                    <Tooltip.Trigger asChild>
                        <Image 
                            src={getImageUrl("boeuf_arriere_dehanche.png")} 
                            alt="Déhanché"
                            onClick={() => handleZoneClick("dehanche")} 
                            {...interactiveStyle}
                            zIndex={2} 
                            
                            clipPath="inset(38% 25% 29% 53%)"
                            top="6%"       
                            left="20%"
                            w="55%"           
                        />
                    </Tooltip.Trigger>
                    <Tooltip.Positioner>
                        <Tooltip.Content bg="brand.brun" color="white" px={4} py={3} borderRadius="md" fontSize="sm">
                            <Tooltip.Arrow css={{ "--arrow-background": "var(--chakra-colors-brand-brun)" }} />
                            <Text fontWeight="bold" fontSize="md" mb={1}>Déhanché & Train de Côtes</Text>
                            <Text>Aloyau, Faux-filet, Rumsteak...</Text>
                        </Tooltip.Content>
                    </Tooltip.Positioner>
                </Tooltip.Root>


                {/* 2. BAVETTES */}
                <Tooltip.Root positioning={{ placement: "left", offset: { mainAxis: 10 } }} openDelay={0} closeDelay={0}>
                    <Tooltip.Trigger asChild>
                        <Image 
                            src={getImageUrl("boeuf_arriere_bavettes.png")} 
                            alt="Bavettes"
                            onClick={() => handleZoneClick("bavettes")} 
                            {...interactiveStyle}
                            zIndex={3}
                            
                            clipPath="inset(29% 41% 45% 39%)"
                            top="5%"   
                            left="20%"
                            w="55%"       
                        />
                    </Tooltip.Trigger>
                    <Tooltip.Positioner>
                        <Tooltip.Content bg="orange.600" color="white" px={4} py={3} borderRadius="md" fontSize="sm">
                            <Tooltip.Arrow css={{ "--arrow-background": "var(--chakra-colors-orange-600)" }} />
                            <Text fontWeight="bold" fontSize="md" mb={1}>Jeu de Bavettes</Text>
                            <Text>Bavette d'Aloyau, Flanchet...</Text>
                        </Tooltip.Content>
                    </Tooltip.Positioner>
                </Tooltip.Root>


                {/* 3. CUISSE */}
                <Tooltip.Root positioning={{ placement: "right-start", offset: { mainAxis: 10 } }} openDelay={0} closeDelay={0}>
                    <Tooltip.Trigger asChild>
                        <Image 
                            src={getImageUrl("boeuf_arriere_cuisse.png")} 
                            alt="Cuisse"
                            onClick={() => handleZoneClick("cuisse")} 
                            {...interactiveStyle}
                            zIndex={1}
                            
                            clipPath="inset(6% 23% 58% 45%)"
                            top="5%"   
                            right="25%"
                            w="55%"    
                        />
                    </Tooltip.Trigger>
                    <Tooltip.Positioner>
                        <Tooltip.Content bg="brand.rouge" color="white" px={4} py={3} borderRadius="md" fontSize="sm">
                            <Tooltip.Arrow css={{ "--arrow-background": "var(--chakra-colors-brand-rouge)" }} />
                            <Text fontWeight="bold" fontSize="md" mb={1}>Cuisse & Hanche</Text>
                            <Text>Tende de tranche, Gîte, Rond...</Text>
                        </Tooltip.Content>
                    </Tooltip.Positioner>
                </Tooltip.Root>

            </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default AtlasBoeufArriere;