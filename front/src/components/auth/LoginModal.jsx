import React, { useState } from "react";
import { 
  Dialog, Button, Input, Stack, Field, Flex, Text, Link, Heading, Box, Spinner 
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiX } from "react-icons/fi";
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
        setError("Veuillez remplir tous les champs.");
        return;
    }

    setIsLoading(true);

    try {
      await loginUser({
          email: credentials.email,
          motDePasse: credentials.password 
      });

      console.log("Connexion réussie");
      window.location.reload(); 
      
      onClose();

    } catch (err) {
      setError(err.response?.data?.error || "Email ou mot de passe incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose} placement="center">
      <Dialog.Backdrop backdropFilter="blur(10px)" bg="blackAlpha.500" />
      <Dialog.Positioner>
        <Dialog.Content bg="#F9F9F9" borderRadius="2xl" boxShadow="2xl" p={8} maxW="md" w="90%" pt="40px" px={8} pb={8}>
          
          <Dialog.CloseTrigger position="absolute" top="16px" right="16px" bg="transparent" color="gray.400" _hover={{ color: "brand.rouge", cursor: "pointer" }} outline="none">
             <FiX size={22} />
          </Dialog.CloseTrigger>

          <Dialog.Header p={0}>
            <Flex direction="column" align="center" w="100%">
            <Dialog.Title asChild>
                <Heading fontFamily="title" color="brand.rouge" fontSize="28px" textAlign="center" whiteSpace="nowrap" lineHeight="1.2" mb={1} w="100%">
                    Connexion
                </Heading>
            </Dialog.Title>
            <Text color="brand.brun" fontSize="sm" fontWeight="normal" textAlign="center" whiteSpace="nowrap" mb="20px" w="100%">
                Heureux de vous revoir
            </Text>
            </Flex>
          </Dialog.Header>

          <Dialog.Body p={0}>
            <Stack gap={5} align="center">
                {error && <Text color="red.500" fontSize="sm" textAlign="center">{error}</Text>}
                
                <Field.Root w="340px">
                    <Input name="email" value={credentials.email} onChange={handleChange} type="email" placeholder="Adresse e-mail" bg="#FFFFFF" borderRadius="md" />
                </Field.Root>

                <Field.Root w="340px">
                    <Input name="password" value={credentials.password} onChange={handleChange} type="password" placeholder="Mot de passe" bg="#FFFFFF" borderRadius="md" />
                </Field.Root>

                <Box w="340px" textAlign="right">
                    <Link as={RouterLink} to="/forgot-password" fontSize="xs" color="gray.500" fontStyle="italic" _hover={{ color: "brand.rouge", textDecoration: "underline" }} onClick={onClose}>
                        Mot de passe oublié ?
                    </Link>
                </Box>
            </Stack>
          </Dialog.Body>

          <Dialog.Footer justifyContent="center" flexDirection="column" pt={6} alignItems="center">
            <Button w="340px" bg="brand.brun" color="#FFFFFF" fontSize="15px" borderRadius="full" _hover={{ bg: "brand.rouge" }} fontFamily="title" fontWeight="normal" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? <Spinner size="sm" color="white" /> : "Se connecter"}
            </Button>
            
            <Text fontSize="sm" color="gray.500" mt={6}>
                Pas encore de compte ? <Link color="brand.rouge" fontWeight="bold" textDecoration="underline" cursor="pointer" onClick={() => { onClose(); if (onSwitchToSignUp) onSwitchToSignUp(); }}>S'inscrire</Link>
            </Text>
          </Dialog.Footer>

        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default LoginModal;