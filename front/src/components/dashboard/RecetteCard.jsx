import React from 'react';
import { Box, Image, Flex, Text, Heading } from '@chakra-ui/react';

const RecetteCard = ({ recette, onToggleFavori }) => {
    // Si pas d'image, on met un placeholder
    const imageUrl = recette.imageRecette || 'https://via.placeholder.com/300x200?text=Atelier+du+Boucher';

    return (
        <Box
            borderWidth="1px"
            borderColor="brand.acier"
            borderRadius="md"
            overflow="hidden"
            bg="white"
            boxShadow="md"
            transition="transform 0.2s"
            _hover={{ transform: 'translateY(-4px)' }} // Petit effet au survol
            display="flex"
            flexDirection="column"
            h="100%"
        >
            {/* Haut de la carte (Image + Bouton Favori) */}
            <Box position="relative" h="140px">
                <Image src={imageUrl} alt={recette.titre} objectFit="cover" w="100%" h="100%" />
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
                    onClick={(e) => { e.stopPropagation(); onToggleFavori(recette.idRecette); }}
                    cursor="pointer"
                    title="Retirer des favoris"
                >
                    ♥️
                </Box>
            </Box>

            {/* Corps de la carte */}
            <Flex p="4" direction="column" flex="1">
                <Heading as="h4" size="md" fontFamily="title" color="brand.gris" mb="1" noOfLines={1}>
                    {recette.titre}
                </Heading>

                <Text fontSize="sm" fontFamily="body" color="brand.acier" mb="3">
                    <Box as="span" color="brand.rouge" mr="1">●</Box>
                    {recette.nomPiece}
                </Text>

                {/* Footer de la carte (Temps et Difficulté) */}
                <Flex justify="space-between" mt="auto" pt="3" borderTopWidth="1px" borderColor="brand.acier">
                    <Text fontSize="xs" color="brand.gris">⏱️ {recette.tempsPreparation} min</Text>
                    <Text fontSize="xs" color="brand.gris">📊 {recette.difficulte}</Text>
                </Flex>
            </Flex>
        </Box>
    );
};

export default RecetteCard;