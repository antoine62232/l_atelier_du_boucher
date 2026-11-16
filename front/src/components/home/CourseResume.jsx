import React, { useState } from "react";
import { Box, Container, Heading, Button, Card, HStack, Badge, Icon, Flex, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import ImageAvecSecours from "../ImageAvecSecours";
import { getYoutubeMiniature, lireDerniereVideo } from "../../utils/videos";

const CourseResume = () => {
  const [video] = useState(lireDerniereVideo);

  if (!video) return null;

  const lienVideo = `/videos?video=${video.idRessource}`;
  const contexte = [video.nomAnimal, video.nomPartie].filter(Boolean).join(" · ");

  return (
    <Box as="section" bg="brand.beige" pb={{ base: 14, md: "84px" }}>
      <Container maxW="1400px">
        <Heading
          as="h2"
          textAlign="center"
          mb={4}
          color="brand.rouge"
          fontFamily="title"
          fontSize={{ base: "3xl", md: "5xl" }}
        >
          Reprenez votre parcours
        </Heading>

        <Text textAlign="center" color="brand.gris" fontSize="md" maxW="600px" mx="auto" mb={{ base: 10, md: "64px" }}>
          Votre dernière vidéo consultée, à portée de main.
        </Text>

        <Card.Root
          flexDirection={{ base: "column", md: "row" }}
          overflow="hidden"
          bg="white"
          border="none"
          boxShadow="carte"
          w="100%"
          maxW={{ base: "400px", md: "960px" }}
          mx="auto"
        >
          <Box
            as={RouterLink}
            to={lienVideo}
            aria-hidden="true"
            tabIndex={-1}
            position="relative"
            w={{ base: "100%", md: "420px" }}
            flexShrink={0}
            aspectRatio={16 / 9}
            bg="black"
          >
            <ImageAvecSecours src={getYoutubeMiniature(video.urlVideo)} alt="" w="100%" h="100%" objectFit="cover" />
            <Flex position="absolute" inset="0" align="center" justify="center" bg="blackAlpha.400">
              <Flex w="64px" h="64px" rounded="full" bg="whiteAlpha.900" align="center" justify="center" color="brand.rouge">
                <Icon as={FaPlay} boxSize={5} ml="3px" />
              </Flex>
            </Flex>
          </Box>

          <Flex direction="column" justify="center" gap={3} p={{ base: 5, md: 8 }} flex="1">
            <HStack>
              <Badge bg="brand.rouge" color="white">VIDÉO</Badge>
              {video.typeTechnique && (
                <Badge variant="outline" colorPalette="gray">
                  {video.typeTechnique.toUpperCase()}
                </Badge>
              )}
            </HStack>

            <Heading as="h3" fontFamily="title" fontSize={{ base: "xl", md: "2xl" }} color="brand.rouge" lineHeight="short">
              {video.titre}
            </Heading>

            {contexte && <Text color="gray.600">{contexte}</Text>}

            <Button
              asChild
              alignSelf={{ base: "stretch", md: "flex-start" }}
              mt={2}
              bg="brand.brun"
              color="white"
              rounded="full"
              px={8}
              _hover={{ bg: "brand.rouge" }}
            >
              <RouterLink to={lienVideo}>
                Reprendre la vidéo <Icon as={FaPlay} boxSize={3} aria-hidden="true" />
              </RouterLink>
            </Button>
          </Flex>
        </Card.Root>
      </Container>
    </Box>
  );
};

export default CourseResume;
