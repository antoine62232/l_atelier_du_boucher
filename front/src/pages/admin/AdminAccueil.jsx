import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, SimpleGrid, Text, Flex, Icon, Button, Skeleton } from "@chakra-ui/react";
import { FiFileText, FiUsers, FiBookOpen, FiHelpCircle, FiPlus } from "react-icons/fi";
import AdminEntete from "../../components/admin/AdminEntete";
import { getAllActualites } from "../../services/ActualitesService";
import { getAllUsers } from "../../services/UsersService";
import { getAllRecettes } from "../../services/RecettesService";
import api from "../../api/api";
import { getUtilisateurConnecte } from "../../utils/auth";

const CarteStat = ({ label, valeur, icone, chargement }) => (
  <Box bg="white" borderRadius="xl" p={6} boxShadow="sm" border="1px solid" borderColor="blackAlpha.100">
    <Flex justify="space-between" align="center">
      <Box>
        <Text fontSize="sm" color="gray.500">{label}</Text>
        {chargement ? (
          <Skeleton h="36px" w="60px" mt={1} />
        ) : (
          <Text fontSize="3xl" fontWeight="bold" color="brand.gris">{valeur ?? "-"}</Text>
        )}
      </Box>
      <Flex bg="brand.beige" color="brand.rouge" borderRadius="lg" p={3}>
        <Icon as={icone} boxSize={6} />
      </Flex>
    </Flex>
  </Box>
);

const compter = async (requete) => {
  try {
    const reponse = await requete();
    return Array.isArray(reponse.data) ? reponse.data.length : null;
  } catch {
    return null;
  }
};

const AdminAccueil = () => {
  const user = getUtilisateurConnecte();
  const [stats, setStats] = useState({});
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const charger = async () => {
      const [actualites, utilisateurs, recettes, faq] = await Promise.all([
        compter(getAllActualites),
        compter(getAllUsers),
        compter(getAllRecettes),
        compter(() => api.get("/faq/all")),
      ]);
      setStats({ actualites, utilisateurs, recettes, faq });
      setChargement(false);
    };
    charger();
  }, []);

  return (
    <>
      <AdminEntete
        titre={`Bonjour ${user?.prenom ?? ""}`}
        description="Vue d'ensemble du contenu de L'Atelier du Boucher."
      >
        <Button asChild bg="brand.rouge" color="white" _hover={{ opacity: 0.9 }}>
          <RouterLink to="/admin/actualites/nouvelle">
            <FiPlus /> Publier une actualité
          </RouterLink>
        </Button>
      </AdminEntete>

      <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} gap={6}>
        <CarteStat label="Actualités" valeur={stats.actualites} icone={FiFileText} chargement={chargement} />
        <CarteStat label="Utilisateurs" valeur={stats.utilisateurs} icone={FiUsers} chargement={chargement} />
        <CarteStat label="Recettes" valeur={stats.recettes} icone={FiBookOpen} chargement={chargement} />
        <CarteStat label="Questions FAQ" valeur={stats.faq} icone={FiHelpCircle} chargement={chargement} />
      </SimpleGrid>
    </>
  );
};

export default AdminAccueil;
