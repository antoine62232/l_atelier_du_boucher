import React from "react";
import { Box, VStack, Heading, Input, Flex, Text, Textarea } from "@chakra-ui/react";

// Formulaire de saisie pour les calculs en labo
const CalculForm = ({ formData, handleChange, pieces, successMessage }) => {
  return (
    <Box bg="white" p={8} borderRadius="xl" boxShadow="md" as="form" onSubmit={(e) => e.preventDefault()}>
      <VStack spacing={5} align="stretch">
        <Heading size="md" color="brand.brun" mb={2}>Données de la pièce</Heading>
        
        {successMessage && (
            <Box bg="green.100" color="green.800" p={3} borderRadius="md" textAlign="center" fontWeight="bold">
                {successMessage}
            </Box>
        )}
        
        <Input placeholder="Nom de ce test (ex: Test Paleron génisse)" name="titreCalcul" value={formData.titreCalcul} onChange={handleChange} required />
        
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
                <Input type="number" step="0.001" name="poidsBrut" value={formData.poidsBrut} onChange={handleChange} required />
            </Box>
            <Box w="100%">
                <Text fontSize="sm" color="gray.600" mb={1}>Prix d'Achat brut (€/kg)</Text>
                <Input type="number" step="0.01" name="prixAchatKg" value={formData.prixAchatKg} onChange={handleChange} required />
            </Box>
        </Flex>

        <Flex gap={4}>
            <Box w="100%">
                <Text fontSize="sm" color="gray.600" mb={1}>Poids Net après parage (kg)</Text>
                <Input type="number" step="0.001" name="poidsNet" value={formData.poidsNet} onChange={handleChange} required />
            </Box>
        </Flex>

        <Box borderBottom="1px solid" borderColor="gray.300" w="100%" my={2} />

        <Heading size="md" color="brand.brun" mb={2}>Objectifs Commerciaux</Heading>

        <Flex gap={4}>
            <Box w="100%">
                <Text fontSize="sm" color="gray.600" mb={1}>Marge Visée (%)</Text>
                <Input type="number" step="1" name="margeVisee" value={formData.margeVisee} onChange={handleChange} required />
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

        <Textarea placeholder="Notes ou observations sur ce test..." name="commentaire" value={formData.commentaire} onChange={handleChange} />
      </VStack>
    </Box>
  );
};

export default CalculForm;