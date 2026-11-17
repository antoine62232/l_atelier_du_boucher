import React, { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Badge, Box, Button, Container, Flex, Heading, SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
import {
  FiArrowRight,
  FiBookOpen,
  FiBox,
  FiClock,
  FiHelpCircle,
  FiMapPin,
  FiPercent,
  FiPlay,
  FiRefreshCw,
  FiUsers,
} from "react-icons/fi";
import api from "../api/api";
import FilAriane from "../components/atlas/FilAriane";
import ImageAvecSecours from "../components/ImageAvecSecours";
import { getImageUrl } from "../utils/imageUtils";
import { getYoutubeMiniature } from "../utils/videos";
import { QUARTIERS, cheminFichePiece, situerPartie } from "../data/atlasBoeuf";
import { COULEUR_ARRIERE, COULEUR_AVANT } from "../data/coupesBoeuf";

const COULEURS_QUARTIER = { avant: COULEUR_AVANT, arriere: COULEUR_ARRIERE };

const lireListe = (resultat) => (resultat.status === "fulfilled" && Array.isArray(resultat.value.data) ? resultat.value.data : []);

const chargerDonnees = async () => {
  const [pieces, parties, ressources, recettes, questions, reponses] = await Promise.allSettled([
    api.get("/pieces/all"),
    api.get("/parties/all"),
    api.get("/ressources/all"),
    api.get("/recettes/all"),
    api.get("/questions/all"),
    api.get("/reponses-qcm/all"),
  ]);
  if (pieces.status !== "fulfilled") return null;
  const listeReponses = lireListe(reponses);
  return {
    pieces: lireListe(pieces),
    parties: lireListe(parties),
    ressources: lireListe(ressources),
    recettes: lireListe(recettes),
    // Une question sans réponses enregistrées ne peut pas être posée : on ne la compte pas.
    questions: lireListe(questions).filter((q) => listeReponses.some((r) => r.questionId === q.idQuestion)),
  };
};

const Section = ({ id, icone, titre, sousTitre, children }) => (
  <Box as="section" id={id} aria-labelledby={`titre-${id}`} scrollMarginTop="110px" mb={{ base: 10, md: 12 }}>
    <Flex align="center" gap={3} mb={sousTitre ? 1 : 4}>
      <Flex w="40px" h="40px" rounded="full" bg="white" boxShadow="carte" color="brand.rouge" align="center" justify="center" flexShrink={0}>
        {React.createElement(icone, { "aria-hidden": true })}
      </Flex>
      <Heading as="h2" id={`titre-${id}`} fontFamily="title" fontSize={{ base: "xl", md: "2xl" }} color="brand.gris">
        {titre}
      </Heading>
    </Flex>
    {sousTitre && (
      <Text color="gray.600" fontSize="sm" mb={4} ml="52px">
        {sousTitre}
      </Text>
    )}
    {children}
  </Box>
);

const TuileRaccourci = ({ href, icone, label, detail, pleineLargeur }) => (
  <Box
    gridColumn={pleineLargeur ? { base: "span 2", sm: "auto" } : undefined}
    as="a"
    href={href}
    display="flex"
    flexDirection="column"
    gap={1}
    minH="88px"
    p={4}
    bg="white"
    rounded="xl"
    boxShadow="carte"
    transition="transform 0.15s ease, box-shadow 0.15s ease"
    _hover={{ boxShadow: "carteSurvol", transform: "translateY(-2px)" }}
    _focusVisible={{ outline: "3px solid", outlineColor: "brand.brun", outlineOffset: "2px" }}
  >
    <Box color="brand.rouge" fontSize="xl">
      {React.createElement(icone, { "aria-hidden": true })}
    </Box>
    <Text fontWeight="bold" color="brand.gris" lineHeight="1.2">
      {label}
    </Text>
    {detail && (
      <Text fontSize="xs" color="gray.600">
        {detail}
      </Text>
    )}
  </Box>
);

const CarteLien = ({ to, children }) => (
  <Box
    asChild
    display="flex"
    flexDirection="column"
    bg="white"
    rounded="xl"
    overflow="hidden"
    boxShadow="carte"
    transition="transform 0.15s ease, box-shadow 0.15s ease"
    _hover={{ boxShadow: "carteSurvol", transform: "translateY(-2px)" }}
    _focusVisible={{ outline: "3px solid", outlineColor: "brand.brun", outlineOffset: "2px" }}
  >
    <RouterLink to={to}>{children}</RouterLink>
  </Box>
);

const pluriel = (n, mot) => `${n} ${mot}${n > 1 ? "s" : ""}`;

const FichePiece = () => {
  const { id } = useParams();
  const idPiece = Number(id);
  const [donnees, setDonnees] = useState(null);
  const [etat, setEtat] = useState("chargement");

  // Toutes les listes sont chargées une fois : passer d'une pièce voisine à l'autre est instantané.
  const [essai, setEssai] = useState(0);
  useEffect(() => {
    let actif = true;
    chargerDonnees().then((resultat) => {
      if (!actif) return;
      setDonnees(resultat);
      setEtat(resultat ? "pret" : "erreur");
    });
    return () => {
      actif = false;
    };
  }, [essai]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [idPiece]);

  const reessayer = () => {
    setEtat("chargement");
    setEssai((n) => n + 1);
  };


  const vue = useMemo(() => {
    if (!donnees) return null;
    const piece = donnees.pieces.find((p) => p.idPiece === idPiece);
    if (!piece) return null;
    const lieu = situerPartie(piece.partieId, donnees.parties);
    return {
      piece,
      lieu,
      videos: donnees.ressources.filter((r) => r.pieceId === idPiece),
      recettes: donnees.recettes.filter((r) => r.pieceId === idPiece),
      questions: donnees.questions.filter((q) => q.pieceId === idPiece),
      voisines: donnees.pieces.filter((p) => p.partieId === piece.partieId && p.idPiece !== idPiece),
    };
  }, [donnees, idPiece]);

  useEffect(() => {
    if (vue) document.title = `${vue.piece.nomPiece} | L'Atelier du Boucher`;
    return () => {
      document.title = "L'Atelier du Boucher";
    };
  }, [vue]);

  if (etat === "chargement") {
    return (
      <Box bg="brand.fond" minH="100vh" pt={{ base: "120px", md: "140px" }} pb={10}>
        <Container maxW="1100px" px={{ base: 4, md: 6 }} role="status" aria-label="Chargement de la fiche">
          <Skeleton h="20px" w="60%" mb={6} />
          <Flex direction={{ base: "column", md: "row" }} gap={6}>
            <Skeleton h={{ base: "220px", md: "300px" }} flex="1" rounded="2xl" />
            <Box flex="1.3">
              <Skeleton h="40px" w="70%" mb={4} />
              <Skeleton h="80px" mb={4} />
              <Skeleton h="60px" />
            </Box>
          </Flex>
        </Container>
      </Box>
    );
  }

  if (etat === "erreur" || !vue) {
    return (
      <Box bg="brand.fond" minH="70vh" pt={{ base: "120px", md: "140px" }} pb={10}>
        <Container maxW="640px" px={4} textAlign="center">
          <Heading as="h1" fontFamily="title" color="brand.rouge" fontSize="2xl" mb={3}>
            {etat === "erreur" ? "La fiche n'a pas pu être chargée" : "Cette pièce n'existe pas"}
          </Heading>
          <Text color="gray.700" mb={6}>
            {etat === "erreur"
              ? "Le serveur ne répond pas pour le moment. Vérifiez votre connexion puis réessayez."
              : "Elle a peut-être été renommée ou retirée de l'Atlas."}
          </Text>
          <Flex gap={3} justify="center" wrap="wrap">
            {etat === "erreur" && (
              <Button onClick={reessayer} bg="brand.rouge" color="white" rounded="full" px={6} _hover={{ bg: "brand.rougeFonce" }}>
                <FiRefreshCw aria-hidden="true" /> Réessayer
              </Button>
            )}
            <Button asChild variant="outline" rounded="full" px={6} borderColor="gray.300" color="brand.gris">
              <RouterLink to="/atlas/boeuf">Retour à l'Atlas</RouterLink>
            </Button>
          </Flex>
        </Container>
      </Box>
    );
  }

  const { piece, lieu, videos, recettes, questions, voisines } = vue;
  const quartier = lieu?.quartier ? QUARTIERS[lieu.quartier] : null;
  const couleur = lieu?.quartier ? COULEURS_QUARTIER[lieu.quartier] : "#B87333";

  const etapes = [{ label: "Atlas", to: "/atlas" }, { label: "Le Bœuf", to: "/atlas/boeuf" }];
  if (quartier) etapes.push({ label: quartier.label, to: quartier.chemin });
  if (lieu?.parent) etapes.push({ label: lieu.parent.nomPartie, to: lieu.chemin.replace(/\/\d+$/, "") });
  if (lieu?.partie) etapes.push({ label: lieu.partie.nomPartie, to: lieu.chemin });
  etapes.push({ label: piece.nomPiece, to: "#" });

  const lienSchema = lieu?.schema ? `${lieu.chemin}?pieceId=${piece.idPiece}` : lieu?.chemin;

  const raccourcis = [
    { href: "#reperer", icone: FiMapPin, label: "Repérer", detail: lieu?.partie?.nomPartie },
    videos.length > 0 && { href: "#travailler", icone: FiPlay, label: "Travailler", detail: pluriel(videos.length, "vidéo") },
    recettes.length > 0 && { href: "#cuisiner", icone: FiBookOpen, label: "Cuisiner", detail: pluriel(recettes.length, "recette") },
    questions.length > 0 && { href: "#entrainer", icone: FiHelpCircle, label: "S'entraîner", detail: pluriel(questions.length, "question") },
    { href: "#calculer", icone: FiPercent, label: "Calculer", detail: "Rendement et prix" },
  ].filter(Boolean);

  return (
    <Box bg="brand.fond" minH="100vh" pt={{ base: "120px", md: "140px" }} pb={{ base: 10, md: 16 }}>
      <Container maxW="1100px" px={{ base: 4, md: 6 }}>
        <FilAriane etapes={etapes} />

        {/* En-tête de la pièce */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 5, md: 8 }}
          bg="white"
          rounded="2xl"
          boxShadow="carte"
          p={{ base: 4, md: 6 }}
          mb={6}
          borderTop="6px solid"
          borderColor={couleur}
        >
          <Box flex="1" bg="brand.creme" rounded="xl" overflow="hidden" minH={{ base: "200px", md: "280px" }}>
            <ImageAvecSecours
              src={piece.imagePiece ? getImageUrl(`pieces/${piece.imagePiece}`) : null}
              alt={`${piece.nomPiece}, pièce de bœuf`}
              w="100%"
              h={{ base: "220px", md: "300px" }}
              objectFit="contain"
              p={3}
            />
          </Box>

          <Flex flex="1.3" direction="column" gap={4}>
            <Flex gap={2} wrap="wrap" align="center">
              {quartier && (
                <Badge bg={couleur} color="white" rounded="full" px={3} py={1} fontSize="xs">
                  {quartier.label}
                </Badge>
              )}
              {lieu?.partie && (
                <Badge bg="brand.beige" color="brand.gris" rounded="full" px={3} py={1} fontSize="xs">
                  {lieu.partie.nomPartie}
                </Badge>
              )}
            </Flex>
            <Heading as="h1" fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "4xl" }} lineHeight="1.1">
              {piece.nomPiece}
            </Heading>
            {piece.descriptionPiece && (
              <Text color="gray.700" lineHeight="1.7">
                {piece.descriptionPiece}
              </Text>
            )}
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3} mt="auto">
              {piece.utilisation && (
                <Box bg="brand.creme" rounded="lg" p={3}>
                  <Text fontSize="xs" fontWeight="bold" color="brand.brun" textTransform="uppercase" letterSpacing="wide">
                    Utilisation
                  </Text>
                  <Text color="brand.gris" fontWeight="medium">
                    {piece.utilisation}
                  </Text>
                </Box>
              )}
              {piece.cuisson && (
                <Box bg="brand.creme" rounded="lg" p={3}>
                  <Text fontSize="xs" fontWeight="bold" color="brand.brun" textTransform="uppercase" letterSpacing="wide">
                    Cuisson
                  </Text>
                  <Text color="brand.gris" fontWeight="medium">
                    {piece.cuisson}
                  </Text>
                </Box>
              )}
            </SimpleGrid>
          </Flex>
        </Flex>

        {/* Raccourcis vers chaque section */}
        <Box as="nav" aria-label="Sections de la fiche" mb={{ base: 10, md: 12 }}>
          <SimpleGrid columns={{ base: 2, sm: 3, md: raccourcis.length }} gap={3}>
            {raccourcis.map((r, i) => (
              <TuileRaccourci key={r.href} {...r} pleineLargeur={raccourcis.length % 2 === 1 && i === raccourcis.length - 1} />
            ))}
          </SimpleGrid>
        </Box>

        <Section id="reperer" icone={FiMapPin} titre="Repérer la pièce">
          <Text color="gray.700" mb={4}>
            {lieu?.partie
              ? `Pièce de la partie « ${lieu.partie.nomPartie} »${quartier ? `, dans ${quartier.label === "L'Avant" ? "l'avant" : "l'arrière"} de la carcasse` : ""}.`
              : "L'emplacement de cette pièce n'est pas encore renseigné."}
          </Text>
          <Flex gap={3} wrap="wrap">
            {lienSchema && (
              <Button asChild bg="brand.rouge" color="white" rounded="full" px={5} _hover={{ bg: "brand.rougeFonce" }}>
                <RouterLink to={lienSchema}>
                  <FiMapPin aria-hidden="true" /> {lieu.schema ? "Voir sur le schéma" : `Voir ${lieu.partie.nomPartie}`}
                </RouterLink>
              </Button>
            )}
            {lieu?.quartier && (
              <Button asChild variant="outline" rounded="full" px={5} borderColor="gray.300" color="brand.gris" bg="white">
                <RouterLink to={`/atlas/boeuf?partie=${lieu.quartier}`}>
                  <FiBox aria-hidden="true" /> {quartier.label} en 3D
                </RouterLink>
              </Button>
            )}
          </Flex>
        </Section>

        {videos.length > 0 && (
          <Section id="travailler" icone={FiPlay} titre="Travailler la pièce" sousTitre="Désossage, parage et préparation en vidéo.">
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
              {videos.map((v) => (
                <CarteLien key={v.idRessource} to={`/videos?video=${v.idRessource}`}>
                  <Box position="relative" bg="brand.gris" aspectRatio={16 / 9}>
                    <ImageAvecSecours src={getYoutubeMiniature(v.urlVideo)} alt="" w="100%" h="100%" objectFit="cover" />
                    <Flex position="absolute" inset="0" align="center" justify="center">
                      <Flex w="52px" h="52px" rounded="full" bg="rgba(138, 28, 37, 0.92)" color="white" align="center" justify="center" fontSize="xl">
                        <FiPlay aria-hidden="true" />
                      </Flex>
                    </Flex>
                  </Box>
                  <Box p={4}>
                    {v.typeTechnique && (
                      <Badge bg="brand.beige" color="brand.brun" rounded="full" px={2} mb={2} fontSize="xs">
                        {v.typeTechnique}
                      </Badge>
                    )}
                    <Text fontWeight="bold" color="brand.gris" lineHeight="1.3">
                      {v.titre}
                    </Text>
                  </Box>
                </CarteLien>
              ))}
            </SimpleGrid>
          </Section>
        )}

        {recettes.length > 0 && (
          <Section id="cuisiner" icone={FiBookOpen} titre="Cuisiner la pièce" sousTitre="Des recettes à conseiller au client.">
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
              {recettes.map((r) => (
                <CarteLien key={r.idRecette} to={`/recettes/${r.idRecette}`}>
                  <Box bg="brand.beige" h="180px" overflow="hidden">
                    <ImageAvecSecours
                      src={r.imageRecette ? getImageUrl(`recettes/${r.imageRecette}`) : null}
                      alt=""
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  </Box>
                  <Box p={4}>
                    <Text fontWeight="bold" color="brand.gris" lineHeight="1.3" mb={2}>
                      {r.titre}
                    </Text>
                    <Flex gap={4} color="gray.600" fontSize="sm">
                      <Flex align="center" gap={1}>
                        <FiClock aria-hidden="true" /> {Number(r.tempsPreparation) + Number(r.tempsCuisson)} min
                      </Flex>
                      <Flex align="center" gap={1}>
                        <FiUsers aria-hidden="true" /> {r.nbPersonnes} pers.
                      </Flex>
                    </Flex>
                  </Box>
                </CarteLien>
              ))}
            </SimpleGrid>
          </Section>
        )}

        {questions.length > 0 && (
          <Section id="entrainer" icone={FiHelpCircle} titre="S'entraîner">
            <Flex
              direction={{ base: "column", sm: "row" }}
              align={{ base: "stretch", sm: "center" }}
              justify="space-between"
              gap={4}
              bg="white"
              rounded="xl"
              boxShadow="carte"
              p={{ base: 4, md: 5 }}
            >
              <Text color="gray.700">
                {pluriel(questions.length, "question")} pour vérifier que vous connaissez {piece.nomPiece.toLowerCase()}.
              </Text>
              <Button asChild bg="brand.rouge" color="white" rounded="full" px={6} flexShrink={0} _hover={{ bg: "brand.rougeFonce" }}>
                <RouterLink to={`/quiz?pieceId=${piece.idPiece}`}>
                  Lancer le quiz <FiArrowRight aria-hidden="true" />
                </RouterLink>
              </Button>
            </Flex>
          </Section>
        )}

        <Section id="calculer" icone={FiPercent} titre="Calculer le rendement">
          <Flex
            direction={{ base: "column", sm: "row" }}
            align={{ base: "stretch", sm: "center" }}
            justify="space-between"
            gap={4}
            bg="white"
            rounded="xl"
            boxShadow="carte"
            p={{ base: 4, md: 5 }}
          >
            <Text color="gray.700">
              Poids brut, poids net après parage, prix d'achat : obtenez le rendement, le prix de revient et le prix de vente conseillé.
            </Text>
            <Button asChild bg="brand.rouge" color="white" rounded="full" px={6} flexShrink={0} _hover={{ bg: "brand.rougeFonce" }}>
              <RouterLink to={`/outils?pieceId=${piece.idPiece}`}>
                Calculer <FiArrowRight aria-hidden="true" />
              </RouterLink>
            </Button>
          </Flex>
        </Section>

        {voisines.length > 0 && lieu?.partie && (
          <Box as="section" aria-labelledby="titre-voisines">
            <Heading as="h2" id="titre-voisines" fontFamily="title" fontSize="xl" color="brand.gris" mb={4}>
              Dans la même partie : {lieu.partie.nomPartie}
            </Heading>
            <Flex gap={2} wrap="wrap">
              {voisines.map((v) => (
                <Button
                  key={v.idPiece}
                  asChild
                  variant="outline"
                  rounded="full"
                  px={4}
                  bg="white"
                  borderColor="gray.300"
                  color="brand.gris"
                  _hover={{ bg: "brand.beige" }}
                >
                  <RouterLink to={cheminFichePiece(v.idPiece)}>{v.nomPiece}</RouterLink>
                </Button>
              ))}
            </Flex>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FichePiece;
