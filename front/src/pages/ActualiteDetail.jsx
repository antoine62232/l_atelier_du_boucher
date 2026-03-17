import React, { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { 
  Box, Container, Heading, Text, Flex, Image, 
  Button, Spinner, Center, Badge, Icon, VStack 
} from "@chakra-ui/react"; // 👈 Divider supprimé d'ici
import { FiCalendar, FiArrowLeft, FiExternalLink } from "react-icons/fi";
import { getActualiteById } from "../services/ActualitesService";
import { getImageUrl } from "../utils/imageUtils";

const ActualiteDetail = () => {
  const { id } = useParams();
  const [actualite, setActualite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await getActualiteById(id);
        setActualite(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'article:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <Center h="70vh"><Spinner size="xl" color="brand.rouge" /></Center>;
  
  if (!actualite) return (
    <Center h="70vh">
        <VStack>
            <Text fontSize="xl">Article introuvable.</Text>
            <Button as={RouterLink} to="/actualites" colorScheme="red" variant="link">Retour aux actualités</Button>
        </VStack>
    </Center>
  );

  const dateFormatee = new Date(actualite.datePublication).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const imagePath = actualite.imageActualite?.startsWith('http') 
    ? actualite.imageActualite 
    : getImageUrl(`actualites/${actualite.imageActualite}`);

  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt="140px" pb="84px">
      <Container maxW="900px" px={6}>
        
        <Flex as={RouterLink} to="/actualites" align="center" gap={2} color="brand.brun" fontWeight="bold" mb={8} _hover={{ color: "brand.rouge" }}>
            <FiArrowLeft /> Retour aux actualités
        </Flex>

        <Box bg="white" p={{ base: 6, md: 10 }} borderRadius="2xl" boxShadow="lg">
            
            <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
                <Badge colorScheme="red" fontSize="md" px={3} py={1} borderRadius="md">
                    {actualite.categorie}
                </Badge>
                <Flex align="center" gap={2} color="gray.500">
                    <Icon as={FiCalendar} />
                    <Text fontWeight="medium">{dateFormatee}</Text>
                </Flex>
            </Flex>

            <Heading fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={8} lineHeight="1.2">
                {actualite.titre}
            </Heading>

            <Box borderRadius="xl" overflow="hidden" mb={10} boxShadow="sm">
                <Image 
                    src={imagePath}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200";
                    }}
                    alt={actualite.titre}
                    w="100%"
                    maxH="500px"
                    objectFit="cover"
                />
            </Box>

            <Text 
                fontSize="lg" 
                color="gray.700" 
                lineHeight="1.8" 
                textAlign="justify"
                whiteSpace="pre-wrap"
            >
                {actualite.contenu}
            </Text>

            {/* 👇 Remplacement du Divider par une Box avec bordure 👇 */}
            {actualite.lienSource && (
                <>
                    <Box borderBottom="1px solid" borderColor="gray.200" w="100%" my={10} />
                    <VStack align="flex-start" spacing={4}>
                        <Text fontWeight="bold" color="brand.brun">Pour aller plus loin :</Text>
                        <Button 
                            as="a" 
                            href={actualite.lienSource} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            rightIcon={<FiExternalLink />}
                            colorScheme="blue"
                            variant="outline"
                            _hover={{ bg: "blue.50" }}
                        >
                            Lire la source officielle
                        </Button>
                    </VStack>
                </>
            )}
        </Box>
      </Container>
    </Box>
  );
};

export default ActualiteDetail;