import { useEffect, useMemo, useRef, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  Box, Button, Field, Input, Textarea, Stack, Flex, Image, Text, Alert, Spinner, Center, SimpleGrid,
} from "@chakra-ui/react";
import { FiArrowLeft, FiUpload, FiX, FiImage } from "react-icons/fi";
import AdminEntete from "../../components/admin/AdminEntete";
import {
  getActualiteById, getAllActualites, createActualite, updateActualite,
} from "../../services/ActualitesService";
import { getImageActualite } from "../../utils/imageUtils";
import { messageErreurApi } from "../../utils/auth";

const FORMATS_ACCEPTES = ["image/jpeg", "image/png", "image/webp"];
const TAILLE_MAX = 5 * 1024 * 1024;
const CATEGORIES_PAR_DEFAUT = ["Filière", "Formation", "Réglementation", "Saison", "Événement", "Vie de l'Atelier"];

const VIDE = { titre: "", contenu: "", categorie: "", lienSource: "" };

const AdminActualiteForm = () => {
  const { id } = useParams();
  const modeEdition = Boolean(id);
  const navigate = useNavigate();
  const inputFichier = useRef(null);

  const [valeurs, setValeurs] = useState(VIDE);
  const [imageActuelle, setImageActuelle] = useState(null);
  const [fichier, setFichier] = useState(null);
  const [categories, setCategories] = useState(CATEGORIES_PAR_DEFAUT);
  const [erreurs, setErreurs] = useState({});
  const [erreurGlobale, setErreurGlobale] = useState(null);
  const [chargement, setChargement] = useState(modeEdition);
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    getAllActualites()
      .then((reponse) => {
        const existantes = reponse.data.map((a) => a.categorie).filter(Boolean);
        setCategories([...new Set([...CATEGORIES_PAR_DEFAUT, ...existantes])].sort((a, b) => a.localeCompare(b, "fr")));
      })
      .catch(() => {});

    if (!modeEdition) return;
    getActualiteById(id)
      .then((reponse) => {
        const a = reponse.data;
        setValeurs({ titre: a.titre, contenu: a.contenu, categorie: a.categorie, lienSource: a.lienSource ?? "" });
        setImageActuelle(a.imageActualite);
      })
      .catch((error) => setErreurGlobale(messageErreurApi(error, "Impossible de charger cette actualité.")))
      .finally(() => setChargement(false));
  }, [id, modeEdition]);

  const apercu = useMemo(() => (fichier ? URL.createObjectURL(fichier) : null), [fichier]);

  useEffect(() => {
    return () => {
      if (apercu) URL.revokeObjectURL(apercu);
    };
  }, [apercu]);

  const changer = (e) => {
    setValeurs({ ...valeurs, [e.target.name]: e.target.value });
    setErreurs({ ...erreurs, [e.target.name]: null });
  };

  const choisirFichier = (e) => {
    const choisi = e.target.files?.[0];
    e.target.value = "";
    if (!choisi) return;
    if (!FORMATS_ACCEPTES.includes(choisi.type)) {
      setErreurs({ ...erreurs, image: "Formats acceptés : JPG, PNG ou WebP." });
      return;
    }
    if (choisi.size > TAILLE_MAX) {
      setErreurs({ ...erreurs, image: "L'image dépasse 5 Mo." });
      return;
    }
    setErreurs({ ...erreurs, image: null });
    setFichier(choisi);
  };

  const valider = () => {
    const nouvelles = {};
    if (!valeurs.titre.trim()) nouvelles.titre = "Le titre est obligatoire.";
    else if (valeurs.titre.length > 200) nouvelles.titre = "200 caractères maximum.";
    if (!valeurs.categorie.trim()) nouvelles.categorie = "La catégorie est obligatoire.";
    else if (valeurs.categorie.length > 50) nouvelles.categorie = "50 caractères maximum.";
    if (!valeurs.contenu.trim()) nouvelles.contenu = "Le contenu est obligatoire.";
    if (valeurs.lienSource && !/^https?:\/\/\S+$/.test(valeurs.lienSource.trim())) {
      nouvelles.lienSource = "Le lien doit commencer par http:// ou https://";
    }
    setErreurs(nouvelles);
    return Object.keys(nouvelles).length === 0;
  };

  const envoyer = async (e) => {
    e.preventDefault();
    setErreurGlobale(null);
    if (!valider()) return;

    const formData = new FormData();
    formData.append("titre", valeurs.titre.trim());
    formData.append("contenu", valeurs.contenu.trim());
    formData.append("categorie", valeurs.categorie.trim());
    formData.append("lienSource", valeurs.lienSource.trim());
    if (fichier) formData.append("image", fichier);

    setEnvoi(true);
    try {
      if (modeEdition) {
        await updateActualite(id, formData);
      } else {
        await createActualite(formData);
      }
      navigate("/admin/actualites", {
        state: { succes: modeEdition ? "Actualité mise à jour." : "Actualité publiée sur le site." },
      });
    } catch (error) {
      setErreurGlobale(messageErreurApi(error, "L'enregistrement a échoué. Réessaie dans un instant."));
      setEnvoi(false);
    }
  };

  if (chargement) {
    return <Center h="300px"><Spinner size="lg" color="brand.rouge" /></Center>;
  }

  const imageAffichee = apercu || getImageActualite(imageActuelle);

  return (
    <>
      <Button asChild variant="ghost" size="sm" color="gray.600" mb={2} px={2}>
        <RouterLink to="/admin/actualites"><FiArrowLeft /> Retour aux actualités</RouterLink>
      </Button>

      <AdminEntete
        titre={modeEdition ? "Modifier l'actualité" : "Nouvelle actualité"}
        description={modeEdition ? "Les modifications sont visibles sur le site dès l'enregistrement." : "Elle apparaîtra sur la page d'accueil et dans le Coin des Actualités."}
      />

      {erreurGlobale && (
        <Alert.Root status="error" mb={6} borderRadius="md">
          <Alert.Indicator />
          <Alert.Title>{erreurGlobale}</Alert.Title>
        </Alert.Root>
      )}

      <Box as="form" onSubmit={envoyer} noValidate>
        <SimpleGrid columns={{ base: 1, xl: 3 }} gap={6}>
          <Box gridColumn={{ xl: "span 2" }} bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="blackAlpha.100" p={6}>
            <Stack gap={5}>
              <Field.Root required invalid={!!erreurs.titre}>
                <Field.Label>Titre <Field.RequiredIndicator /></Field.Label>
                <Input name="titre" value={valeurs.titre} onChange={changer} maxLength={200} placeholder="Ex. : Ouverture des inscriptions au CAP Boucher" />
                <Field.HelperText>{valeurs.titre.length}/200</Field.HelperText>
                <Field.ErrorText>{erreurs.titre}</Field.ErrorText>
              </Field.Root>

              <Field.Root required invalid={!!erreurs.categorie}>
                <Field.Label>Catégorie <Field.RequiredIndicator /></Field.Label>
                <Input name="categorie" value={valeurs.categorie} onChange={changer} maxLength={50} list="categories-actualites" placeholder="Choisir ou saisir une catégorie" />
                <datalist id="categories-actualites">
                  {categories.map((c) => <option key={c} value={c} />)}
                </datalist>
                <Field.ErrorText>{erreurs.categorie}</Field.ErrorText>
              </Field.Root>

              <Field.Root required invalid={!!erreurs.contenu}>
                <Field.Label>Contenu <Field.RequiredIndicator /></Field.Label>
                <Textarea name="contenu" value={valeurs.contenu} onChange={changer} minH="260px" placeholder="Texte de l'actualité" />
                <Field.ErrorText>{erreurs.contenu}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!erreurs.lienSource}>
                <Field.Label>Lien vers la source</Field.Label>
                <Input name="lienSource" value={valeurs.lienSource} onChange={changer} placeholder="https://" />
                <Field.HelperText>Facultatif. Article ou page officielle d'origine.</Field.HelperText>
                <Field.ErrorText>{erreurs.lienSource}</Field.ErrorText>
              </Field.Root>
            </Stack>
          </Box>

          <Stack gap={6} alignSelf="flex-start">
            <Box bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="blackAlpha.100" p={6}>
              <Text fontWeight="medium" mb={3}>Image</Text>
              <Box borderRadius="lg" overflow="hidden" bg="gray.50" border="1px dashed" borderColor={erreurs.image ? "red.400" : "gray.300"} h="180px" mb={3}>
                {imageAffichee ? (
                  <Image src={imageAffichee} alt="Aperçu de l'image" w="100%" h="100%" objectFit="cover" />
                ) : (
                  <Flex h="100%" direction="column" align="center" justify="center" color="gray.400" gap={2}>
                    <FiImage size={28} />
                    <Text fontSize="sm">Aucune image</Text>
                  </Flex>
                )}
              </Box>
              <input ref={inputFichier} type="file" accept={FORMATS_ACCEPTES.join(",")} onChange={choisirFichier} hidden />
              <Flex gap={2}>
                <Button flex="1" variant="outline" onClick={() => inputFichier.current?.click()}>
                  <FiUpload /> {imageAffichee ? "Remplacer" : "Choisir une image"}
                </Button>
                {fichier && (
                  <Button variant="ghost" onClick={() => setFichier(null)} aria-label="Annuler le choix">
                    <FiX />
                  </Button>
                )}
              </Flex>
              <Text fontSize="xs" color={erreurs.image ? "red.500" : "gray.500"} mt={2}>
                {erreurs.image || "JPG, PNG ou WebP, 5 Mo maximum."}
              </Text>
            </Box>

            <Button type="submit" bg="brand.rouge" color="white" size="lg" _hover={{ opacity: 0.9 }} loading={envoi} loadingText="Enregistrement">
              {modeEdition ? "Enregistrer les modifications" : "Publier l'actualité"}
            </Button>
          </Stack>
        </SimpleGrid>
      </Box>
    </>
  );
};

export default AdminActualiteForm;
