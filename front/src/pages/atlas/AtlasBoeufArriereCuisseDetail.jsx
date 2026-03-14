import React, { useState, useEffect } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Container, Heading, Text, Button, VStack, Flex, Breadcrumb, Spinner, Center } from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import api from "../../api/api"; // Vérifiez votre chemin d'import

// Vos composants réutilisables adorés
import InteractiveDiagram from "../../components/atlas/InteractiveDiagram";
import AtlasDetails from "../../components/atlas/AtlasDetails";

const AtlasBoeufArriereCuisseDetail = () => {
  const { id } = useParams(); // On récupère l'ID depuis l'URL (ex: /cuisse/10)
  const navigate = useNavigate();

  const [partie, setPartie] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vue unique (pas d'intérieur/extérieur pour ces sous-parties)
  const currentFace = "unique";
  const setCurrentFace = () => {};

  // 📍 LE DICTIONNAIRE DES POSITIONS DES MORCEAUX
  // Comme on a tout regroupé sur une seule page dynamique, on liste les positions
  // de tous les morceaux finaux possibles ici. 
  // ⚠️ Les clés doivent correspondre aux noms exacts de votre table `piece` !
  const configPiecesPositions = {
    // Morceaux de la Semelle
    "Gîte à la noix": { top: "40%", left: "60%", face: "unique" },
    "Rond de gîte": { top: "60%", left: "40%", face: "unique" },
    // Morceaux du Rumsteck
    "Cœur de rumsteck": { top: "30%", left: "50%", face: "unique" },
    "Aiguillette baronne": { top: "70%", left: "30%", face: "unique" },
    "Aiguillette de rumsteck": { top: "60%", left: "70%", face: "unique" },
    "Filet": { top: "80%", left: "80%", face: "unique" },
    // Morceaux de la Tende de tranche
    "Cœur de tende de tranche": { top: "30%", left: "40%", face: "unique" },
    "Dessus de tranche": { top: "50%", left: "70%", face: "unique" },
    "Poire": { top: "20%", left: "20%", face: "unique" },
    "Merlan de cuisse": { top: "80%", left: "50%", face: "unique" },
    "Araignée": { top: "15%", left: "80%", face: "unique" },
    // Morceaux de la Tranche
    "Plat de tranche": { top: "40%", left: "30%", face: "unique" },
    "Mouvant de tranche": { top: "60%", left: "50%", face: "unique" },
    "Rond de tranche": { top: "80%", left: "40%", face: "unique" },
    // Morceaux du Jarret
    "Jarret arrière avec os": { top: "40%", left: "50%", face: "unique" },
    "Jarret arrière sans os": { top: "60%", left: "50%", face: "unique" },
    "Nerveux de gîte": { top: "80%", left: "60%", face: "unique" }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. On récupère les infos de la sous-partie (ex: Semelle)
        const resPartie = await api.get(`/parties/${id}`);
        const dataPartie = Array.isArray(resPartie.data) ? resPartie.data[0] : resPartie.data;
        
        // 2. On récupère les morceaux (pièces) rattachés à cette sous-partie
        const resPieces = await api.get(`/pieces/partie/${id}`);
        
        // 3. On fusionne les données de la BDD avec nos positions manuelles
        const piecesAvecPositions = resPieces.data.map(piece => {
            const config = configPiecesPositions[piece.nomPiece];
            return config ? { ...piece, ...config } : { ...piece, top: "50%", left: "50%", face: "unique" };
        });

        setPartie(dataPartie);
        setPieces(piecesAvecPositions);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des détails :", error);
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const getImageUrl = (path) => {
      if (!path) return undefined;
      const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
      return `${baseUrl}/uploads/${path}`;
  };

  if (loading) {
      return (
          <Box bg="brand.beige" minH="100vh" pt="140px"><Center><Spinner size="xl" color="brand.rouge" /></Center></Box>
      );
  }

  if (!partie) {
      return (
          <Box bg="brand.beige" minH="100vh" pt="140px"><Center><Text>Partie introuvable.</Text></Center></Box>
      );
  }

  const currentBackgroundImage = getImageUrl(`parties/${partie.imagePartie}`);

  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt="140px" pb="40px">
      <Container maxW="1360px" px={6}>
        
        {/* EN-TÊTE & FIL D'ARIANE */}
        <VStack align="start" spacing="12px" mb={10}>
             <Breadcrumb.Root color="gray.500" fontSize="sm">
                <Breadcrumb.List>
                    <Breadcrumb.Item><Breadcrumb.Link as={RouterLink} to="/atlas/boeuf">Le Bœuf</Breadcrumb.Link></Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item><Breadcrumb.Link as={RouterLink} to="/atlas/boeuf/arriere">L'Arrière</Breadcrumb.Link></Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item><Breadcrumb.Link as={RouterLink} to="/atlas/boeuf/arriere/cuisse">Cuisse & Hanche</Breadcrumb.Link></Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item><Breadcrumb.CurrentLink color="brand.rouge" fontWeight="medium">{partie.nomPartie}</Breadcrumb.CurrentLink></Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
            <Button 
                onClick={() => navigate(-1)} // Retourne dynamiquement à la page précédente
                variant="outline" borderColor="brand.brun" color="brand.brun" borderRadius="full" bg="white" 
                _hover={{ bg: "brand.brun", color: "white" }} size="md" px={8} fontSize="sm"
            >
                <FiArrowLeft style={{ marginRight: "8px" }} /> Retour à la Cuisse
            </Button>
        </VStack>

        <Box textAlign="center" mb="40px">
            <Heading fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
                {partie.nomPartie}
            </Heading>
            <Text color="brand.gris" fontSize="md">
                {partie.descriptionPartie || "Cliquez sur une pièce pour voir les détails et les recettes."}
            </Text>
        </Box>

        {/* CONTENU PRINCIPAL (Diagramme + Détails) */}
        <Flex direction={{ base: "column", lg: "row" }} gap={10} justify="center" align="start">
            
            {/* DIAGRAMME INTERACTIF (GAUCHE) */}
            <InteractiveDiagram 
                currentFace={currentFace}
                setCurrentFace={setCurrentFace}
                currentBackgroundImage={currentBackgroundImage}
                visiblePieces={pieces}
                selectedPiece={selectedPiece}
                onSelectPiece={setSelectedPiece}
                enableSwitch={false} // Désactivé car on a qu'une seule face
                customHeight={{ base: "400px", lg: "600px" }} 
            />
            
            {/* DÉTAILS DE LA PIÈCE (DROITE) */}
            <Box w={{ base: "100%", lg: "400px" }}>
                <AtlasDetails 
                    selectedPiece={selectedPiece} 
                    getImageUrl={getImageUrl} 
                />
            </Box>

        </Flex>
      </Container>
    </Box>
  );
};

export default AtlasBoeufArriereCuisseDetail;