import React, { Suspense, useRef, useState } from "react";
import FilAriane from "../../components/atlas/FilAriane";
import { Box, Container, Heading, Text, Flex, Spinner, Button, SimpleGrid } from "@chakra-ui/react";
import { COUPES_BOEUF, COULEUR_AVANT, COULEUR_ARRIERE } from "../../data/coupesBoeuf";
import { morceauxDuQuartier } from "../../data/zonesBoeuf";
import { useNavigate, useSearchParams } from "react-router-dom";
import { lazyAvecRechargement } from "../../utils/lazyAvecRechargement";


const Carcasse3D = lazyAvecRechargement(() => import("../../components/atlas/Carcasse3D"));


const PARTIES = {
  avant: {
    titre: "L'Avant (CAPA)",
    description: "Morceaux savoureux à mijoter : collier, épaule, plat de côtes, poitrine…",
  },
  arriere: {
    titre: "L'Arrière (ART 8)",
    description: "Morceaux nobles à rôtir ou griller : entrecôte, faux-filet, rumsteck, tende de tranche…",
  },
};

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

  const carcasseRef = useRef(null);
  const [searchParams] = useSearchParams();
  const partieDemandee = ["avant", "arriere"].includes(searchParams.get("partie")) ? searchParams.get("partie") : null;
  const [partie, setPartie] = useState(null);
  const [morceauActif, setMorceauActif] = useState(null);

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
                Touchez l'avant ou l'arrière de la demi-carcasse pour zoomer dessus, puis un gros morceau pour le voir seul. Faites-la pivoter pour observer la face de fente et l'extérieur.
            </Text>
        </Box>

        <Box maxW="900px" mx="auto" mb={{ base: 12, md: 16 }}>
            <Box mb={4}>
                <Text id="titre-coupes" fontWeight="bold" color="brand.gris" mb={2} textAlign={{ base: "left", md: "center" }}>
                    Afficher une coupe de gros
                </Text>
                <Flex role="radiogroup" aria-labelledby="titre-coupes" gap={2} wrap="wrap" justify={{ base: "flex-start", md: "center" }}>
                    {[{ id: null, sigle: "Aucune", nom: "Aucune coupe" }, ...COUPES_BOEUF].map((c) => {
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
                                {c.sousTitre && (
                                    <Text as="span" fontSize="xs" fontWeight="normal" opacity={0.85}>
                                        {c.sousTitre}
                                    </Text>
                                )}
                            </Button>
                        );
                    })}
                </Flex>
            </Box>

            <Suspense
                fallback={
                    <Box position="relative" h={{ base: "68vh", md: "620px" }} minH="440px" bg="brand.creme" borderRadius="2xl" boxShadow="carte" overflow="hidden">
                        <Box as="img" src="/models/demi_carcasse_boeuf_apercu.webp" alt="" aria-hidden="true" position="absolute" top="0" left="50%" h="100%" w="auto" maxW="none" transform="translateX(-50%)" />
                        <Flex position="absolute" bottom={4} left="50%" transform="translateX(-50%)" align="center" gap={2} bg="white" rounded="full" boxShadow="carte" px={4} py={2} role="status">
                            <Spinner size="sm" color="brand.rouge" />
                            <Text color="brand.gris" fontSize="sm" whiteSpace="nowrap">Préparation de la 3D…</Text>
                        </Flex>
                    </Box>
                }
            >
                <Carcasse3D
                    ref={carcasseRef}
                    coupe={coupe}
                    parties={PARTIES}
                    onSelection={setPartie}
                    onMorceau={setMorceauActif}
                    partieInitiale={partieDemandee}
                    onExplorer={(p) => navigate(`/atlas/boeuf/${p}`)}
                    onExplorerMorceau={(m) => navigate(m.chemin)}
                />
            </Suspense>

            <Flex mt={4} gap={3} justify="center" wrap="wrap" role="group" aria-label="Choisir une partie de la carcasse">
                {[
                    { id: "avant", couleur: COULEUR_AVANT },
                    { id: "arriere", couleur: COULEUR_ARRIERE },
                ].map(({ id, couleur }) => {
                    const actif = partie === id;
                    return (
                        <Button
                            key={id}
                            onClick={() => carcasseRef.current?.choisir(id)}
                            aria-pressed={actif}
                            rounded="full"
                            px={5}
                            variant="outline"
                            bg={actif ? couleur : "white"}
                            color={actif ? "white" : "brand.gris"}
                            borderColor={couleur}
                            borderWidth="2px"
                            _hover={{ bg: actif ? couleur : "brand.beige" }}
                        >
                            <Box w="12px" h="12px" borderRadius="sm" bg={actif ? "white" : couleur} aria-hidden="true" />
                            {PARTIES[id].titre}
                        </Button>
                    );
                })}
            </Flex>

            {partie && (
                <Flex mt={3} gap={2} justify="center" wrap="wrap" role="group" aria-label="Choisir un gros morceau">
                    {morceauxDuQuartier(partie).map((m) => {
                        const actif = morceauActif === m.id;
                        const couleur = partie === "avant" ? COULEUR_AVANT : COULEUR_ARRIERE;
                        return (
                            <Button
                                key={m.id}
                                onClick={() => carcasseRef.current?.choisirMorceau(m.id)}
                                onMouseEnter={() => carcasseRef.current?.survoler(m.id)}
                                onMouseLeave={() => carcasseRef.current?.survoler(null)}
                                onFocus={() => carcasseRef.current?.survoler(m.id)}
                                onBlur={() => carcasseRef.current?.survoler(null)}
                                aria-pressed={actif}
                                size="sm"
                                minH="44px"
                                rounded="full"
                                px={4}
                                variant="outline"
                                bg={actif ? couleur : "white"}
                                color={actif ? "white" : "brand.gris"}
                                borderColor={couleur}
                                _hover={{ bg: actif ? couleur : "brand.beige" }}
                            >
                                {m.nom}
                            </Button>
                        );
                    })}
                </Flex>
            )}

            {coupe && (
                <Box mt={5} aria-live="polite">
                    <Text fontWeight="bold" color="brand.rouge" fontFamily="title" fontSize="xl" mb={1}>
                        {coupe.nom}
                    </Text>
                    <Text color="gray.700" fontSize="sm" mb={3}>{coupe.resume}</Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        <CarteQuartier couleur={COULEUR_AVANT} titre={coupe.avant.titre} pieces={coupe.avant.pieces} />
                        <CarteQuartier couleur={COULEUR_ARRIERE} titre={coupe.arriere.titre} pieces={coupe.arriere.pieces} />
                    </SimpleGrid>
                    <Text fontSize="xs" color="gray.600" mt={3}>
                        Le trait blanc marque la séparation entre les deux quartiers, d'après les supports de découpe Interbev et Idele. Tracé indicatif sur le modèle 3D.
                    </Text>
                </Box>
            )}
        </Box>

      </Container>
    </Box>
  );
};

export default AtlasBoeuf;