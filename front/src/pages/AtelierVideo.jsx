import React, { useState, useEffect } from "react";
import { Box, Container, Heading, Text, Flex, VStack, SimpleGrid, Button, Spinner, Center, Dialog } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { getAllRessources } from "../services/RessourcesService";
import VideoCard from "../components/videos/VideoCard";

// Imports pour le lecteur YouTube
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

// Fonction pour extraire l'ID de la vidéo
const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const AtelierVideo = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("Tout");
  const [loading, setLoading] = useState(true);
  
  const [selectedVideo, setSelectedVideo] = useState(null);

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
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt="140px" pb="84px">
      <Container maxW="1360px" px={6}>
        
        {/* FIL D'ARIANE */}
        <VStack align="start" spacing="12px" mb={10}>
             <Flex align="center" gap={2} color="gray.500" fontSize="sm">
                <Text as={RouterLink} to="/" _hover={{ textDecoration: "underline" }}>Accueil</Text>
                <Text>/</Text>
                <Text color="brand.rouge" fontWeight="medium">Atelier Vidéo</Text>
             </Flex>
        </VStack>

        {/* EN-TÊTE */}
        <Box textAlign="center" mb={10}>
            <Heading fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
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
                        onClick={(v) => setSelectedVideo(v)} 
                    />
                ))}
            </SimpleGrid>
        ) : (
            <Center h="200px">
                <Text color="gray.500" fontStyle="italic">Aucune vidéo trouvée pour cette catégorie.</Text>
            </Center>
        )}

      </Container>

      {/* MODALE DE LECTURE VIDÉO CORRIGÉE */}
      <Dialog.Root 
        open={!!selectedVideo} 
        onOpenChange={(e) => !e.open && setSelectedVideo(null)}
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
                                    bg="brand.rouge" color="white" borderRadius="full" size="sm"
                                    w="36px" h="36px" p={0} _hover={{ bg: "brand.brun" }}
                                    onClick={() => setSelectedVideo(null)}
                                >
                                    <FiX size={20} />
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
                                <Heading fontFamily="title" color="brand.rouge" size="lg">
                                    {selectedVideo.titre}
                                </Heading>
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