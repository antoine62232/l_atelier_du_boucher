import React from "react";
import { Box, Button, Container, Heading, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const PageIntrouvable = () => (
  <Box bg="brand.beige" pt={{ base: "140px", md: "180px" }} pb="96px">
    <Container maxW="640px" textAlign="center">
      <Text color="brand.brun" fontWeight="bold" letterSpacing="wider" mb={3}>
        ERREUR 404
      </Text>
      <Heading as="h1" fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
        Cette page n'existe pas
      </Heading>
      <Text color="brand.gris" mb={8}>
        Le lien est peut-être erroné, ou la page est encore en préparation.
      </Text>
      <Button asChild bg="brand.rouge" color="white" rounded="full" px={8} _hover={{ bg: "brand.rougeFonce" }}>
        <RouterLink to="/">Retour à l'accueil</RouterLink>
      </Button>
    </Container>
  </Box>
);

export default PageIntrouvable;
