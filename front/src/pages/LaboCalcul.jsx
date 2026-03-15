import React, { useState, useEffect } from "react";
import { Box, Container, Heading, Text, Flex, VStack, SimpleGrid, Button, Input, Textarea } from "@chakra-ui/react"; // 👈 Plus de Divider ici !
import { getAllPieces } from "../services/PiecesService";
import { createCalcul } from "../services/CalculsService";

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

  const pb = parseFloat(formData.poidsBrut) || 0;
  const pn = parseFloat(formData.poidsNet) || 0;
  const pa = parseFloat(formData.prixAchatKg) || 0;
  const mv = parseFloat(formData.margeVisee) || 0;
  const tva = parseFloat(formData.tauxTva) || 0;

  let perte = 0, rendement = 0, prixRevient = 0, prixVenteHt = 0, prixVenteTtc = 0;

  if (pb > 0 && pn > 0 && pn <= pb) {
    perte = pb - pn;
    rendement = (pn / pb) * 100;
    prixRevient = (pb * pa) / pn;
    if (mv < 100) {
      prixVenteHt = prixRevient / (1 - mv / 100);
      prixVenteTtc = prixVenteHt * (1 + (tva / 100));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCalcul(formData);
      setSuccessMessage("Votre test de rendement a été enregistré avec succès !");
      setFormData({ ...formData, titreCalcul: "", poidsBrut: "", poidsNet: "", prixAchatKg: "", commentaire: "" });
    } catch (error) {
      alert("Erreur: " + (error.response?.data?.message || "Impossible d'enregistrer le calcul. Vérifiez que vous êtes connecté."));
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
            {/* Partie gauche : Formulaire */}
            <Box bg="white" p={8} borderRadius="xl" boxShadow="md" as="form" onSubmit={handleSubmit}>
                <VStack spacing={5} align="stretch">
                    <Heading size="md" color="brand.brun" mb={2}>Données de la pièce</Heading>
                    
                    {successMessage && (
                        <Box bg="green.100" color="green.800" p={3} borderRadius="md" textAlign="center" fontWeight="bold">
                            {successMessage}
                        </Box>
                    )}
                    
                    <Input placeholder="Nom de ce test (ex: Test Paleron génisse)" name="titreCalcul" value={formData.titreCalcul} onChange={handleChange} focusBorderColor="brand.rouge" isRequired />
                    
                    <Box 
                        as="select" name="pieceId" value={formData.pieceId} onChange={handleChange} required
                        w="100%" h="40px" px={3} border="1px solid" borderColor="gray.300" borderRadius="md" bg="white" cursor="pointer"
                    >
                        <option value="">Sélectionnez la pièce travaillée</option>
                        {pieces.map(p => (
                            <option key={p.idPiece} value={p.idPiece}>{p.nomPiece}</option>
                        ))}
                    </Box>

                    <Flex gap={4}>
                        <Box w="100%">
                            <Text fontSize="sm" color="gray.600" mb={1}>Poids Brut (kg)</Text>
                            <Input type="number" step="0.001" name="poidsBrut" value={formData.poidsBrut} onChange={handleChange} focusBorderColor="brand.rouge" isRequired />
                        </Box>
                        <Box w="100%">
                            <Text fontSize="sm" color="gray.600" mb={1}>Prix d'Achat brut (€/kg)</Text>
                            <Input type="number" step="0.01" name="prixAchatKg" value={formData.prixAchatKg} onChange={handleChange} focusBorderColor="brand.rouge" isRequired />
                        </Box>
                    </Flex>

                    <Flex gap={4}>
                        <Box w="100%">
                            <Text fontSize="sm" color="gray.600" mb={1}>Poids Net après parage (kg)</Text>
                            <Input type="number" step="0.001" name="poidsNet" value={formData.poidsNet} onChange={handleChange} focusBorderColor="brand.rouge" isRequired />
                        </Box>
                    </Flex>

                    <Box borderBottom="1px solid" borderColor="gray.300" w="100%" my={2} />

                    <Heading size="md" color="brand.brun" mb={2}>Objectifs Commerciaux</Heading>

                    <Flex gap={4}>
                        <Box w="100%">
                            <Text fontSize="sm" color="gray.600" mb={1}>Marge Visée (%)</Text>
                            <Input type="number" step="1" name="margeVisee" value={formData.margeVisee} onChange={handleChange} focusBorderColor="brand.rouge" isRequired />
                        </Box>
                        <Box w="100%">
                            <Text fontSize="sm" color="gray.600" mb={1}>Taux TVA (%)</Text>
                            <Box 
                                as="select" name="tauxTva" value={formData.tauxTva} onChange={handleChange}
                                w="100%" h="40px" px={3} border="1px solid" borderColor="gray.300" borderRadius="md" bg="white" cursor="pointer"
                            >
                                <option value="5.5">5.5 % (Alimentaire)</option>
                                <option value="20">20 % (Standard)</option>
                            </Box>
                        </Box>
                    </Flex>

                    <Textarea placeholder="Notes ou observations sur ce test..." name="commentaire" value={formData.commentaire} onChange={handleChange} focusBorderColor="brand.rouge" />

                    <Button type="submit" bg="brand.rouge" color="white" _hover={{ bg: "brand.brun" }} size="lg" mt={4} isLoading={loading}>
                        Enregistrer le Test
                    </Button>
                </VStack>
            </Box>

            {/* Partie droite : Résultats */}
            <Box bg="#fdfbf7" p={8} borderRadius="md" boxShadow="xl" border="1px solid #e2e8f0" position="relative">
                <Box position="absolute" top="-10px" left="0" right="0" height="20px" bgImage="radial-gradient(circle, transparent 10px, #fdfbf7 11px)" bgSize="20px 20px" />

                <VStack spacing={4} align="stretch" fontFamily="mono">
                    <Box textAlign="center" mb={4}>
                        <Heading fontFamily="title" color="brand.brun" size="lg">TICKET D'ANALYSE</Heading>
                        <Text fontSize="sm" color="gray.500" mt={1}>L'Atelier du Boucher</Text>
                    </Box>
                    
                    <Box borderBottom="1px dashed" borderColor="gray.400" w="100%" />

                    <Flex justify="space-between">
                        <Text color="gray.600">Poids Brut :</Text>
                        <Text fontWeight="bold">{pb > 0 ? pb.toFixed(3) : "0.000"} kg</Text>
                    </Flex>
                    <Flex justify="space-between">
                        <Text color="gray.600">Poids Net :</Text>
                        <Text fontWeight="bold">{pn > 0 ? pn.toFixed(3) : "0.000"} kg</Text>
                    </Flex>
                    <Flex justify="space-between" color="red.500">
                        <Text>Perte (Déchets/Os) :</Text>
                        <Text fontWeight="bold">{perte > 0 ? perte.toFixed(3) : "0.000"} kg</Text>
                    </Flex>

                    <Box borderBottom="1px dashed" borderColor="gray.400" w="100%" />

                    <Flex justify="space-between" align="center" bg="gray.100" p={2} borderRadius="md">
                        <Text fontWeight="bold" color="brand.brun">RENDEMENT :</Text>
                        <Text fontWeight="bold" fontSize="xl" color="brand.rouge">{rendement > 0 ? rendement.toFixed(2) : "0.00"} %</Text>
                    </Flex>

                    <Box borderBottom="1px dashed" borderColor="gray.400" w="100%" />

                    <Flex justify="space-between">
                        <Text color="gray.600">Prix d'achat brut :</Text>
                        <Text fontWeight="bold">{pa > 0 ? pa.toFixed(2) : "0.00"} €/kg</Text>
                    </Flex>
                    <Flex justify="space-between" color="brand.brun">
                        <Text fontWeight="bold">PRIX DE REVIENT :</Text>
                        <Text fontWeight="bold">{prixRevient > 0 ? prixRevient.toFixed(2) : "0.00"} €/kg</Text>
                    </Flex>

                    <Box borderBottom="1px dashed" borderColor="gray.400" w="100%" />

                    <Flex justify="space-between">
                        <Text color="gray.600">Prix Vente (HT) :</Text>
                        <Text fontWeight="bold">{prixVenteHt > 0 ? prixVenteHt.toFixed(2) : "0.00"} €/kg</Text>
                    </Flex>
                    <Flex justify="space-between" align="center" bg="green.50" border="1px solid" borderColor="green.200" p={3} borderRadius="md" mt={2}>
                        <Text fontWeight="bold" color="green.700">PRIX VENTE (TTC):</Text>
                        <Text fontWeight="bold" fontSize="2xl" color="green.700">{prixVenteTtc > 0 ? prixVenteTtc.toFixed(2) : "0.00"} €</Text>
                    </Flex>
                    <Text textAlign="right" fontSize="xs" color="gray.500">*Marge de {mv}%</Text>

                </VStack>
            </Box>

        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default LaboCalcul;