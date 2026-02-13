import React from "react";
import { Box, Flex, Button, Image, Text } from "@chakra-ui/react";

const InteractiveDiagram = ({ 
    currentFace, 
    setCurrentFace, 
    currentBackgroundImage, 
    visiblePieces, 
    selectedPiece, 
    onSelectPiece
}) => {
    return (
        <Box w={{ base: "100%", lg: "500px" }}>
            {/* BOUTONS SWITCH */}
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

            {/* CARTE INTERACTIVE */}
            <Flex 
                position="relative" 
                boxShadow="xl" 
                borderRadius="xl" 
                overflow="hidden" 
                bg="white" 
                border="4px solid white" 
                h={{ base: "400px", lg: "500px" }} 
                align="center" 
                justify="center"
            >
                <Box position="relative" w="fit-content" h="fit-content">
                    <Image 
                        src={currentBackgroundImage} 
                        alt={`Épaule vue ${currentFace}`} 
                        
                        maxH={{ base: "400px", lg: "500px" }}
                        maxW="100%"
                        objectFit="contain"
                        display="block" 
                        
                        transition="all 0.3s"
                        fallbackSrc="https://via.placeholder.com/600x400?text=Chargement..."
                    />
                    
                    {visiblePieces.map((piece) => (
                        <Box
                            key={piece.idPiece}
                            as="button"
                            onClick={() => onSelectPiece(piece)}
                            position="absolute"
                            top={piece.top}
                            left={piece.left}
                            transform="translate(-50%, -50%)"
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
                            _hover={{ transform: "translate(-50%, -50%) scale(1.2)", bg: "brand.rouge", borderColor: "white" }}
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
            <Text textAlign="center" fontSize="sm" color="gray.400" mt={2} fontStyle="italic">
                {currentFace === "interne" ? "Vue interne" : "Vue externe"}
            </Text>
        </Box>
    );
};

export default InteractiveDiagram;