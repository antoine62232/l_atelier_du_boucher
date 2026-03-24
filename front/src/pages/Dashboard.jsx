// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
    Box, Flex, VStack, Heading, Text, Tabs, Avatar,
    Spinner, Center, SimpleGrid, Container
} from '@chakra-ui/react';

// Import des services
import * as UsersService from '../services/UsersService';
import * as RecettesService from '../services/RecettesService';
import * as RessourcesService from '../services/RessourcesService';
import * as CalculsService from '../services/CalculsService';
import * as QuizService from '../services/QuizService';

// Import des cartes
import RecetteCard from '../components/dashboard/RecetteCard';
import RessourceCard from '../components/dashboard/RessourceCard';
import CalculCard from '../components/dashboard/CalculCard';
import ScoreCard from '../components/dashboard/ScoreCard';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [favorisRecettes, setFavorisRecettes] = useState([]);
    const [favorisRessources, setFavorisRessources] = useState([]);
    const [mesCalculs, setMesCalculs] = useState([]);
    const [mesScores, setMesScores] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Récupération des infos de base
                const [userRes, recipesRes, videosRes] = await Promise.all([
                    UsersService.getProfile(),
                    RecettesService.getFavoris(),
                    RessourcesService.getFavoris()
                ]);

                const userData = userRes.data?.user || userRes.data || userRes;
                setUser(userData);
                setFavorisRecettes(recipesRes.data || recipesRes);
                setFavorisRessources(videosRes.data || videosRes);

                // 2. Récupération des calculs et scores avec l'ID utilisateur
                const userId = userData.id || userData.idUtilisateur || userData.utilisateurId;
                
                if (userId) {
                    const [calculsRes, scoresRes] = await Promise.all([
                        CalculsService.getCalculsByUser(userId),
                        QuizService.getMesScores()
                    ]);
                    
                    setMesCalculs(calculsRes.data || calculsRes);
                    setMesScores(scoresRes.data || scoresRes);
                }

            } catch (err) {
                console.error("Erreur dashboard:", err);
                setError("Impossible de charger les données de votre établi.");
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

    const handleDeleteCalcul = async (idCalcul) => {
        try {
            await CalculsService.deleteCalcul(idCalcul);
            setMesCalculs(prev => prev.filter(c => c.idCalcul !== idCalcul));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
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
        <Box bg="brand.beige" minH="calc(100vh - 100px)" pt="140px" pb="84px">
            <Container maxW="1200px" px={6}>
                
                <Box textAlign="center" mb={12}>
                    <Heading fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
                        Mon Établi
                    </Heading>
                    <Text color="gray.600" fontSize="md" maxW="600px" mx="auto">
                        Bienvenue, <Text as="span" fontWeight="bold" color="brand.rouge">{user?.prenom || "Artisan"}</Text>. 
                        Gérez vos outils et retrouvez tous vos enregistrements.
                    </Text>
                </Box>

                <Flex direction={{ base: "column", md: "row" }} gap={8} align="start">
                    
                    {/* COLONNE GAUCHE : PROFIL */}
                    <Box as="aside" w={{ base: "100%", md: "250px" }} bg="white" p={8} borderRadius="md" shadow="md" borderWidth="1px" borderColor="brand.acier">
                        <VStack gap={5} align="center">
                            <Avatar.Root size="2xl" border="4px solid" borderColor="brand.beige">
                                <Avatar.Fallback name={`${user?.prenom} ${user?.nom}`} bg="brand.rouge" color="white" />
                            </Avatar.Root>
                            <VStack gap={1} textAlign="center">
                                <Heading as="h2" size="md" fontFamily="title" color="brand.rouge">
                                    {user?.prenom} {user?.nom}
                                </Heading>
                                <Text color="brand.acier" fontWeight="bold" fontSize="sm" textTransform="uppercase">
                                    {user?.nomRole || "Étudiant Boucher"}
                                </Text>
                            </VStack>
                        </VStack>
                    </Box>

                    {/* COLONNE DROITE : LES 4 ONGLETS */}
                    <Box as="main" flex="1">
                        <Tabs.Root defaultValue="calculs">
                            <Tabs.List bg="white" borderRadius="md" borderWidth="1px" borderColor="brand.acier" p={1} mb={6} display="flex" flexWrap="wrap">
                                <Tabs.Trigger value="calculs" flex="1" fontFamily="title" _selected={{ color: "brand.rouge", bg: "brand.beige" }}>
                                    Calculs 🧮
                                </Tabs.Trigger>
                                <Tabs.Trigger value="quiz" flex="1" fontFamily="title" _selected={{ color: "brand.rouge", bg: "brand.beige" }}>
                                    Quiz 🏆
                                </Tabs.Trigger>
                                <Tabs.Trigger value="recettes" flex="1" fontFamily="title" _selected={{ color: "brand.rouge", bg: "brand.beige" }}>
                                    Recettes 🍳
                                </Tabs.Trigger>
                                <Tabs.Trigger value="videos" flex="1" fontFamily="title" _selected={{ color: "brand.rouge", bg: "brand.beige" }}>
                                    Vidéos 🎥
                                </Tabs.Trigger>
                            </Tabs.List>

                            {/* 1. ONGLET CALCULS */}
                            <Tabs.Content value="calculs">
                                <Box>
                                    <Heading as="h3" size="sm" color="brand.gris" mb={4} borderBottomWidth="1px" borderColor="brand.acier" pb={2}>
                                        Historique des Rendements
                                    </Heading>
                                    {mesCalculs.length === 0 ? (
                                        <Center p={10} bg="white" borderRadius="md" border="1px dashed" borderColor="brand.acier">
                                            <Text color="gray.500" fontStyle="italic">Aucun calcul enregistré.</Text>
                                        </Center>
                                    ) : (
                                        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                                            {mesCalculs.map(calcul => (
                                                <CalculCard key={calcul.idCalcul} calcul={calcul} onDelete={handleDeleteCalcul} />
                                            ))}
                                        </SimpleGrid>
                                    )}
                                </Box>
                            </Tabs.Content>

                            {/* 2. ONGLET QUIZ */}
                            <Tabs.Content value="quiz">
                                <VStack align="stretch" gap={10}>
                                    
                                    <Box>
                                        <Heading as="h3" size="sm" color="brand.gris" mb={4} borderBottomWidth="1px" borderColor="brand.acier" pb={2}>
                                            Mes Compétences
                                        </Heading>
                                        <Box bg="white" p={6} borderRadius="md" border="1px solid" borderColor="brand.acier" boxShadow="sm">
                                            <VStack align="stretch" gap={5}>
                                                <Box>
                                                    <Flex justify="space-between" mb={1}>
                                                        <Text fontSize="sm" fontWeight="bold" color="brand.brun">Anatomie & Découpe</Text>
                                                        <Text fontSize="sm" color="green.600" fontWeight="bold">85%</Text>
                                                    </Flex>
                                                    <Box w="100%" bg="gray.100" h="8px" borderRadius="full" overflow="hidden">
                                                        <Box w="85%" h="100%" bg="green.400" transition="all 1s ease-out" />
                                                    </Box>
                                                </Box>

                                                <Box>
                                                    <Flex justify="space-between" mb={1}>
                                                        <Text fontSize="sm" fontWeight="bold" color="brand.brun">Hygiène & Sécurité</Text>
                                                        <Text fontSize="sm" color="brand.rouge" fontWeight="bold">40%</Text>
                                                    </Flex>
                                                    <Box w="100%" bg="gray.100" h="8px" borderRadius="full" overflow="hidden">
                                                        <Box w="40%" h="100%" bg="brand.rouge" transition="all 1s ease-out" />
                                                    </Box>
                                                </Box>
                                            </VStack>
                                        </Box>
                                    </Box>

                                    <Box>
                                        <Heading as="h3" size="sm" color="brand.gris" mb={4} borderBottomWidth="1px" borderColor="brand.acier" pb={2}>
                                            Historique des Tests
                                        </Heading>
                                        
                                        {mesScores.length === 0 ? (
                                            <Center p={10} bg="white" borderRadius="md" border="1px dashed" borderColor="brand.acier">
                                                <Text color="gray.500" fontStyle="italic">Vous n'avez pas encore passé de quiz.</Text>
                                            </Center>
                                        ) : (
                                            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                                {mesScores.map(score => (
                                                    <ScoreCard 
                                                        key={score.idResultat} 
                                                        quiz={{ 
                                                            titre: "Le Test de l'Apprenti", 
                                                            score: score.score, 
                                                            total: score.total, 
                                                            date: score.datePassage 
                                                        }} 
                                                    />
                                                ))}
                                            </SimpleGrid>
                                        )}
                                    </Box>
                                </VStack>
                            </Tabs.Content>

                            {/* 3. ONGLET RECETTES */}
                            <Tabs.Content value="recettes">
                                <Box>
                                    <Heading as="h3" size="sm" color="brand.gris" mb={4} borderBottomWidth="1px" borderColor="brand.acier" pb={2}>
                                        Mes Recettes Favorites
                                    </Heading>
                                    {favorisRecettes.length === 0 ? (
                                        <Center p={10} bg="white" borderRadius="md" border="1px dashed" borderColor="brand.acier">
                                            <Text color="gray.500" fontStyle="italic">Aucune recette enregistrée.</Text>
                                        </Center>
                                    ) : (
                                        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={6}>
                                            {favorisRecettes.map(recette => (
                                                <RecetteCard key={recette.idRecette} recette={recette} onToggleFavori={handleToggleRecetteFavori} />
                                            ))}
                                        </SimpleGrid>
                                    )}
                                </Box>
                            </Tabs.Content>

                            {/* 4. ONGLET VIDÉOS */}
                            <Tabs.Content value="videos">
                                <Box>
                                    <Heading as="h3" size="sm" color="brand.gris" mb={4} borderBottomWidth="1px" borderColor="brand.acier" pb={2}>
                                        Mes Vidéos Techniques
                                    </Heading>
                                    {favorisRessources.length === 0 ? (
                                        <Center p={10} bg="white" borderRadius="md" border="1px dashed" borderColor="brand.acier">
                                            <Text color="gray.500" fontStyle="italic">Aucune vidéo enregistrée.</Text>
                                        </Center>
                                    ) : (
                                        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={6}>
                                            {favorisRessources.map(video => (
                                                <RessourceCard key={video.idRessource} ressource={video} onToggleFavori={handleToggleRessourceFavori} />
                                            ))}
                                        </SimpleGrid>
                                    )}
                                </Box>
                            </Tabs.Content>
                        </Tabs.Root>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};

export default Dashboard;