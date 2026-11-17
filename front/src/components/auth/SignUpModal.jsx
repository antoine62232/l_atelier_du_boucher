import React, { useState } from "react";
import { Button, Stack, Text, Link, SimpleGrid } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import CadreModale from "./CadreModale";
import ChampAuth from "./ChampAuth";
import { toaster } from "../ui/notifications";
import { registerUser } from "../../services/UsersService";

const SignUpModal = ({ isOpen, onClose, onSwitchToLogin }) => {

  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError(null);

    if (!formData.email || !formData.password || !formData.prenom || !formData.nom) {
        setError("Tous les champs sont obligatoires.");
        return;
    }
    if (formData.password.length < 8) {
        setError("Le mot de passe doit contenir au moins 8 caractères.");
        return;
    }
    if (formData.password !== formData.confirmPassword) {
        setError("Les deux mots de passe ne correspondent pas.");
        return;
    }

    setIsLoading(true);

    try {
      await registerUser({
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        motDePasse: formData.password, 
        confirmationMotDePasse: formData.confirmPassword
      });

      toaster.create({ type: "success", title: "Compte créé.", description: "Vous pouvez maintenant vous connecter." });
      onClose();
      if (onSwitchToLogin) onSwitchToLogin();
      setFormData({ prenom: "", nom: "", email: "", password: "", confirmPassword: "" });

    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CadreModale isOpen={isOpen} onClose={onClose} titre="Créer un compte" sousTitre="Rejoignez l'Atelier du Boucher">
      <Stack as="form" gap={4} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} noValidate>
        {error && (
          <Text role="alert" color="red.700" bg="red.50" p={3} borderRadius="md" fontSize="sm" textAlign="center">
            {error}
          </Text>
        )}

        <SimpleGrid columns={2} gap={3}>
          <ChampAuth label="Prénom" name="prenom" autoComplete="given-name" value={formData.prenom} onChange={handleChange} />
          <ChampAuth label="Nom" name="nom" autoComplete="family-name" value={formData.nom} onChange={handleChange} />
        </SimpleGrid>

        <ChampAuth label="Adresse e-mail" name="email" type="email" autoComplete="email" inputMode="email" value={formData.email} onChange={handleChange} />
        <ChampAuth label="Mot de passe (8 caractères minimum)" name="password" type="password" autoComplete="new-password" value={formData.password} onChange={handleChange} />
        <ChampAuth label="Confirmer le mot de passe" name="confirmPassword" type="password" autoComplete="new-password" value={formData.confirmPassword} onChange={handleChange} />

        <Button type="submit" w="100%" mt={2} bg="brand.rouge" color="white" borderRadius="full" _hover={{ bg: "brand.rougeFonce" }} loading={isLoading} loadingText="Création...">
          Créer mon compte
        </Button>

        <Text fontSize="xs" color="gray.600" textAlign="center">
          En créant un compte, vous acceptez les{" "}
          <Link asChild color="brand.rouge" textDecoration="underline">
            <RouterLink to="/cgu" onClick={onClose}>conditions générales d'utilisation</RouterLink>
          </Link>
          .
        </Text>

        <Text fontSize="sm" color="gray.600" textAlign="center">
          Déjà un compte ?{" "}
          <Link as="button" type="button" color="brand.rouge" fontWeight="bold" textDecoration="underline" minH="44px" onClick={() => { onClose(); if (onSwitchToLogin) onSwitchToLogin(); }}>
            Se connecter
          </Link>
        </Text>
      </Stack>
    </CadreModale>
  );
};

export default SignUpModal;