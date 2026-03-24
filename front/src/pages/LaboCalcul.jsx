import React, { useState, useEffect } from "react";
import { Box, Container, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import { getAllPieces } from "../services/PiecesService";
import { createCalcul } from "../services/CalculsService";

import CalculForm from "../components/labo/CalculForm";
import TicketResultat from "../components/labo/TicketResultat";

const LaboCalcul = () => {
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
    setSuccessMessage(""); 
  };

  const handleSaveToDashboard = async () => {
    if (!formData.titreCalcul || !formData.pieceId || !formData.poidsBrut || !formData.poidsNet) {
        alert("Veuillez remplir les champs obligatoires (Titre, Pièce, Poids) avant d'enregistrer.");
        return;
    }

    setLoading(true);
    try {
      await createCalcul(formData);
      setSuccessMessage("Votre ticket a été enregistré dans votre Établi avec succès !");
      setFormData({ ...formData, titreCalcul: "", poidsBrut: "", poidsNet: "", prixAchatKg: "", commentaire: "" });
    } catch (error) {
      alert("Erreur: " + (error.response?.data?.message || "Impossible d'enregistrer le calcul."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt="140px" pb="84px">
      <Container maxW="1200px" px={6}>
        
        <Box textAlign="center" mb={12}>
            <Heading fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
                Le Labo Calcul
            </Heading>
            <Text color="brand.gris" fontSize="md" maxW="600px" mx="auto">
                Saisissez vos données de découpe pour analyser votre rentabilité et fixer vos prix de vente en temps réel.
            </Text>
        </Box>
        
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={10} alignItems="start">
            
            {/* L'enfant qui gère la saisie */}
            <CalculForm 
                formData={formData} 
                handleChange={handleChange} 
                pieces={pieces} 
                successMessage={successMessage} 
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