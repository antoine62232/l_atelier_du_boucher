import React from "react";
import { 
  Box, 
  Container, 
  Heading, 
  Button, 
  Card, 
  HStack, 
  Badge, 
  Icon,
  Flex
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

const CourseResume = () => {
  const videoId = "T3OXZZLStT0"; 

  return (
    <Box as="section" bg="brand.beige" pb="84px">
      <Container maxW="1400px">
        
        <Heading 
          textAlign="center" 
          mb="84px"
          color="brand.rouge" 
          fontFamily="title"
          fontSize={{ base: "3xl", md: "5xl" }}
        >
          Reprenez votre parcours
        </Heading>

        <Card.Root 
            flexDirection={{ base: "column", md: "row" }} 
            overflow="hidden" 
            variant="elevated" 
            bg="white"
            borderColor="gray.100"
            w="100%"
            maxW={{ base: "280px", md: "622px", xl: "1280px" }} 
            mx="auto"
            boxSizing="border-box"
        >
            {/* 1. ZONE VIDÉO (Gauche) */}
            <Box 
                w={{ base: "100%", md: "450px" }} 
                h="auto"
                position="relative"
                bg="black"
                flexShrink={0} // Empêche la vidéo de rétrécir
            >
                <LiteYouTubeEmbed 
                    id={videoId}
                    title="Désossage de l'épaule de boeuf"
                    poster="maxresdefault"
                    wrapperClass="yt-lite"
                />
            </Box>

            {/* 2. ZONE CONTENU (Texte + Bouton) */}
            <Flex 
                flex="1" 
                direction={{ base: "column", md: "row" }}
                align="center"
                justify="space-between"
                p={{ base: 4, md: 6 }} 
                gap={6}
            >
                
                {/* A. LE TEXTE (Milieu) */}
                <Card.Body p={0} gap={3} flex="1" w="100%" ml={{ base: 0, md: 8 }} >
                    <HStack>
                        <Badge colorPalette="red" variant="solid" bg="brand.rouge">
                            VIDÉO
                        </Badge>
                        <Badge variant="outline" colorPalette="gray">
                            CAP
                        </Badge>
                    </HStack>

                    <Card.Title 
                        fontFamily="heading" 
                        fontSize="3xl" 
                        color="brand.rouge"
                        lineHeight="short"
                        mb={1}
                    >
                        Désossage de l'épaule de boeuf
                    </Card.Title>

                    <Card.Description fontSize="md" color="gray.600">
                       Les Bovins - Avant
                    </Card.Description>
                </Card.Body>

                {/* B. LE BOUTON (Droite) */}
                <Box flexShrink={0}>
                    <Button 
                        bg="brand.brun"
                        color="white"
                        rounded="full"
                        size="lg"
                        textTransform="uppercase"
                        px={8}
                        _hover={{ bg: "brand.rouge" }}
                        rightIcon={<Icon as={FaPlay} boxSize={3} />}
                        w={{ base: "100%", md: "auto" }}
                    >
                        Continuer la lecture
                    </Button>
                </Box>

            </Flex>
        </Card.Root>

      </Container>
    </Box>
  );
};

export default CourseResume;