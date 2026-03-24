import React from "react";
import { Box, VStack, Heading, Text, Flex, Button } from "@chakra-ui/react";

const TicketResultat = ({ formData, onSave, isLoading }) => {
  // Calculs en temps réel à partir des données du formulaire
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

  return (
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

        <Box mt={6} pt={6} borderTop="1px solid" borderColor="gray.300">
            <Button 
                w="100%" bg="brand.rouge" color="white" _hover={{ bg: "brand.brun" }} size="lg" 
                onClick={onSave} isLoading={isLoading}
            >
                Enregistrer dans mon Établi
            </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default TicketResultat;