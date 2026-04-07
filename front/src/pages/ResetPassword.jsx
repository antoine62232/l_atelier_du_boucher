import React, { useState } from "react";
import { 
  Box, Container, Heading, Text, Input, Button, VStack, Alert, Center 
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/UsersService";

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    // 1. Validation basique
    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Les mots de passe ne correspondent pas." });
      return;
    }
    if (password.length < 6) {
        setStatus({ type: "error", message: "Le mot de passe doit faire au moins 6 caractères." });
        return;
    }

    setIsLoading(true);

    try {
      // 2. Appel au service
      await resetPassword(id, token, password);
      
      setStatus({ 
        type: "success", 
        message: "Mot de passe modifié avec succès ! Vous allez être redirigé..." 
      });

      // 3. Redirection vers l'accueil après 3 secondes
      setTimeout(() => {
        navigate("/"); 
      }, 3000);

    } catch (error) {
      // Si le token est périmé ou invalide
      setStatus({ 
        type: "error", 
        message: error.response?.data?.error || "Le lien est invalide ou a expiré." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" py="100px">
      <Container maxW="md">
        <Box bg="white" p={8} borderRadius="2xl" boxShadow="xl" textAlign="center">
          
          <Heading fontFamily="title" color="brand.rouge" fontSize="28px" mb={2}>
            Nouveau mot de passe
          </Heading>
          
          <Text color="gray.500" mb={6} fontSize="sm">
            Choisissez un nouveau mot de passe sécurisé pour votre compte.
          </Text>

          {status.message && (
            <Alert.Root status={status.type} mb={4} borderRadius="md">
                <Alert.Indicator />
                <Alert.Content>
                    <Alert.Title>{status.message}</Alert.Title>
                </Alert.Content>
            </Alert.Root>
          )}

          <form onSubmit={handleSubmit}>
            <VStack gap={4}>
              <Input 
                type="password" 
                placeholder="Nouveau mot de passe" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="gray.50" borderRadius="md" required
              />
              <Input 
                type="password" 
                placeholder="Confirmer le mot de passe" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                bg="gray.50" borderRadius="md" required
              />
              
              <Button 
                type="submit" w="full" bg="brand.brun" color="white" 
                size="lg" borderRadius="full" _hover={{ bg: "brand.rouge" }}
                fontFamily="title" disabled={isLoading}
              >
                {isLoading ? "Modification..." : "Valider"}
              </Button>
            </VStack>
          </form>

        </Box>
      </Container>
    </Box>
  );
};

export default ResetPassword;