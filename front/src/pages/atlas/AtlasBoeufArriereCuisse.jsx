import React from "react";
import { Box, Container, Heading, Text, Button, VStack, Flex, Image, Tooltip, Breadcrumb } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const AtlasBoeufArriereCuisse = () => {
  const navigate = useNavigate();

  const imageUrl = `${import.meta.env.VITE_API_URL.replace('/api', '')}/uploads/parties/boeuf_arriere_cuisse.png`;

  const sousParties = [
    { 
        id: 10, 
        nom: "Rumsteck", 
        contenu: "Cœur, Aiguillette...", 
        top: "38%", left: "65%",
        color: "brand.brun"
    },
    { 
        id: "semelle", 
        nom: "Semelle", 
        contenu: "Gîte à la noix, Rond de gîte...",
        top: "20%", left: "55%", 
        color: "orange.600" 
    },
    { 
        id: "tende", 
        nom: "Tende de tranche", 
        contenu: "Cœur, Dessus, Poire, Merlan...", 
        top: "26%", left: "60%", 
        color: "brand.rouge" 
    },
    { 
        id: "tranche", 
        nom: "Tranche", 
        contenu: "Plat, Mouvant, Rond...", 
        top: "30%", left: "50%", 
        color: "brand.brun" 
    },
    { 
        id: "jarret", 
        nom: "Jarret arrière", 
        contenu: "Avec ou sans os...", 
        top: "15%", left: "50%", 
        color: "orange.600" 
    }
  ];

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
                    <Breadcrumb.Item><Breadcrumb.CurrentLink color="brand.rouge" fontWeight="medium">Cuisse & Hanche</Breadcrumb.CurrentLink></Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
            <Button 
                as={RouterLink} to="/atlas/boeuf/arriere" variant="outline" borderColor="brand.brun" 
                color="brand.brun" borderRadius="full" bg="white" leftIcon={<FiArrowLeft />}
                _hover={{ bg: "brand.brun", color: "white" }} size="md" px={8} fontSize="sm"
            >
                Retour à l'Arrière
            </Button>
        </VStack>

        <Box textAlign="center" mb="40px">
            <Heading fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
                La Cuisse & Hanche
            </Heading>
            <Text color="brand.gris" fontSize="md">
                Sélectionnez une sous-partie pour voir ses morceaux au détail.
            </Text>
        </Box>

        {/* IMAGE GLOBALE + PASTILLES */}
        <Flex justify="center" align="center" mb={10}>
            <Box position="relative" w={{ base: "350px", md: "700px", lg: "800px" }}>
                
                {/* L'image de fond (La cuisse entière) */}
                <Image 
                    src={imageUrl} 
                    alt="Cuisse de Bœuf"
                    w="100%"
                    display="block"
                />

                {/* Boucle pour afficher les 5 pastilles */}
                {sousParties.map((partie) => (
                    <Tooltip.Root key={partie.id} positioning={{ placement: "top", offset: { mainAxis: 10 } }} openDelay={0} closeDelay={0}>
                        <Tooltip.Trigger asChild>
                            
                            {/* LA PASTILLE CLIQUEABLE */}
                            <Box
                                position="absolute"
                                top={partie.top}
                                left={partie.left}
                                transform="translate(-50%, -50%)"
                                w="24px"
                                h="24px"
                                bg={partie.color}
                                borderRadius="full"
                                border="3px solid white"
                                cursor="pointer"
                                boxShadow="0 0 10px rgba(0,0,0,0.3)"
                                onClick={() => navigate(`/atlas/boeuf/arriere/cuisse/${partie.id}`)}
                                transition="all 0.2s ease"
                                _hover={{
                                    transform: "translate(-50%, -50%) scale(1.3)",
                                    boxShadow: "0 0 15px rgba(0,0,0,0.5)"
                                }}
                            >
                                {/* Petit point intérieur */}
                                <Box w="6px" h="6px" bg="white" borderRadius="full" position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" />
                            </Box>

                        </Tooltip.Trigger>
                        
                        {/* LE CONTENU DU TOOLTIP */}
                        <Tooltip.Positioner>
                            <Tooltip.Content bg={partie.color} color="white" px={4} py={3} borderRadius="md" fontSize="sm">
                                <Tooltip.Arrow css={{ "--arrow-background": `var(--chakra-colors-${partie.color.replace('.', '-')})` }} />
                                <Text fontWeight="bold" fontSize="md" mb={1}>{partie.nom}</Text>
                                <Text>{partie.contenu}</Text>
                            </Tooltip.Content>
                        </Tooltip.Positioner>
                    </Tooltip.Root>
                ))}

            </Box>
        </Flex>

      </Container>
    </Box>
  );
};

export default AtlasBoeufArriereCuisse;