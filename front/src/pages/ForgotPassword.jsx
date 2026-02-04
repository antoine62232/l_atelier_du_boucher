import React, { useState } from "react";
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Input, 
  Button, 
  VStack, 
  Alert,
  Center
} from "@chakra-ui/react";
import { forgotPassword } from "../services/UsersService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    try {
      await forgotPassword(email);
      setStatus({ 
        type: "success", 
        message: "Si un compte existe avec cet e-mail, vous recevrez un lien de réinitialisation." 
      });
      setEmail("");
    } catch (error) {
      setStatus({ 
        type: "error", 
        message: "Une erreur est survenue. Veuillez réessayer plus tard." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" py="100px">
      <Container maxW="md">
        <Box 
            bg="white" 
            p={8} 
            borderRadius="2xl" 
            boxShadow="xl"
            textAlign="center"
        >
          <Heading 
            fontFamily="title" 
            color="brand.rouge" 
            fontSize="28px" 
            mb={2}
          >
            Mot de passe oublié ?
          </Heading>
          
          <Text color="gray.500" mb={6} fontSize="sm">
            Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
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
                type="email" 
                placeholder="Votre adresse e-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg="gray.50"
                borderRadius="md"
                required
              />
              
              <Button 
                type="submit"
                w="full" 
                bg="brand.brun" 
                color="white" 
                size="lg" 
                borderRadius="full"
                _hover={{ bg: "brand.rouge" }}
                fontFamily="title"
                disabled={isLoading}
              >
                {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
              </Button>
            </VStack>
          </form>

          <Center mt={6}>
            <Button 
                variant="ghost" 
                size="sm" 
                color="gray.500" 
                _hover={{ color: "brand.rouge" }}
                onClick={() => window.history.back()}
            >
                Retour à la connexion
            </Button>
          </Center>

        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPassword;