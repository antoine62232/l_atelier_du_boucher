import React, { useState, useEffect } from "react";
import { Box, Container, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import { getAllPieces } from "../services/PiecesService";
import { createCalcul } from "../services/CalculsService";
import { toaster } from "../components/ui/toaster";

import CalculForm from "../components/labo/CalculForm";
import TicketResultat from "../components/labo/TicketResultat";

const LaboCalcul = () => {
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    titreCalcul: "",
    pieceId: "",
    poidsBrut: "",
    poidsNet: "",
    prixAchatKg: "",
    margeVisee: "30",
    tauxTva: "5.5", 
    commentaire: ""
  });

  useEffect(() => {
    const fetchPieces = async () => {
      try {
        const res = await getAllPieces();
        setPieces(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des pièces:", error);
      }
    };
    fetchPieces();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveToDashboard = async () => {
    if (!localStorage.getItem("authToken")) {
        toaster.create({ type: "info", title: "Connectez-vous pour enregistrer ce calcul dans votre Établi." });
        return;
    }
    if (!formData.titreCalcul || !formData.pieceId || !formData.poidsBrut || !formData.poidsNet) {
        toaster.create({ type: "warning", title: "Il manque des informations.", description: "Renseignez le nom du test, la pièce et les deux poids." });
        return;
    }
    if (Number(formData.margeVisee) >= 100) {
        toaster.create({ type: "warning", title: "La marge visée doit être inférieure à 100 %." });
        return;
    }

    setLoading(true);
    try {
      await createCalcul(formData);
      toaster.create({ type: "success", title: "Calcul enregistré dans votre Établi." });
      setFormData({ ...formData, titreCalcul: "", poidsBrut: "", poidsNet: "", prixAchatKg: "", commentaire: "" });
    } catch (error) {
      toaster.create({ type: "error", title: "Le calcul n'a pas pu être enregistré.", description: error.response?.data?.error || "Vérifiez votre connexion puis réessayez." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt={{ base: "120px", md: "140px" }} pb="84px">
      <Container maxW="1200px" px={{ base: 4, md: 6 }}>
        
        <Box textAlign="center" mb={{ base: 8, md: 12 }}>
            <Heading as="h1" fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
                Le Labo Calcul
            </Heading>
            <Text color="brand.gris" fontSize="md" maxW="600px" mx="auto">
                Saisissez vos données de découpe pour analyser votre rentabilité et fixer vos prix de vente en temps réel.
            </Text>
        </Box>
        
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={{ base: 6, lg: 10 }} alignItems="start">
            
            {/* L'enfant qui gère la saisie */}
            <CalculForm 
                formData={formData} 
                handleChange={handleChange} 
                pieces={pieces} 
            />

            {/* L'enfant qui gère l'affichage des résultats et le bouton de sauvegarde */}
            <TicketResultat 
                formData={formData} 
                onSave={handleSaveToDashboard} 
                isLoading={loading} 
            />

        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default LaboCalcul;