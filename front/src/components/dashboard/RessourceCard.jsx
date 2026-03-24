import React from 'react';
import { Box, Image, Flex, Text, Heading, Button } from '@chakra-ui/react';

const RessourceCard = ({ ressource, onToggleFavori }) => {
    const videoPlaceholderUrl = 'https://via.placeholder.com/300x200?text=Vidéo+Atelier+du+Boucher';

    return (
        <Box
            borderWidth="1px"
            borderColor="brand.acier"
            borderRadius="md"
            overflow="hidden"
            bg="white"
            boxShadow="md"
            display="flex"
            flexDirection="column"
            h="100%"
        >
            {/* Haut de la carte (Miniature vidéo + Bouton Favori) */}
            <Box position="relative" h="140px" bg="brand.gris">
                <Image src={videoPlaceholderUrl} alt={ressource.titre} objectFit="cover" w="100%" h="100%" opacity={0.6} />
                <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" fontSize="3xl" color="white">
                    ▶️
                </Box>
                <Box
                    as="button"
                    position="absolute"
                    top="2"
                    right="2"
                    bg="white"
                    borderRadius="full"
                    w="8"
                    h="8"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="md"
                    color="brand.rouge"
                    onClick={() => onToggleFavori(ressource.idRessource)}
                    cursor="pointer"
                    title="Retirer des favoris"
                >
                    ♥️
                </Box>
            </Box>

            {/* Corps de la carte */}
            <Flex p="4" direction="column" flex="1">
                <Heading as="h4" size="md" fontFamily="title" color="brand.gris" mb="1" noOfLines={1}>
                    {ressource.titre}
                </Heading>

                <Text fontSize="sm" fontFamily="body" color="brand.acier" mb="2">
                    <Box as="span" color="brand.rouge" mr="1">●</Box>
                    {ressource.nomPiece}
                </Text>

                <Text fontSize="xs" fontFamily="body" color="brand.gris" fontStyle="italic" borderLeftWidth="3px" borderColor="brand.brun" pl="2" mb="4">
                    Technique : {ressource.typeTechnique}
                </Text>

                <Button mt="auto" w="100%" size="sm" bg="brand.brun" color="white" _hover={{ bg: "brand.rouge" }}>
                    Regarder la vidéo
                </Button>
            </Flex>
        </Box>
    );
};

export default RessourceCard;