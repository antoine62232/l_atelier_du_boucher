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
            <Flex justify="center" mb={{ base: 6, md: 10 }} bg="white" p={1} borderRadius="full" shadow="sm" display="inline-flex" role="group" aria-label="Choix de la vue">
                <Button 
                    borderRadius="full" px={6}
                    aria-pressed={currentFace === "interne"}
                    variant={currentFace === "interne" ? "solid" : "ghost"}
                    colorPalette={currentFace === "interne" ? "red" : "gray"}
                    onClick={() => { setCurrentFace("interne"); onSelectPiece(null); }}
                    bg={currentFace === "interne" ? "brand.rouge" : "transparent"}
                    color={currentFace === "interne" ? "white" : "gray.600"}
                    _hover={{ bg: currentFace === "interne" ? "brand.rouge" : "gray.100" }}
                >
                    Vue Intérieure
                </Button>
                <Button 
                    borderRadius="full" px={6}
                    aria-pressed={currentFace === "externe"}
                    variant={currentFace === "externe" ? "solid" : "ghost"}
                    colorPalette={currentFace === "externe" ? "red" : "gray"}
                    onClick={() => { setCurrentFace("externe"); onSelectPiece(null); }}
                    bg={currentFace === "externe" ? "brand.rouge" : "transparent"}
                    color={currentFace === "externe" ? "white" : "gray.600"}
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
                        alt={currentFace === "externe" ? "Schéma de découpe, vue extérieure" : "Schéma de découpe, vue intérieure"}
                        maxH={finalHeight}
                        maxW="100%"
                        objectFit="contain"
                        display="block"   
                        transition="all 0.3s"
                    />
                    
                    {/* PASTILLES AVEC CONTRE-ZOOM */}
                    {visiblePieces.map((piece) => {
                        const estChoisie = Boolean(selectedPiece) && (selectedPiece.idPiece ?? selectedPiece.nomBdd) === (piece.idPiece ?? piece.nomBdd);
                        const nom = piece.nomPiece || piece.nomBdd;
                        return (
                            <Box
                                key={piece.idPiece ?? piece.nomBdd}
                                as="button"
                                type="button"
                                aria-label={nom}
                                aria-pressed={estChoisie}
                                title={nom}
                                onClick={() => onSelectPiece(piece)}
                                position="absolute"
                                top={piece.top}
                                left={piece.left}
                                transform={`translate(-50%, -50%) scale(${counterScale})`}
                                zIndex={estChoisie ? 11 : 10}
                                cursor="pointer"
                                w="44px"
                                h="44px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="full"
                                bg="transparent"
                                css={{
                                    "&:hover > span, &:focus-visible > span": {
                                        transform: `scale(${hoverScale / counterScale})`,
                                        background: "var(--chakra-colors-brand-rouge)",
                                        borderColor: "white",
                                    },
                                }}
                            >
                                <Box
                                    as="span"
                                    position="relative"
                                    w={estChoisie ? "36px" : "30px"}
                                    h={estChoisie ? "36px" : "30px"}
                                    borderRadius="full"
                                    bg={estChoisie ? "brand.rouge" : "white"}
                                    border="3px solid"
                                    borderColor={estChoisie ? "white" : "brand.rouge"}
                                    boxShadow="0 0 0 4px rgba(138, 28, 37, 0.3)"
                                    transition="all 0.25s"
                                >
                                    <Box
                                        as="span"
                                        display="block"
                                        w="8px"
                                        h="8px"
                                        bg={estChoisie ? "white" : "brand.rouge"}
                                        borderRadius="full"
                                        position="absolute"
                                        top="50%"
                                        left="50%"
                                        transform="translate(-50%, -50%)"
                                    />
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Flex>
            
            {enableSwitch && (
            <Text textAlign="center" fontSize="sm" color="gray.600" mt={2} fontStyle="italic">
                Touchez une pastille pour afficher la pièce
            </Text>
            )}
        </Box>
    );
};

export default InteractiveDiagram;