import React from "react";
import { Box, Flex, Button, Image, Text } from "@chakra-ui/react";

const InteractiveDiagram = ({ 
    currentFace, 
    setCurrentFace, 
    currentBackgroundImage, 
    visiblePieces, 
    selectedPiece, 
    onSelectPiece,
    enableSwitch = true, 
    customHeight = null,
    imageScale = 1,
    imageTranslateX = "0px",
    imageTranslateY = "0px"
}) => {
    const defaultHeight = currentFace === "externe"
    ? { base: "400px", lg: "600px" }
    : { base: "400px", lg: "500px" };
    const finalHeight = customHeight || defaultHeight;

    // Calcul du contre-zoom pour les pastilles afin qu'elles gardent leur taille d'origine
    const counterScale = 1 / imageScale;
    const hoverScale = 1.2 / imageScale;

    return (
        <Box w={{ base: "100%", lg: "500px" }}>
            {/* BOUTONS SWITCH */}
            {enableSwitch && (
            <Flex justify="center" mb={10} bg="white" p={1} borderRadius="full" shadow="sm" display="inline-flex">
                <Button 
                    size="sm" borderRadius="full" px={6}
                    variant={currentFace === "interne" ? "solid" : "ghost"}
                    colorScheme={currentFace === "interne" ? "red" : "gray"}
                    onClick={() => { setCurrentFace("interne"); onSelectPiece(null); }}
                    bg={currentFace === "interne" ? "brand.rouge" : "transparent"}
                    color={currentFace === "interne" ? "white" : "gray.500"}
                    _hover={{ bg: currentFace === "interne" ? "brand.rouge" : "gray.100" }}
                >
                    Vue Intérieure
                </Button>
                <Button 
                    size="sm" borderRadius="full" px={6}
                    variant={currentFace === "externe" ? "solid" : "ghost"}
                    colorScheme={currentFace === "externe" ? "red" : "gray"}
                    onClick={() => { setCurrentFace("externe"); onSelectPiece(null); }}
                    bg={currentFace === "externe" ? "brand.rouge" : "transparent"}
                    color={currentFace === "externe" ? "white" : "gray.500"}
                    _hover={{ bg: currentFace === "externe" ? "brand.rouge" : "gray.100" }}
                >
                    Vue Extérieure
                </Button>
            </Flex>
            )}
            
            {/* CARTE INTERACTIVE */}
            <Flex 
                position="relative" 
                boxShadow="xl" 
                borderRadius="xl" 
                overflow="hidden" 
                bg="white" 
                border="4px solid white" 
                h={finalHeight} 
                transition="height 0.3s ease"
                align="center" 
                justify="center"
            >
                {/* BLOC QUI GROSSIT */}
                <Box 
                position="relative" 
                w="fit-content" 
                h="fit-content"
                transform={`translate(${imageTranslateX}, ${imageTranslateY}) scale(${imageScale})`}
                transition="transform 0.3s ease"
                >
                    <Image 
                        src={currentBackgroundImage} 
                        alt="Schéma de découpe" 
                        maxH={finalHeight}
                        maxW="100%"
                        objectFit="contain"
                        display="block"   
                        transition="all 0.3s"
                        fallbackSrc="https://via.placeholder.com/600x400?text=Chargement..."
                    />
                    
                    {/* PASTILLES AVEC CONTRE-ZOOM */}
                    {visiblePieces.map((piece) => (
                        <Box
                            key={piece.idPiece}
                            as="button"
                            onClick={() => onSelectPiece(piece)}
                            position="absolute"
                            top={piece.top}
                            left={piece.left}
                            // 👇 ASTUCE ICI : On applique le contre-zoom calculé en haut
                            transform={`translate(-50%, -50%) scale(${counterScale})`}
                            zIndex={10}
                            cursor="pointer"
                            w={selectedPiece?.idPiece === piece.idPiece ? "40px" : "30px"}
                            h={selectedPiece?.idPiece === piece.idPiece ? "40px" : "30px"}
                            borderRadius="full"
                            bg={selectedPiece?.idPiece === piece.idPiece ? "brand.rouge" : "white"}
                            border="3px solid"
                            borderColor={selectedPiece?.idPiece === piece.idPiece ? "white" : "brand.rouge"}
                            boxShadow="0 0 0 4px rgba(197, 48, 48, 0.3)"
                            transition="all 0.3s"
                            // 👇 ASTUCE ICI AUSSI : On gère le survol avec le contre-zoom
                            _hover={{ 
                                transform: `translate(-50%, -50%) scale(${hoverScale})`, 
                                bg: "brand.rouge", 
                                borderColor: "white" 
                            }}
                        >
                        <Box 
                            w="8px" 
                            h="8px" 
                            bg={selectedPiece?.idPiece === piece.idPiece ? "white" : "brand.rouge"} 
                            borderRadius="full" 
                            position="absolute" 
                            top="50%" 
                            left="50%" 
                            transform="translate(-50%, -50%)" 
                            />
                        </Box>
                    ))}
                </Box>
            </Flex>
            
            {enableSwitch && (
            <Text textAlign="center" fontSize="sm" color="gray.400" mt={2} fontStyle="italic">
                {currentFace === "interne" ? "Vue interne" : "Vue externe"}
            </Text>
            )}
        </Box>
    );
};

export default InteractiveDiagram;