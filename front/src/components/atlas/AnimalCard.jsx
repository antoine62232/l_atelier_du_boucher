import React from "react";
import { Box, Image, Text, VStack, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const AnimalCard = ({ image, name, link }) => {
  return (
    <Link 
        as={RouterLink} 
        to={link} 
        _hover={{ textDecoration: "none" }}
        outline="none"
    >
        <Box 
            bg="white" 
            borderRadius="2xl" 
            boxShadow="lg" 
            overflow="hidden" 
            w="320px"
            transition="all 0.3s ease"
            _hover={{ 
                transform: "translateY(-5px)", 
                boxShadow: "2xl",
                cursor: "pointer"
            }}
        >
            {/* Image de l'animal */}
            <Box h="240px" overflow="hidden">
                <Image 
                    src={image} 
                    alt={name} 
                    w="100%" 
                    h="100%" 
                    objectFit="cover" 
                    transition="transform 0.5s ease"
                    _groupHover={{ transform: "scale(1.05)" }}
                />
            </Box>

            {/* Contenu Texte */}
            <VStack py={6} gap={2}>
                <Text 
                    fontFamily="title" 
                    color="brand.rouge" 
                    fontSize="xl" 
                    fontWeight="bold" 
                    letterSpacing="wide"
                    textTransform="uppercase"
                >
                    {name}
                </Text>
                
                <Text 
                    color="brand.brun" 
                    fontSize="sm" 
                    fontWeight="medium"
                    _groupHover={{ color: "brand.rouge" }}
                >
                    Voir les découpes &gt;
                </Text>
            </VStack>
        </Box>
    </Link>
  );
};

export default AnimalCard;