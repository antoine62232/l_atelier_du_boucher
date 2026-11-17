import React, { Suspense, lazy, useState } from "react";
import FilAriane from "../../components/atlas/FilAriane";
import { Box, Container, Heading, Text, Flex, Image, Tooltip, Spinner, Button, SimpleGrid } from "@chakra-ui/react";
import { COUPES_BOEUF, COULEUR_AVANT, COULEUR_ARRIERE } from "../../data/coupesBoeuf";
import { useNavigate } from "react-router-dom";

import boeufAvantCut from "../../assets/boeuf_avant_cut.png";
import boeufArriereCut from "../../assets/boeuf_arriere_cut.png";

const Carcasse3D = lazy(() => import("../../components/atlas/Carcasse3D"));


const CarteQuartier = ({ couleur, titre, pieces }) => (
  <Box bg="white" borderRadius="xl" boxShadow="carte" p={{ base: 4, md: 5 }} borderLeft="6px solid" borderColor={couleur}>
    <Flex align="center" gap={2} mb={2}>
      <Box w="14px" h="14px" borderRadius="sm" bg={couleur} flexShrink={0} aria-hidden="true" />
      <Heading as="h3" fontFamily="title" fontSize="lg" color="brand.gris">{titre}</Heading>
    </Flex>
    <Text color="gray.700" fontSize="sm" lineHeight="1.6">{pieces}</Text>
  </Box>
);

const AtlasBoeuf = () => {
  const navigate = useNavigate();
  const [coupeId, setCoupeId] = useState(null);
  const coupe = COUPES_BOEUF.find((c) => c.id === coupeId) || null;

  const handleZoneClick = (zone) => {
    navigate(`/atlas/boeuf/${zone}`);
  };

  const commonStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    w: "100%",
    h: "auto",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    cursor: "pointer",
    _hover: {
        transform: "scale(1.08)",
        zIndex: 10,
        filter: "drop-shadow(0px 15px 25px rgba(0,0,0,0.3)) brightness(1.05)"
    }
  };

  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt={{ base: "120px", md: "140px" }} pb="40px">
      <Container maxW="1360px" px={{ base: 4, md: 6 }}>
        
        {/* En-tête */}
        <FilAriane
            etapes={[{ label: "Atlas", to: "/atlas" }, { label: "Le Bœuf", to: "#" }]}
        />

        <Box textAlign="center" mb={{ base: 6, md: 10 }}>
            <Heading as="h1" fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
                Le Bœuf : Anatomie & Découpe
            </Heading>
            <Text color="brand.gris" fontSize="md" maxW="640px" mx="auto">
                Faites pivoter la demi-carcasse sur elle-même pour observer la face de fente et l'extérieur.
            </Text>
        </Box>

        <Box maxW="900px" mx="auto" mb={{ base: 12, md: 16 }}>
            <Box mb={4}>
                <Text id="titre-coupes" fontWeight="bold" color="brand.gris" mb={2} textAlign={{ base: "left", md: "center" }}>
                    Afficher une coupe de gros
                </Text>
                <Flex role="radiogroup" aria-labelledby="titre-coupes" gap={2} wrap="wrap" justify={{ base: "flex-start", md: "center" }}>
                    {[{ id: null, sigle: "Aucune" }, ...COUPES_BOEUF].map((c) => {
                        const actif = coupeId === c.id;
                        return (
                            <Button
                                key={c.sigle}
                                role="radio"
                                aria-checked={actif}
                                title={c.nom}
                                onClick={() => setCoupeId(c.id)}
                                rounded="full"
                                px={4}
                                variant="outline"
                                bg={actif ? "brand.rouge" : "white"}
                                color={actif ? "white" : "brand.gris"}
                                borderColor={actif ? "brand.rouge" : "gray.300"}
                                _hover={{ bg: actif ? "brand.rougeFonce" : "brand.beige" }}
                            >
                                {c.sigle}
                            </Button>
                        );
                    })}
                </Flex>
            </Box>

            <Suspense
                fallback={
                    <Flex h={{ base: "68vh", md: "620px" }} minH="420px" align="center" justify="center" bg="brand.creme" borderRadius="2xl">
                        <Spinner size="lg" color="brand.rouge" aria-label="Chargement du modèle 3D" />
                    </Flex>
                }
            >
                <Carcasse3D coupe={coupe} />
            </Suspense>

            {coupe && (
                <Box mt={5} aria-live="polite">
                    <Text fontWeight="bold" color="brand.rouge" fontFamily="title" fontSize="xl" mb={3}>
                        {coupe.sigle} : {coupe.nom}
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        <CarteQuartier couleur={COULEUR_AVANT} titre={coupe.avant.titre} pieces={coupe.avant.pieces} />
                        <CarteQuartier couleur={COULEUR_ARRIERE} titre={coupe.arriere.titre} pieces={coupe.arriere.pieces} />
                    </SimpleGrid>
                    <Text fontSize="xs" color="gray.600" mt={3}>
                        Le trait blanc marque la séparation entre les deux quartiers. Positions indicatives sur le modèle 3D.
                    </Text>
                </Box>
            )}
        </Box>

        <Box textAlign="center" mb={{ base: 6, md: 10 }}>
            <Heading as="h2" fontFamily="title" color="brand.rouge" fontSize={{ base: "2xl", md: "3xl" }} mb={3}>
                Choisissez une partie
            </Heading>
            <Text color="brand.gris" fontSize="md">
                Touchez l'<strong>Arrière</strong> ou l'<strong>Avant</strong> de la carcasse pour explorer ses pièces.
            </Text>
        </Box>

        {/* 🥩 ZONE INTERACTIVE 🥩 */}
        <Flex justify="center" mb={10}>
            
            <Box position="relative" w="350px" h="600px">
                
                {/* 1. ARRIÈRE (Le HAUT) -> Tooltip à DROITE */}
                <Tooltip.Root 
                    positioning={{ placement: "right-start", flip: false, offset: { mainAxis: 10, crossAxis: 120 } }} 
                    openDelay={0} 
                    closeDelay={0}
                >
                    <Tooltip.Trigger asChild>
                        <Image 
                            src={boeufArriereCut}
                            alt="Arrière Boeuf"
                            onClick={() => handleZoneClick("arriere")}
                            {...commonStyle}
                            clipPath="inset(0 0 20% 0)" 
                        />
                    </Tooltip.Trigger>
                    
                    <Tooltip.Positioner>
                        <Tooltip.Content bg="brand.rouge" color="white" px={4} py={3} borderRadius="md" fontSize="sm">
                            <Tooltip.Arrow css={{ "--arrow-background": "var(--chakra-colors-brand-rouge)" }} />
                            <Text fontWeight="bold" fontSize="md" mb={1}>L'Arrière (ART 8)</Text>
                            <Text>Morceaux nobles à rôtir ou griller<br/>(Entrecôte, Rumsteck...)</Text>
                        </Tooltip.Content>
                    </Tooltip.Positioner>
                </Tooltip.Root>


                 {/* 2. AVANT (Le BAS) */}
                 <Tooltip.Root 

                    positioning={{ placement: "left-end", flip: false, offset: { mainAxis: 10, crossAxis: -100 } }} 
                    openDelay={0} 
                    closeDelay={0}
                >
                    <Tooltip.Trigger asChild>
                        <Image 
                            src={boeufAvantCut}
                            alt="Avant Boeuf"
                            onClick={() => handleZoneClick("avant")}
                            {...commonStyle}
                            clipPath="inset(40% 0 0 0)"
                        />
                    </Tooltip.Trigger>

                    <Tooltip.Positioner>
                        <Tooltip.Content bg="brand.brun" color="white" px={4} py={3} borderRadius="md" fontSize="sm">
                            <Tooltip.Arrow css={{ "--arrow-background": "var(--chakra-colors-brand-brun)" }} />
                            <Text fontWeight="bold" fontSize="md" mb={1}>L'Avant (CAPA)</Text>
                            <Text>Morceaux savoureux à mijoter<br/>(Collier, Épaule...)</Text>
                        </Tooltip.Content>
                    </Tooltip.Positioner>
                </Tooltip.Root>

            </Box>
        </Flex>

      </Container>
    </Box>
  );
};

export default AtlasBoeuf;