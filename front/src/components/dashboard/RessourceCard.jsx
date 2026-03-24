import React, { useState } from "react";
import { Box, Image, Text, Flex, Heading, IconButton, Badge, Dialog, Button, Center } from "@chakra-ui/react";
import { FiPlayCircle, FiTrash2, FiX } from "react-icons/fi";

// Import du lecteur YouTube
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

// Fonctions utilitaires pour Youtube
const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const getYoutubeThumbnail = (url) => {
    const id = getYoutubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "https://via.placeholder.com/640x360?text=Vidéo";
};

const RessourceCard = ({ ressource, onToggleFavori }) => {
  // État pour gérer l'ouverture de la modale vidéo
  const [isOpen, setIsOpen] = useState(false);

  // Fonction pour retirer des favoris sans ouvrir la vidéo
  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavori) {
      onToggleFavori(ressource.idRessource);
    }
  };

  return (
    <>
      <Box
        w="100%"
        bg="white"
        borderRadius="xl"
        overflow="hidden"
        boxShadow="sm"
        cursor="pointer"
        transition="all 0.3s ease"
        // Au clic, on ouvre la vidéo !
        onClick={() => setIsOpen(true)}
        css={{
          "&:hover": { transform: "translateY(-5px)", boxShadow: "var(--chakra-shadows-md)" },
          "&:hover .video-overlay": { opacity: 1 },
          "&:hover .video-image": { transform: "scale(1.05)" }
        }}
        position="relative"
      >
        {/* BOUTON POUBELLE */}
        <IconButton
          aria-label="Retirer des favoris"
          position="absolute"
          top="12px"
          right="12px"
          zIndex="2"
          color="red.500"
          bg="white"
          borderRadius="full"
          boxShadow="md"
          size="sm"
          onClick={handleRemove}
          _hover={{ bg: "red.50", transform: "scale(1.1)" }}
        >
            <FiTrash2 />
        </IconButton>

        {/* IMAGE ET OVERLAY PLAY */}
        <Box position="relative" h="150px" w="100%" overflow="hidden">
          <Image
            className="video-image"
            src={getYoutubeThumbnail(ressource.urlVideo)}
            alt={ressource.titre}
            w="100%" h="100%" objectFit="cover" transition="transform 0.4s ease"
          />
          <Flex
            className="video-overlay"
            position="absolute" top="0" left="0" w="100%" h="100%"
            bg="blackAlpha.500" justify="center" align="center"
            opacity={0} transition="opacity 0.3s ease"
          >
            <FiPlayCircle size={50} color="white" />
          </Flex>
        </Box>

        {/* TEXTES */}
        <Flex direction="column" p={4} gap={2}>
          <Badge
            bg="brand.rouge" color="white" px={2} py={1} borderRadius="md"
            alignSelf="flex-start" fontSize="xs" fontWeight="bold"
          >
            {ressource.typeTechnique?.toUpperCase() || "TECHNIQUE"}
          </Badge>

          <Heading fontFamily="title" fontSize="lg" color="brand.gris" noOfLines={1} lineHeight="1.2">
            {ressource.titre}
          </Heading>
        </Flex>
      </Box>

      {/* MODALE DE LECTURE VIDÉO (S'ouvre au clic) */}
      <Dialog.Root
        open={isOpen}
        onOpenChange={(e) => setIsOpen(e.open)}
        placement="center"
      >
        <Dialog.Backdrop backdropFilter="blur(5px)" bg="blackAlpha.700" zIndex="1400" />
        <Dialog.Positioner zIndex="1500">
            <Dialog.Content bg="white" borderRadius="xl" overflow="hidden" w={{ base: "95vw", md: "800px" }} maxW="100%" position="relative">

                {/* Lecteur Vidéo */}
                <Box position="relative" w="100%" bg="black">
                    <Box position="absolute" top="10px" right="10px" zIndex="10">
                        <Button
                            bg="brand.rouge" color="white" borderRadius="full" size="sm"
                            w="36px" h="36px" p={0} _hover={{ bg: "brand.brun" }}
                            onClick={() => setIsOpen(false)}
                        >
                            <FiX size={20} />
                        </Button>
                    </Box>

                    {getYoutubeId(ressource.urlVideo) ? (
                        <LiteYouTubeEmbed
                            id={getYoutubeId(ressource.urlVideo)}
                            title={ressource.titre}
                            wrapperClass="yt-lite"
                        />
                    ) : (
                        <Center h="400px" bg="gray.100">
                            <Text color="gray.500">Vidéo indisponible</Text>
                        </Center>
                    )}
                </Box>

                {/* Description de la vidéo */}
                <Box p={6}>
                    <Flex justify="space-between" align="center" mb={2} wrap="wrap" gap={2}>
                        <Heading fontFamily="title" color="brand.rouge" size="lg">
                            {ressource.titre}
                        </Heading>
                        <Text color="brand.brun" fontSize="sm" fontWeight="bold" textTransform="uppercase">
                            {ressource.typeTechnique}
                        </Text>
                    </Flex>
                    <Text color="brand.gris" lineHeight="1.6" fontSize="md">
                        {ressource.descriptionTechnique}
                    </Text>
                </Box>
            </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};

export default RessourceCard;