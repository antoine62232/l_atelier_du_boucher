import React from "react";
import { Box, Heading, Text, Button, VStack, Flex, Image, Badge } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiInfo, FiExternalLink } from "react-icons/fi"; 

const AtlasDetails = ({ selectedPiece, getImageUrl }) => {
    return (
        // Détails de la pièce sélectionnée
        <Box w={{ base: "100%", lg: "400px" }} bg="white" p={6} borderRadius="xl" shadow="lg" minH="400px">
            {selectedPiece ? (
                <VStack align="start" spacing={4} animation="fadeIn 0.5s">
                    <Flex justify="space-between" w="100%" align="center">
                        <Heading size="lg" color="brand.rouge" fontFamily="title" lineHeight="1.2">
                            {selectedPiece.nomPiece}
                        </Heading>
                        <Badge colorScheme="orange" variant="subtle" fontSize="0.8em" px={2} py={1} borderRadius="md">
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
    
                    <Button 
                        as={RouterLink} 
                        to={`/recettes?pieceId=${selectedPiece.idPiece}`} 
                        colorScheme="red" variant="solid" bg="brand.rouge" w="full"
                        _hover={{ bg: "brand.brun" }}
                    >
                        <FiExternalLink style={{ marginRight: "8px" }} /> Voir les recettes
                    </Button>

                </VStack>
            ) : (
                <VStack justify="center" h="100%" spacing={4} textAlign="center" color="gray.400">
                    <Box p={4} borderRadius="full" bg="gray.50"><FiInfo size={40} /></Box>
                    <Heading size="md" color="gray.500">Sélectionnez une pièce</Heading>
                    <Text fontSize="sm">Cliquez sur les pastilles rouges pour voir les détails.</Text>
                </VStack>
            )}
        </Box>
    );
};

export default AtlasDetails;