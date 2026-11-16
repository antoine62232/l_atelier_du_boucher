import React from "react";
import { Box, Text, Badge, Flex, Heading } from "@chakra-ui/react";
import { FiPlayCircle } from "react-icons/fi";
import FavoriteButton from "../common/FavoriteButton";
import ImageAvecSecours from "../ImageAvecSecours";
import { getYoutubeMiniature } from "../../utils/videos";

const VideoCard = ({ video, onClick }) => {
  return (
    <Box 
      w="100%" 
      bg="white" 
      borderRadius="xl" 
      overflow="hidden" 
      boxShadow="carte"
      cursor="pointer"
      transition="all 0.3s ease"
      role="button"
      tabIndex={0}
      aria-label={`Lire la vidéo : ${video.titre}`}
      onClick={() => onClick(video)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(video);
        }
      }}
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

        <ImageAvecSecours
          className="video-image"
          src={getYoutubeMiniature(video.urlVideo)}
          alt=""
          w="100%" h="100%" objectFit="cover" transition="transform 0.4s ease"
        />
        
        <Flex 
            className="video-overlay"
            position="absolute" top="0" left="0" w="100%" h="100%" 
            bg="blackAlpha.500" justify="center" align="center"
            opacity={0} transition="opacity 0.3s ease"
            pointerEvents="none"
        >
            <FiPlayCircle size={60} color="white" aria-hidden="true" />
        </Flex>
      </Box>

      <Flex direction="column" p={5} gap={2}>
        <Badge 
            bg="brand.rouge" color="white" px={2} py={1} borderRadius="md" 
            alignSelf="flex-start" fontSize="xs" fontWeight="bold" letterSpacing="wide"
        >
            {video.typeTechnique?.toUpperCase() || "TECHNIQUE"}
        </Badge>
        
        <Heading as="h2" fontFamily="title" fontSize="xl" color="brand.gris" lineHeight="1.2" mt={2} mb={1}>
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