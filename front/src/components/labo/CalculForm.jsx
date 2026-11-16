import React from "react";
import { Box, VStack, Heading, Input, SimpleGrid, Textarea, Field, NativeSelect } from "@chakra-ui/react";

const Champ = ({ label, children, aide }) => (
  <Field.Root>
    <Field.Label fontSize="sm" color="gray.700" mb={1}>
      {label}
    </Field.Label>
    {children}
    {aide && <Field.HelperText color="gray.600">{aide}</Field.HelperText>}
  </Field.Root>
);

const styleChamp = { h: "44px", bg: "white", borderColor: "gray.300", fontSize: "16px" };

const CalculForm = ({ formData, handleChange, pieces }) => {
  return (
    <Box bg="white" p={{ base: 5, md: 8 }} borderRadius="xl" boxShadow="carte" as="form" onSubmit={(e) => e.preventDefault()}>
      <VStack gap={5} align="stretch">
        <Heading as="h2" size="md" fontFamily="title" color="brand.brun">
          Données de la pièce
        </Heading>

        <Champ label="Nom du test">
          <Input
            {...styleChamp}
            placeholder="Ex. : paleron de génisse"
            name="titreCalcul"
            value={formData.titreCalcul}
            onChange={handleChange}
            required
          />
        </Champ>

        <Champ label="Pièce travaillée">
          <NativeSelect.Root>
            <NativeSelect.Field {...styleChamp} name="pieceId" value={formData.pieceId} onChange={handleChange} required>
              <option value="">Sélectionnez une pièce</option>
              {pieces.map((p) => (
                <option key={p.idPiece} value={p.idPiece}>
                  {p.nomPiece}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Champ>

        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
          <Champ label="Poids brut (kg)">
            <Input {...styleChamp} type="number" inputMode="decimal" step="0.001" min="0" name="poidsBrut" value={formData.poidsBrut} onChange={handleChange} required />
          </Champ>
          <Champ label="Poids net après parage (kg)">
            <Input {...styleChamp} type="number" inputMode="decimal" step="0.001" min="0" name="poidsNet" value={formData.poidsNet} onChange={handleChange} required />
          </Champ>
          <Champ label="Prix d'achat brut (€/kg)">
            <Input {...styleChamp} type="number" inputMode="decimal" step="0.01" min="0" name="prixAchatKg" value={formData.prixAchatKg} onChange={handleChange} required />
          </Champ>
        </SimpleGrid>

        <Box borderBottom="1px solid" borderColor="gray.200" w="100%" my={1} />

        <Heading as="h2" size="md" fontFamily="title" color="brand.brun">
          Objectifs commerciaux
        </Heading>

        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
          <Champ label="Marge visée (%)" aide="Entre 0 et 99 %">
            <Input {...styleChamp} type="number" inputMode="numeric" step="1" min="0" max="99" name="margeVisee" value={formData.margeVisee} onChange={handleChange} required />
          </Champ>
          <Champ label="Taux de TVA">
            <NativeSelect.Root>
              <NativeSelect.Field {...styleChamp} name="tauxTva" value={formData.tauxTva} onChange={handleChange}>
                <option value="5.5">5,5 % (alimentaire)</option>
                <option value="20">20 % (taux normal)</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Champ>
        </SimpleGrid>

        <Champ label="Notes (facultatif)">
          <Textarea
            bg="white"
            borderColor="gray.300"
            fontSize="16px"
            placeholder="Observations sur ce test..."
            name="commentaire"
            value={formData.commentaire}
            onChange={handleChange}
          />
        </Champ>
      </VStack>
    </Box>
  );
};

export default CalculForm;
