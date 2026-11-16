import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box, Table, Image, Text, Badge, Button, IconButton, Flex, Spinner, Center, Alert, Dialog, Portal, Input,
} from "@chakra-ui/react";
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiExternalLink } from "react-icons/fi";
import AdminEntete from "../../components/admin/AdminEntete";
import { getAllActualites, deleteActualite } from "../../services/ActualitesService";
import { getImageActualite } from "../../utils/imageUtils";
import { messageErreurApi } from "../../utils/auth";

const formaterDate = (date) =>
  new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

const Miniature = ({ image, titre }) => {
  const src = getImageActualite(image);
  if (!src) {
    return (
      <Flex w="64px" h="44px" bg="gray.100" borderRadius="md" align="center" justify="center" color="gray.400">
        <FiImage />
      </Flex>
    );
  }
  return <Image src={src} alt={titre} w="64px" h="44px" objectFit="cover" borderRadius="md" />;
};

const AdminActualites = () => {
  const [actualites, setActualites] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const location = useLocation();
  const [succes, setSucces] = useState(location.state?.succes ?? null);
  const [recherche, setRecherche] = useState("");
  const [aSupprimer, setASupprimer] = useState(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);

  const charger = async () => {
    try {
      const reponse = await getAllActualites();
      const triees = [...reponse.data].sort((a, b) => new Date(b.datePublication) - new Date(a.datePublication));
      setActualites(triees);
    } catch (error) {
      setErreur(messageErreurApi(error, "Impossible de charger les actualités."));
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  const confirmerSuppression = async () => {
    setSuppressionEnCours(true);
    setErreur(null);
    try {
      await deleteActualite(aSupprimer.idActualite);
      setActualites((liste) => liste.filter((a) => a.idActualite !== aSupprimer.idActualite));
      setSucces(`« ${aSupprimer.titre} » a été supprimée.`);
    } catch (error) {
      setErreur(messageErreurApi(error, "La suppression a échoué."));
    } finally {
      setSuppressionEnCours(false);
      setASupprimer(null);
    }
  };

  const filtre = recherche.trim().toLowerCase();
  const affichees = filtre
    ? actualites.filter((a) => a.titre.toLowerCase().includes(filtre) || a.categorie.toLowerCase().includes(filtre))
    : actualites;

  return (
    <>
      <AdminEntete titre="Actualités" description="Publiez, modifiez ou retirez les actualités affichées sur le site.">
        <Button asChild bg="brand.rouge" color="white" _hover={{ opacity: 0.9 }}>
          <RouterLink to="/admin/actualites/nouvelle">
            <FiPlus /> Nouvelle actualité
          </RouterLink>
        </Button>
      </AdminEntete>

      {succes && (
        <Alert.Root status="success" mb={6} borderRadius="md">
          <Alert.Indicator />
          <Alert.Title>{succes}</Alert.Title>
        </Alert.Root>
      )}
      {erreur && (
        <Alert.Root status="error" mb={6} borderRadius="md">
          <Alert.Indicator />
          <Alert.Title>{erreur}</Alert.Title>
        </Alert.Root>
      )}

      <Box bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="blackAlpha.100" overflow="hidden">
        <Box p={4} borderBottom="1px solid" borderColor="blackAlpha.100">
          <Input
            placeholder="Rechercher par titre ou catégorie"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            maxW="360px"
            bg="white"
          />
        </Box>

        {chargement ? (
          <Center h="200px"><Spinner size="lg" color="brand.rouge" /></Center>
        ) : affichees.length === 0 ? (
          <Center h="200px" flexDirection="column" gap={3}>
            <Text color="gray.500">
              {actualites.length === 0 ? "Aucune actualité publiée pour le moment." : "Aucun résultat pour cette recherche."}
            </Text>
          </Center>
        ) : (
          <Table.ScrollArea>
            <Table.Root size="md" interactive>
              <Table.Header>
                <Table.Row bg="gray.50">
                  <Table.ColumnHeader w="80px">Image</Table.ColumnHeader>
                  <Table.ColumnHeader>Titre</Table.ColumnHeader>
                  <Table.ColumnHeader>Catégorie</Table.ColumnHeader>
                  <Table.ColumnHeader>Publiée le</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {affichees.map((actu) => (
                  <Table.Row key={actu.idActualite}>
                    <Table.Cell><Miniature image={actu.imageActualite} titre={actu.titre} /></Table.Cell>
                    <Table.Cell maxW="380px">
                      <Text fontWeight="medium" color="brand.gris" lineClamp={2}>{actu.titre}</Text>
                    </Table.Cell>
                    <Table.Cell><Badge colorPalette="red" variant="subtle">{actu.categorie}</Badge></Table.Cell>
                    <Table.Cell color="gray.600" whiteSpace="nowrap">{formaterDate(actu.datePublication)}</Table.Cell>
                    <Table.Cell>
                      <Flex justify="flex-end" gap={1}>
                        <IconButton asChild aria-label="Voir sur le site" variant="ghost" size="sm" color="gray.600">
                          <RouterLink to={`/actualites/${actu.idActualite}`} target="_blank"><FiExternalLink /></RouterLink>
                        </IconButton>
                        <IconButton asChild aria-label="Modifier" variant="ghost" size="sm" color="brand.gris">
                          <RouterLink to={`/admin/actualites/${actu.idActualite}`}><FiEdit2 /></RouterLink>
                        </IconButton>
                        <IconButton
                          aria-label="Supprimer"
                          variant="ghost"
                          size="sm"
                          color="red.600"
                          onClick={() => { setSucces(null); setASupprimer(actu); }}
                        >
                          <FiTrash2 />
                        </IconButton>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        )}
      </Box>

      <Dialog.Root open={!!aSupprimer} onOpenChange={(e) => !e.open && !suppressionEnCours && setASupprimer(null)} placement="center" role="alertdialog">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="xl" mx={4}>
              <Dialog.Header>
                <Dialog.Title>Supprimer cette actualité ?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  « {aSupprimer?.titre} » sera retirée du site et son image sera effacée. Cette action est définitive.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={() => setASupprimer(null)} disabled={suppressionEnCours}>
                  Annuler
                </Button>
                <Button colorPalette="red" onClick={confirmerSuppression} loading={suppressionEnCours}>
                  Supprimer
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default AdminActualites;
