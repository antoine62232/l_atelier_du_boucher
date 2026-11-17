import React from "react";
import { Box, SimpleGrid, Text, Link, Stack, Image, Separator } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import logoFooter from "../assets/logoFooter.webp";

const LIENS_AIDE = [
  { to: "/contact", label: "Contacter l'Atelier" },
  { to: "/faq", label: "Questions fréquentes" },
];

const LIENS_LEGAUX = [
  { to: "/mentions-legales", label: "Mentions légales" },
  { to: "/cgu", label: "Conditions générales d'utilisation" },
  { to: "/politique-confidentialite", label: "Politique de confidentialité" },
];

const TitreColonne = ({ children }) => (
  <Text
    as="h2"
    color="brand.brun"
    fontFamily="title"
    fontWeight="bold"
    fontSize="md"
    letterSpacing="wide"
    textTransform="uppercase"
    mb={3}
  >
    {children}
  </Text>
);

const LienFooter = ({ to, children }) => (
  <Link
    as={RouterLink}
    to={to}
    color="brand.beige"
    fontSize="sm"
    display="inline-flex"
    alignItems="center"
    minH="44px"
    _hover={{ color: "white", textDecoration: "underline" }}
  >
    {children}
  </Link>
);

const Footer = () => {
  const annee = new Date().getFullYear();

  return (
    <Box
      as="footer"
      bg="brand.gris"
      color="brand.beige"
      w="100%"
      pt={{ base: 10, lg: 14 }}
      pb={6}
      px={{ base: 6, md: 10, lg: "120px" }}
    >
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 8, md: 10 }} alignItems="start">
        <Stack gap={3} align="start">
          <Image src={logoFooter} alt="" w={{ base: "96px", md: "128px" }} opacity={0.9} />
          <Text fontFamily="title" fontSize="xl" fontWeight="bold" letterSpacing="wide">
            L'ATELIER DU BOUCHER
          </Text>
          <Text fontSize="sm" lineHeight="1.6" maxW="300px" opacity={0.9}>
            L'atlas numérique et le compagnon technique des apprentis et artisans bouchers.
          </Text>
        </Stack>

        <Box as="nav" aria-label="Aide et contact">
          <TitreColonne>Aide et contact</TitreColonne>
          <Stack gap={0} align="start">
            {LIENS_AIDE.map((lien) => (
              <LienFooter key={lien.to} to={lien.to}>
                {lien.label}
              </LienFooter>
            ))}
          </Stack>
        </Box>

        <Box as="nav" aria-label="Informations légales">
          <TitreColonne>Informations légales</TitreColonne>
          <Stack gap={0} align="start">
            {LIENS_LEGAUX.map((lien) => (
              <LienFooter key={lien.to} to={lien.to}>
                {lien.label}
              </LienFooter>
            ))}
          </Stack>
        </Box>
      </SimpleGrid>

      <Separator borderColor="brand.beige" opacity={0.2} mt={{ base: 8, md: 10 }} mb={5} />
      <Text fontSize="xs" opacity={0.8} textAlign={{ base: "left", md: "center" }}>
        © {annee} L'Atelier du Boucher. Tous droits réservés.
      </Text>
    </Box>
  );
};

export default Footer;
