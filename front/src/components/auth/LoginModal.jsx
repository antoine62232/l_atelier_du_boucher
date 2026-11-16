import React, { useState } from "react";
import { Button, Stack, Text, Link, Box } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import CadreModale from "./CadreModale";
import ChampAuth from "./ChampAuth";
import { loginUser } from "../../services/UsersService";

const LoginModal = ({ isOpen, onClose, onSwitchToSignUp }) => {

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError(null);
    if (!credentials.email || !credentials.password) {
        setError("Renseignez votre adresse e-mail et votre mot de passe.");
        return;
    }

    setIsLoading(true);

    try {
      await loginUser({
          email: credentials.email,
          motDePasse: credentials.password 
      });

      window.location.reload();

    } catch (err) {
      setError(err.response?.data?.error || "Email ou mot de passe incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CadreModale isOpen={isOpen} onClose={onClose} titre="Connexion" sousTitre="Heureux de vous revoir">
      <Stack as="form" gap={4} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} noValidate>
        {error && (
          <Text role="alert" color="red.700" bg="red.50" p={3} borderRadius="md" fontSize="sm" textAlign="center">
            {error}
          </Text>
        )}

        <ChampAuth label="Adresse e-mail" name="email" type="email" autoComplete="email" inputMode="email" value={credentials.email} onChange={handleChange} />
        <ChampAuth label="Mot de passe" name="password" type="password" autoComplete="current-password" value={credentials.password} onChange={handleChange} />

        <Box textAlign="right" mt={-2}>
          <Link asChild fontSize="sm" color="gray.600" display="inline-flex" alignItems="center" minH="44px" _hover={{ color: "brand.rouge" }}>
            <RouterLink to="/forgot-password" onClick={onClose}>Mot de passe oublié ?</RouterLink>
          </Link>
        </Box>

        <Button type="submit" w="100%" bg="brand.rouge" color="white" borderRadius="full" _hover={{ bg: "brand.rougeFonce" }} loading={isLoading} loadingText="Connexion...">
          Se connecter
        </Button>

        <Text fontSize="sm" color="gray.600" textAlign="center" mt={2}>
          Pas encore de compte ?{" "}
          <Link as="button" type="button" color="brand.rouge" fontWeight="bold" textDecoration="underline" minH="44px" onClick={() => { onClose(); if (onSwitchToSignUp) onSwitchToSignUp(); }}>
            Créer un compte
          </Link>
        </Text>
      </Stack>
    </CadreModale>
  );
};

export default LoginModal;