import React, { useState } from "react";
import { Box, Flex, Text, Heading, Badge, VStack, Dialog, Button, Textarea, Center, IconButton } from "@chakra-ui/react";
import { FiTrendingUp, FiShoppingBag, FiCalendar, FiX, FiClipboard, FiTrash2 } from "react-icons/fi";
// Formatteur pour les prix en euros
const euroFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

const CalculCard = ({ calcul, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Fonction pour supprimer sans ouvrir la modale
  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Empêche l'ouverture du ticket
    if (window.confirm("Voulez-vous vraiment supprimer ce calcul ?")) {
      onDelete(calcul.idCalcul);
    }
  };

  const dateObj = calcul.dateCalcul ? new Date(calcul.dateCalcul) : null;
  const dateStr = dateObj
    ? dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    : "Récemment";
    
  const heureStr = dateObj
    ? dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : "";

  return (
    <>
      {/* LA CARTE RÉSUMÉ */}
      <Box 
          bg="white" 
          p={4} 
          borderRadius="lg" 
          border="1px solid" 
          borderColor="brand.acier" 
          boxShadow="sm"
          transition="all 0.2s"
          cursor="pointer"
          position="relative"
          onClick={() => setIsOpen(true)}
          _hover={{ boxShadow: "md", transform: "translateY(-2px)", borderColor: "brand.brun" }}
      >
        {/* LE BOUTON POUBELLE */}
        <IconButton
            aria-label="Supprimer le calcul"
            position="absolute"
            top="10px"
            right="10px"
            zIndex="2"
            size="xs"
            variant="ghost"
            color="red.400"
            onClick={handleRemove}
            _hover={{ color: "red.600", bg: "red.50" }}
        >
            <FiTrash2 size={16} />
        </IconButton>

        {/* EN-TÊTE AVEC TITRE, PIÈCE ET DATE */}
        <Flex justify="space-between" align="center" mb={3} pr={6}>
          <VStack align="start" gap={0}>
              <Heading size="sm" color="brand.gris" fontFamily="title" noOfLines={1}>
              {calcul.titreCalcul}
              </Heading>
              <Text fontSize="xs" color="gray.500">{calcul.nomPiece || "Pièce non définie"}</Text>
          </VStack>
          <Badge bg="brand.beige" color="brand.brun" fontSize="xs">
            {dateStr}
          </Badge>
        </Flex>

        <Box borderBottom="1px dashed" borderColor="gray.200" mb={3} />
        
        {/* RENDU ET PRIX DE VENTE */}
        <Flex justify="space-between" align="center">
          <VStack align="start" gap={0}>
              <Flex align="center" gap={1} color="gray.500" fontSize="xs">
                  <FiTrendingUp /> Rendement
              </Flex>
              <Text fontWeight="bold" color="brand.rouge" fontSize="lg">
                  {parseFloat(calcul.resultatRendement).toFixed(1)} %
              </Text>
          </VStack>

          <VStack align="end" gap={0}>
              <Flex align="center" gap={1} color="gray.500" fontSize="xs">
                  <FiShoppingBag /> Vente TTC
              </Flex>
              <Text fontWeight="bold" color="green.600" fontSize="lg">
                  {parseFloat(calcul.prixVenteConseilleKg).toFixed(2)} €/kg
              </Text>
          </VStack>
        </Flex>
      </Box>

      {/* LA MODALE DE DÉTAIL */}
      <Dialog.Root 
        open={isOpen} 
        onOpenChange={(e) => setIsOpen(e.open)} 
        placement="center"
      >
        <Dialog.Backdrop backdropFilter="blur(5px)" bg="blackAlpha.700" zIndex="1400" />
        <Dialog.Positioner zIndex="1500">
            <Dialog.Content bg="#fdfbf7" borderRadius="xl" shadow="xl" border="1px solid #e2e8f0" w={{ base: "95vw", md: "500px" }} position="relative">
                
                <Box position="absolute" top="-10px" left="0" right="0" height="20px" bgImage="radial-gradient(circle, transparent 10px, #fdfbf7 11px)" bgSize="20px 20px" />

                <Box position="absolute" top="15px" right="15px" zIndex="10">
                    <Button
                        bg="brand.rouge" color="white" borderRadius="full" size="sm"
                        w="36px" h="36px" p={0} _hover={{ bg: "brand.brun" }}
                        onClick={() => setIsOpen(false)}
                    >
                        <FiX size={20} />
                    </Button>
                </Box>

                <Box p={8}>
                    <VStack spacing={5} align="stretch" fontFamily="mono">
                        
                        <VStack textAlign="center" mb={2}>
                            <Heading fontFamily="title" color="brand.brun" size="xl">TICKET D'ARCHIVE</Heading>
                            <Text fontSize="sm" color="gray.500" mt={1}>L'Atelier du Boucher - Mon Établi</Text>
                            <Flex align="center" gap={2} fontSize="xs" color="gray.400" mt={2}>
                                <FiClipboard /> ID: {calcul.idCalcul} | <FiCalendar /> {dateStr} - {heureStr}
                            </Flex>
                        </VStack>
                        
                        <Box borderBottom="1px dashed" borderColor="gray.400" w="100%" my={2} />

                        <VStack align="stretch" gap={1}>
                            <Text color="gray.500" fontSize="xs" textTransform="uppercase">Nom du test :</Text>
                            <Heading size="md" color="brand.gris">{calcul.titreCalcul}</Heading>
                            <Text color="brand.brun" fontWeight="bold">Travail sur : {calcul.nomPiece || "N/A"}</Text>
                        </VStack>

                        <Box borderBottom="1px dashed" borderColor="gray.400" w="100%" my={2} />

                        <VStack align="stretch" spacing={2}>
                            <Flex justify="space-between">
                                <Text color="gray.600">Poids Brut :</Text>
                                <Text fontWeight="bold">{parseFloat(calcul.poidsBrut).toFixed(3)} kg</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text color="gray.600">Poids Net (Paré) :</Text>
                                <Text fontWeight="bold">{parseFloat(calcul.poidsNet).toFixed(3)} kg</Text>
                            </Flex>
                            <Flex justify="space-between" color="red.600">
                                <Text>Perte (Os/Déchets) :</Text>
                                <Text fontWeight="bold">{parseFloat(calcul.poidsPerte).toFixed(3)} kg</Text>
                            </Flex>
                            
                            <Flex justify="space-between" align="center" bg="gray.100" p={3} borderRadius="md" mt={2}>
                                <Text fontWeight="bold" color="brand.brun">RENDEMENT OBTENU :</Text>
                                <Text fontWeight="bold" fontSize="2xl" color="brand.rouge">
                                    {parseFloat(calcul.resultatRendement).toFixed(2)} %
                                </Text>
                            </Flex>
                        </VStack>

                        <Box borderBottom="1px dashed" borderColor="gray.400" w="100%" my={2} />

                        <VStack align="stretch" spacing={2}>
                            <Flex justify="space-between">
                                <Text color="gray.600">Prix d'achat brut :</Text>
                                <Text fontWeight="bold">{euroFormatter.format(calcul.prixAchatKg)}/kg</Text>
                            </Flex>
                            <Flex justify="space-between" color="brand.brun">
                                <Text fontWeight="bold">PRIX DE REVIENT NET :</Text>
                                <Text fontWeight="bold">{euroFormatter.format(calcul.prixRevientKg)}/kg</Text>
                            </Flex>
                        </VStack>

                        <Box borderBottom="1px dashed" borderColor="gray.400" w="100%" my={2} />

                        <VStack align="stretch" spacing={1} bg="green.50" border="1px solid" borderColor="green.200" p={4} borderRadius="md">
                            <Flex justify="space-between" align="center">
                                <Text fontWeight="bold" color="green.700">PRIX DE VENTE CONSEILLÉ (TTC) :</Text>
                                <VStack align="end" gap={0}>
                                    <Text fontWeight="bold" fontSize="3xl" color="green.700">
                                        {euroFormatter.format(calcul.prixVenteConseilleKg)}
                                    </Text>
                                    <Text fontSize="sm" color="green.700">/kg</Text>
                                </VStack>
                            </Flex>
                            <Text textAlign="right" fontSize="xs" color="gray.500">
                                *Incluant {calcul.margeVisee}% de Marge et {calcul.tauxTVA}% TVA
                            </Text>
                        </VStack>

                        {calcul.commentaire && (
                            <>
                                <Box borderBottom="1px dashed" borderColor="gray.400" w="100%" my={2} />
                                <VStack align="stretch" spacing={1}>
                                    <Text color="gray.500" fontSize="xs" textTransform="uppercase">Observations :</Text>
                                    <Box 
                                        p={3}
                                        fontSize="sm"
                                        fontFamily="mono"
                                        bg="gray.50"
                                        minH="60px"
                                        borderRadius="md"
                                        border="1px solid" borderColor="gray.200"
                                    >
                                        {calcul.commentaire}
                                    </Box>
                                </VStack>
                            </>
                        )}
                        
                        <Box borderBottom="1px dashed" borderColor="gray.400" w="100%" mt={3} mb={1} />
                        <Center>
                             <Text fontSize="xs" color="brand.acier" fontStyle="italic">Fermer pour revenir à l'Établi.</Text>
                        </Center>

                    </VStack>
                </Box>
                
                <Box position="absolute" bottom="-10px" left="0" right="0" height="20px" bgImage="radial-gradient(circle, transparent 10px, #fdfbf7 11px)" bgSize="20px 20px" transform="rotate(180deg)" />

            </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};

export default CalculCard;