// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Flex, 
    VStack, 
    Heading, 
    Text, 
    Button, 
    Tabs, 
    Avatar,
    Spinner,
    Center,
    SimpleGrid,
    Container
} from '@chakra-ui/react';

// Import de tes services
import * as UsersService from '../services/UsersService';
import * as RecettesService from '../services/RecettesService';
import * as RessourcesService from '../services/RessourcesService';

// Import de tes composants de cartes
import RecetteCard from '../components/dashboard/RecetteCard';
import RessourceCard from '../components/dashboard/RessourceCard';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [favorisRecettes, setFavorisRecettes] = useState([]);
    const [favorisRessources, setFavorisRessources] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [userRes, recipesRes, videosRes] = await Promise.all([
                    UsersService.getProfile(),
                    RecettesService.getFavoris(),
                    RessourcesService.getFavoris()
                ]);

                const userData = userRes.data?.user || userRes.data || userRes;
                setUser(userData);
                console.log("Données Utilisateur reçues :", userData);
                setFavorisRecettes(recipesRes);
                setFavorisRessources(videosRes);
            } catch (err) {
                console.error("Erreur dashboard:", err);
                setError("Impossible de charger les données. Vérifiez votre connexion.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const handleToggleRecetteFavori = async (idRecette) => {
        try {
            await RecettesService.toggleFavori(idRecette);
            setFavorisRecettes(prev => prev.filter(r => r.idRecette !== idRecette));
        } catch (err) { console.error(err); }
    };

    const handleToggleRessourceFavori = async (idRessource) => {
        try {
            await RessourcesService.toggleFavori(idRessource);
            setFavorisRessources(prev => prev.filter(res => res.idRessource !== idRessource));
        } catch (err) { console.error(err); }
    };

    if (loading) {
        return (
            <Center minH="100vh" bg="brand.beige">
                <VStack gap={4}>
                    <Spinner size="xl" color="brand.rouge" thickness="4px" />
                    <Text color="brand.gris" fontWeight="bold">Chargement de l'établi...</Text>
                </VStack>
            </Center>
        );
    }

    return (
        <Box 
            bg="brand.beige" 
            minH="calc(100vh - 100px)" 
            pt="140px" // Aligné sur tes autres pages
            pb="84px"
        >
            <Container maxW="1200px" px={6}>
                
                {/* --- EN-TÊTE HARMONISÉ AVEC LES AUTRES PAGES --- */}
                <Box textAlign="center" mb={12}>
                    <Heading 
                        fontFamily="title" 
                        color="brand.rouge" 
                        fontSize={{ base: "3xl", md: "5xl" }} 
                        mb={4}
                    >
                        Mon Établi
                    </Heading>
                    <Text 
                        color="gray.600" 
                        fontSize="md" 
                        maxW="600px" 
                        mx="auto"
                    >
                        Bienvenue dans votre espace personnel, <Text as="span" fontWeight="bold" color="brand.rouge">{user?.prenom || "Artisan"}</Text>.
                        Gérez vos outils, suivez votre progression théorique et retrouvez vos découpes favorites.
                    </Text>
                </Box>

                {/* --- CONTENU PRINCIPAL --- */}
                <Flex direction={{ base: "column", md: "row" }} gap={8} align="start">
                    
                    {/* COLONNE GAUCHE : PROFIL */}
                    <Box 
                        as="aside" 
                        w={{ base: "100%", md: "30%" }} 
                        bg="white" 
                        p={8} 
                        borderRadius="md" 
                        shadow="md" 
                        borderWidth="1px" 
                        borderColor="brand.acier"
                    >
                        <VStack gap={5} align="center">
                            <Avatar.Root size="2xl" border="4px solid" borderColor="brand.beige">
                                <Avatar.Fallback 
                                    name={`${user?.prenom} ${user?.nom}`} 
                                    bg="brand.rouge" 
                                    color="white" 
                                />
                            </Avatar.Root>
                            
                            <VStack gap={1} textAlign="center">
                                <Heading as="h2" size="md" fontFamily="title" color="brand.rouge">
                                    {user?.prenom} {user?.nom}
                                </Heading>
                                <Text color="brand.acier" fontWeight="bold" fontSize="sm" textTransform="uppercase">
                                    {user?.nomRole || "Étudiant Boucher"}
                                </Text>
                            </VStack>

                            <VStack w="100%" gap={3} pt={4}>
                                <Button w="100%" bg="brand.brun" color="white" _hover={{ bg: "brand.rouge" }}>
                                    Modifier le profil
                                </Button>
                                <Button w="100%" variant="outline" borderColor="brand.rouge" color="brand.rouge">
                                    Calculateur métier
                                </Button>
                            </VStack>
                        </VStack>
                    </Box>

                    {/* COLONNE DROITE : ONGLETS */}
                    <Box as="main" flex="1">
                        <Tabs.Root defaultValue="activite" variant="enclosed">
                            <Tabs.List bg="white" borderRadius="md" borderWidth="1px" borderColor="brand.acier" p={1}>
                                <Tabs.Trigger value="activite" flex="1" fontFamily="title" _selected={{ color: "brand.rouge", bg: "brand.beige", fontWeight: "bold" }}>
                                    Mon Activité 📈
                                </Tabs.Trigger>
                                <Tabs.Trigger value="carnet" flex="1" fontFamily="title" _selected={{ color: "brand.rouge", bg: "brand.beige", fontWeight: "bold" }}>
                                    Mon Carnet 📗
                                </Tabs.Trigger>
                            </Tabs.List>

                            {/* ACTIVITÉ */}
                            <Tabs.Content value="activite" py={6}>
                                <VStack align="stretch" gap={6}>
                                    <Box>
                                        <Heading as="h3" size="sm" color="brand.gris" mb={3} borderBottomWidth="1px" borderColor="brand.acier" pb={2}>
                                            Derniers calculs
                                        </Heading>
                                        <Box bg="white" p={6} borderRadius="md" border="1px solid" borderColor="brand.acier" textAlign="center">
                                            <Text color="brand.acier" fontStyle="italic">Historique des calculs bientôt disponible.</Text>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Heading as="h3" size="sm" color="brand.gris" mb={3} borderBottomWidth="1px" borderColor="brand.acier" pb={2}>
                                            Derniers scores Quiz
                                        </Heading>
                                        <Box bg="white" p={6} borderRadius="md" border="1px solid" borderColor="brand.acier" textAlign="center">
                                            <Text color="brand.acier" fontStyle="italic">Historique des quiz bientôt disponible.</Text>
                                        </Box>
                                    </Box>
                                </VStack>
                            </Tabs.Content>

                            {/* FAVORIS */}
                            <Tabs.Content value="carnet" py={6}>
                                <VStack align="stretch" gap={8}>
                                    <Box>
                                        <Heading as="h3" size="sm" color="brand.gris" mb={4} borderBottomWidth="1px" borderColor="brand.acier" pb={2}>
                                            Recettes Favorites
                                        </Heading>
                                        {favorisRecettes.length === 0 ? (
                                            <Box bg="white" p={8} borderRadius="md" border="1px dashed" borderColor="brand.acier" textAlign="center">
                                                <Text color="brand.gris">Aucune recette enregistrée.</Text>
                                            </Box>
                                        ) : (
                                            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={6}>
                                                {favorisRecettes.map(recette => (
                                                    <RecetteCard key={recette.idRecette} recette={recette} onToggleFavori={handleToggleRecetteFavori} />
                                                ))}
                                            </SimpleGrid>
                                        )}
                                    </Box>
                                    <Box>
                                        <Heading as="h3" size="sm" color="brand.gris" mb={4} borderBottomWidth="1px" borderColor="brand.acier" pb={2}>
                                            Vidéos Techniques
                                        </Heading>
                                        {favorisRessources.length === 0 ? (
                                            <Box bg="white" p={8} borderRadius="md" border="1px dashed" borderColor="brand.acier" textAlign="center">
                                                <Text color="brand.gris">Aucune vidéo enregistrée.</Text>
                                            </Box>
                                        ) : (
                                            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={6}>
                                                {favorisRessources.map(video => (
                                                    <RessourceCard key={video.idRessource} ressource={video} onToggleFavori={handleToggleRessourceFavori} />
                                                ))}
                                            </SimpleGrid>
                                        )}
                                    </Box>
                                </VStack>
                            </Tabs.Content>
                        </Tabs.Root>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};

export default Dashboard;