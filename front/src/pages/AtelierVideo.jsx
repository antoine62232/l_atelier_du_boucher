import React, { useState, useEffect } from "react";
import { Box, Container, Heading, Text, Flex, VStack, SimpleGrid, Button, Spinner, Center, Dialog } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { getAllRessources } from "../services/RessourcesService";
import VideoCard from "../components/videos/VideoCard";
import FavoriteButton from "../components/common/FavoriteButton";

// Imports pour le lecteur YouTube
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

import { getYoutubeId, enregistrerDerniereVideo } from "../utils/videos";

const AtelierVideo = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("Tout");
  const [loading, setLoading] = useState(true);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const idVideoDemandee = Number(searchParams.get("video"));
  const [videoChoisie, setVideoChoisie] = useState(null);
  const selectedVideo = videoChoisie || (idVideoDemandee ? videos.find((v) => v.idRessource === idVideoDemandee) || null : null);

  const ouvrirVideo = (video) => {
    enregistrerDerniereVideo(video);
    setVideoChoisie(video);
  };

  const fermerVideo = () => {
    setVideoChoisie(null);
    if (searchParams.has("video")) setSearchParams({}, { replace: true });
  };

  const categories = ["Tout", "Désossage", "Parage", "Ficelage", "Coupe"];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await getAllRessources();
        setVideos(response.data);
        setFilteredVideos(response.data); 
      } catch (error) {
        console.error("Erreur lors de la récupération des vidéos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleFilter = (category) => {
    setActiveTab(category);
    if (category === "Tout") {
      setFilteredVideos(videos);
    } else {
      setFilteredVideos(videos.filter(v => v.typeTechnique.toLowerCase() === category.toLowerCase()));
    }
  };

  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt={{ base: "120px", md: "140px" }} pb="84px">
      <Container maxW="1360px" px={{ base: 4, md: 6 }}>

        {/* EN-TÊTE */}
        <Box textAlign="center" mb={10}>
            <Heading as="h1" fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
                Atelier Vidéo
            </Heading>
            <Text color="brand.gris" fontSize="md" maxW="600px" mx="auto">
                Apprenez et perfectionnez vos techniques de découpe avec nos vidéos explicatives détaillées.
            </Text>
        </Box>

        {/* FILTRES */}
        <Flex justify="center" wrap="wrap" gap={4} mb={12}>
            {categories.map((cat) => (
                <Button
                    key={cat}
                    aria-pressed={activeTab === cat}
                    onClick={() => handleFilter(cat)}
                    bg={activeTab === cat ? "brand.rouge" : "transparent"}
                    color={activeTab === cat ? "white" : "brand.brun"}
                    border={activeTab === cat ? "none" : "1px solid"}
                    borderColor="brand.brun"
                    borderRadius="full"
                    px={6}
                    _hover={{ 
                        bg: activeTab === cat ? "brand.rouge" : "brand.brun", 
                        color: "white" 
                    }}
                >
                    {cat}
                </Button>
            ))}
        </Flex>

        {/* GRILLE DES VIDÉOS */}
        {loading ? (
            <Center h="300px"><Spinner size="xl" color="brand.rouge" /></Center>
        ) : filteredVideos.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
                {filteredVideos.map((video) => (
                    <VideoCard 
                        key={video.idRessource} 
                        video={video} 
                        onClick={ouvrirVideo}
                    />
                ))}
            </SimpleGrid>
        ) : (
            <Center h="200px">
                <Text color="gray.500" fontStyle="italic">Aucune vidéo trouvée pour cette catégorie.</Text>
            </Center>
        )}

      </Container>

      {/* MODALE DE LECTURE VIDÉO */}
      <Dialog.Root 
        open={!!selectedVideo} 
        onOpenChange={(e) => !e.open && fermerVideo()}
        placement="center"
      >
        <Dialog.Backdrop backdropFilter="blur(5px)" bg="blackAlpha.700" zIndex="1400" />
        <Dialog.Positioner zIndex="1500">
            <Dialog.Content bg="white" borderRadius="xl" overflow="hidden" w={{ base: "95vw", md: "800px" }} maxW="100%" position="relative">
                
                {selectedVideo && (
                    <>
                        {/* Zone Vidéo avec Bouton Fermer */}
                        <Box position="relative" w="100%" bg="black">
                            
                            <Box position="absolute" top="10px" right="10px" zIndex="10">
                                <Button
                                    aria-label="Fermer la vidéo"
                                    bg="brand.rouge" color="white" borderRadius="full"
                                    w="44px" h="44px" minW="44px" p={0} _hover={{ bg: "brand.brun" }}
                                    onClick={fermerVideo}
                                >
                                    <FiX size={20} aria-hidden="true" />
                                </Button>
                            </Box>

                            {/* Lecteur YouTube */}
                            {getYoutubeId(selectedVideo.urlVideo) ? (
                                <LiteYouTubeEmbed
                                    id={getYoutubeId(selectedVideo.urlVideo)}
                                    title={selectedVideo.titre}
                                    wrapperClass="yt-lite"
                                />
                            ) : (
                                <Center h="400px" bg="gray.100">
                                    <Text color="gray.500">Vidéo indisponible</Text>
                                </Center>
                            )}
                        </Box>

                        {/* Zone Description en dessous de la vidéo */}
                        <Box p={6}>
                            <Flex justify="space-between" align="center" mb={2} wrap="wrap" gap={2}>
                                {/* On groupe le titre et le coeur */}
                                <Flex align="center" gap={4}>
                                    <Dialog.Title asChild>
                                    <Heading as="h2" fontFamily="title" color="brand.rouge" size="lg">
                                        {selectedVideo.titre}
                                    </Heading>
                                    </Dialog.Title>
                                    
                                    {/* LE COEUR */}
                                    <Box position="relative" display="inline-block" w="40px" h="40px">
                                        <FavoriteButton 
                                            itemId={selectedVideo.idRessource} 
                                            type="video" 
                                            isInitiallyFavorite={selectedVideo.isFavori || false} 
                                        />
                                    </Box>
                                </Flex>

                                <Text color="brand.brun" fontSize="sm" fontWeight="bold" textTransform="uppercase">
                                    {selectedVideo.typeTechnique}
                                </Text>
                            </Flex>
                            
                            <Text fontWeight="bold" color="gray.500" fontSize="sm" mb={4}>
                                Lié à : {selectedVideo.nomAnimal || "Bœuf"} - {selectedVideo.nomPartie || "Carcasse"}
                            </Text>
                            
                            <Text color="brand.gris" lineHeight="1.6" fontSize="md">
                                {selectedVideo.descriptionTechnique}
                            </Text>
                        </Box>
                    </>
                )}
            </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

    </Box>
  );
};

export default AtelierVideo;