import React, { useEffect, useRef } from "react";
import { Box, Heading, Text, Button, VStack, Flex, Image, Badge } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiInfo, FiArrowRight } from "react-icons/fi";
import { cheminFichePiece } from "../../data/atlasBoeuf";

const AtlasDetails = ({ selectedPiece, getImageUrl }) => {
    const refFiche = useRef(null);

    useEffect(() => {
        if (!selectedPiece || !refFiche.current) return;
        if (window.matchMedia("(max-width: 991px)").matches) {
            refFiche.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [selectedPiece]);

    return (
        <Box ref={refFiche} w="100%" bg="white" p={{ base: 5, md: 6 }} borderRadius="xl" boxShadow="carte" minH={{ base: "auto", lg: "400px" }} scrollMarginTop="110px" aria-live="polite">
            {selectedPiece ? (
                <VStack align="start" gap={4} animation="fadeIn 0.5s">
                    <Flex justify="space-between" w="100%" align="center" gap={3} wrap="wrap">
                        <Heading as="h2" size="lg" color="brand.rouge" fontFamily="title" lineHeight="1.2">
                            {selectedPiece.nomPiece}
                        </Heading>
                        <Badge colorPalette="orange" variant="subtle" fontSize="0.8em" px={2} py={1} borderRadius="md">
                            {selectedPiece.utilisation}
                        </Badge>
                    </Flex>

                    {/* Image de la pièce */}
                    <Box w="100%" borderRadius="lg" overflow="hidden" bg="gray.50" border="1px solid" borderColor="gray.100">
                        <Image 
                            src={getImageUrl(`pieces/${selectedPiece.imagePiece}`)} 
                            alt={selectedPiece.nomPiece} 
                            w="100%" h="200px" objectFit="contain" p={2}
                        />
                    </Box>
                    <Text fontSize="md" color="gray.600" lineHeight="1.6">
                        {selectedPiece.descriptionPiece}
                    </Text>
                    <Box w="100%" bg="orange.50" p={3} borderRadius="md" borderLeft="3px solid" borderColor="orange.400">
                        <Text fontSize="sm" color="orange.800" fontWeight="bold">Cuisson :</Text>
                        <Text fontSize="sm" color="orange.700">{selectedPiece.cuisson}</Text>
                    </Box>

                    <Box w="100%" h="1px" bg="gray.200" my={2} />
    
                    {selectedPiece.idPiece && (
                    <Button 
                        asChild
                        colorPalette="red" variant="solid" bg="brand.rouge" w="full"
                        _hover={{ bg: "brand.rougeFonce" }}
                    >
                        <RouterLink to={cheminFichePiece(selectedPiece.idPiece)}>
                            Ouvrir la fiche complète <FiArrowRight aria-hidden="true" />
                        </RouterLink>
                    </Button>
                    )}

                </VStack>
            ) : (
                <VStack justify="center" h="100%" minH={{ base: "160px", lg: "350px" }} gap={3} textAlign="center" color="gray.500">
                    <Box p={4} borderRadius="full" bg="brand.beige" color="brand.brun"><FiInfo size={32} aria-hidden="true" /></Box>
                    <Heading as="h2" size="md" color="brand.gris">Sélectionnez une pièce</Heading>
                    <Text fontSize="sm" color="gray.600">Touchez une pastille rouge sur le schéma pour voir sa fiche.</Text>
                </VStack>
            )}
        </Box>
    );
};

export default AtlasDetails;