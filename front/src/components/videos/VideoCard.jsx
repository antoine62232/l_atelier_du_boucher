import React from "react";
import { Box, Image, Text, Badge, Flex, Heading } from "@chakra-ui/react";
import { FiPlayCircle } from "react-icons/fi";
import FavoriteButton from "../common/FavoriteButton"; 

const VideoCard = ({ video, onClick }) => {
  const getYoutubeThumbnail = (url) => {
    if (!url) return "https://via.placeholder.com/640x360?text=Vidéo+Non+Disponible";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
    }
    return "https://via.placeholder.com/640x360?text=Vidéo";
  };

  return (
    <Box 
      w="100%" 
      bg="white" 
      borderRadius="xl" 
      overflow="hidden" 
      boxShadow="md" 
      cursor="pointer"
      transition="all 0.3s ease"
      onClick={() => onClick(video)}
      css={{
        "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "var(--chakra-shadows-xl)",
        },
        "&:hover .video-overlay": { opacity: 1 },
        "&:hover .video-image": { transform: "scale(1.05)" }
      }}
    >
      <Box position="relative" h="200px" w="100%" overflow="hidden">
        
        {/* BOUTON COEUR */}
        <FavoriteButton 
          itemId={video.idRessource}
          type="video"
          isInitiallyFavorite={video.isFavori || false} 
        />

        <Image 
          className="video-image"
          src={getYoutubeThumbnail(video.urlVideo)} 
          alt={video.titre} 
          w="100%" h="100%" objectFit="cover" transition="transform 0.4s ease"
        />
        
        <Flex 
            className="video-overlay"
            position="absolute" top="0" left="0" w="100%" h="100%" 
            bg="blackAlpha.500" justify="center" align="center"
            opacity={0} transition="opacity 0.3s ease"
            pointerEvents="none"
        >
            <FiPlayCircle size={60} color="white" />
        </Flex>
      </Box>

      <Flex direction="column" p={5} gap={2}>
        <Badge 
            bg="brand.rouge" color="white" px={2} py={1} borderRadius="md" 
            alignSelf="flex-start" fontSize="xs" fontWeight="bold" letterSpacing="wide"
        >
            {video.typeTechnique?.toUpperCase() || "TECHNIQUE"}
        </Badge>
        
        <Heading fontFamily="title" fontSize="xl" color="brand.gris" lineHeight="1.2" mt={2} mb={1}>
            {video.titre}
        </Heading>

        <Text color="gray.500" fontSize="sm">
            {video.nomAnimal} - {video.nomPartie}
        </Text>
      </Flex>
    </Box>
  );
};

export default VideoCard;