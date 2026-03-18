import React, { useState, useEffect } from 'react';
import { 
    Box, Flex, Heading, Text, Button, VStack, Container, 
    Group, Input, Icon, Spinner, Badge 
} from "@chakra-ui/react";
import heroImage from "../../assets/imageHero.png";
import { PiMagnifyingGlassThin } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                // On interroge maintenant la route globale "search"
                const response = await fetch(`${import.meta.env.VITE_API_URL}/search?q=${query}`);
                if (response.ok) {
                    const data = await response.json();
                    
                    // On fusionne les pièces et les termes en un seul grand tableau
                    const combinedResults = [
                        ...(data.pieces || []), 
                        ...(data.termes || [])
                    ];
                    
                    setResults(combinedResults);
                    setShowDropdown(true);
                }
            } catch (error) {
                console.error("Erreur lors de la recherche globale:", error);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        if (e.target.value === "") {
            setShowDropdown(false);
        }
    };

    // Fonction pour gérer le clic sur un résultat
    const handleResultClick = (item) => {
        if (item.type === 'piece') {

            let cheminCible = '/atlas'; 
            
            if (item.partieId === 1) cheminCible = '/atlas/boeuf/avant/epaule';
            else if (item.partieId === 2) cheminCible = '/atlas/boeuf/avant/collier';
            else if (item.partieId === 3) cheminCible = '/atlas/boeuf/arriere/cuisse';

            // On navigue vers la bonne page ET on ajoute l'ID de la pièce à l'URL !
            // Le résultat donnera par exemple : /atlas/boeuf/avant/epaule?pieceId=14
            navigate(`${cheminCible}?pieceId=${item.id}`);
            
        } else {
            setQuery(item.titre);
            setShowDropdown(false);
        }
    };

    return (
        <Box as="section" position="relative" w="100%" h="100vh" zIndex="0" overflow="hidden">
            <Box
                position="absolute" top="0" left="0" w="100%" h="100%"
                backgroundImage={`url(${heroImage})`} backgroundSize="cover" backgroundPosition="center"
            >
                <Box
                    position="absolute" top="0" left="0" w="100%" h="100%"
                    bg="blackAlpha.400" bgGradient="to-b" gradientFrom="rgba(0, 0, 0, 0.3)" gradientTo="rgba(0, 0, 0, 0.6)"
                />
            </Box>

            <Flex h="100%" justify="center" align="center" position="relative" px={4}>
                <Container maxW="1360px">
                    <VStack gap={0} align="center" textAlign="center" w="100%" mt="100px">
                        <Heading
                            as="h1" color="white" fontSize="48px" fontWeight="bold" fontFamily="title"
                            lineHeight="1.2" textTransform="uppercase" textShadow="0px 4px 20px rgba(0, 0, 0, 0.5)" mb="12px"
                        >
                            L'ATLAS DE L'ARTISAN BOUCHER
                        </Heading>

                        <Box w="524px" maxW="100%" h="1px" bg="white" mb="24px" />

                        <Text color="white" fontFamily="body" fontSize="16px" maxW="534px" textShadow="0px 2px 10px rgba(0,0,0,0.5)" mb="46px">
                            Plongez dans l'anatomie, maîtrisez la découpe et perfectionnez votre savoir-faire avec l'Atlas Numérique du Boucher.
                        </Text>

                        <Box position="relative" w="660px" maxW="100%">
                            <Group attached w="100%">
                                <Input 
                                    flex="1" placeholder="Rechercher une pièce, une technique, un outil..."
                                    _placeholder={{ color: "#AAAAAA" }} bg="white" color="brand.gris"
                                    height="60px" border="none" borderLeftRadius="8px" borderRightRadius="0px"
                                    fontSize="16px" pl={6} value={query} onChange={handleInputChange} autoComplete="off"
                                />
                                <Button
                                    bg="brand.brun" variant="outline" height="60px" width="60px"
                                    border="none" borderRightRadius="8px" borderLeftRadius="0px" _hover={{ bg: "brand.rouge" }}
                                >
                                    {isSearching ? <Spinner color="white" size="sm" /> : <Icon as={PiMagnifyingGlassThin} color="white" boxSize="30px" />}
                                </Button>
                            </Group>

                            {/* LE DROPDOWN MULTI-RÉSULTATS */}
                            {showDropdown && (
                                <Box 
                                    position="absolute" top="100%" left={0} w="100%" bg="white" mt={2} 
                                    borderRadius="lg" boxShadow="2xl" maxH="400px" overflowY="auto" zIndex={10} textAlign="left"
                                >
                                    {results.length > 0 ? (
                                        <Box w="100%">
                                            {results.map((item, index) => (
                                                <Box 
                                                    key={`${item.type}-${item.id}`} // Clé unique combinée
                                                    p={4} 
                                                    borderBottom={index !== results.length - 1 ? "1px solid" : "none"} 
                                                    borderColor="gray.100"
                                                    _hover={{ bg: "gray.50", cursor: "pointer" }}
                                                    transition="background 0.2s"
                                                    onClick={() => handleResultClick(item)}
                                                >
                                                    <Flex justify="space-between" align="center" mb={1}>
                                                        <Text fontWeight="bold" color="brand.rouge" fontSize="lg">
                                                            {item.titre}
                                                        </Text>
                                                        {/* Affichage dynamique du badge selon le type */}
                                                        {item.type === 'piece' ? (
                                                            <Badge colorScheme="red" variant="solid">Pièce de viande</Badge>
                                                        ) : (
                                                            <Badge colorScheme="orange" variant="subtle">Lexique</Badge>
                                                        )}
                                                    </Flex>
                                                    
                                                    {item.description && (
                                                        <Text color="gray.600" fontSize="sm" lineHeight="1.5">
                                                            {item.description}
                                                        </Text>
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Box p={6} textAlign="center">
                                            <Text color="gray.500">Aucun résultat trouvé pour "{query}".</Text>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Box>

                    </VStack>
                </Container>
            </Flex>
        </Box>
    );
};

export default Hero;