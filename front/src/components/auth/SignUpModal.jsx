import React, { useState } from "react";
import { 
  Dialog, Button, Input, Stack, Field, Flex, Text, Link, Heading, Spinner 
} from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
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

    if (formData.password !== formData.confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        return;
    }
    if (!formData.email || !formData.password || !formData.prenom || !formData.nom) {
        setError("Veuillez remplir tous les champs.");
        return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser({
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        motDePasse: formData.password, 
        confirmationMotDePasse: formData.confirmPassword
      });

      console.log("Inscription réussie :", response?.data);
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
                    Créer un compte
                </Heading>
            </Dialog.Title>
            <Text color="brand.brun" fontSize="sm" fontWeight="normal" textAlign="center" whiteSpace="nowrap" mb="20px" w="100%">
                Rejoignez l'Atlas de l'Artisan Boucher
            </Text>
            </Flex>
          </Dialog.Header>

          <Dialog.Body p={0}>
            <Stack gap={5} align="center">
                {error && <Text color="red.500" fontSize="sm" textAlign="center">{error}</Text>}

                <Flex gap="12px" direction="row" w="340px">
                    <Field.Root w="164px">
                        <Input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" bg="#FFFFFF" borderRadius="md" />
                    </Field.Root>
                    <Field.Root w="164px">
                        <Input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" bg="#FFFFFF" borderRadius="md" />
                    </Field.Root>
                </Flex>

                <Field.Root w="340px">
                    <Input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Adresse e-mail" bg="#FFFFFF" borderRadius="md" />
                </Field.Root>

                <Field.Root w="340px">
                    <Input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Mot de passe" bg="#FFFFFF" borderRadius="md" />
                </Field.Root>

                <Field.Root w="340px">
                    <Input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" placeholder="Confirmer le mot de passe" bg="#FFFFFF" borderRadius="md" />
                </Field.Root>
            </Stack>
          </Dialog.Body>

          <Dialog.Footer justifyContent="center" flexDirection="column" pt={6} alignItems="center">
            <Button w="340px" bg="brand.brun" color="#FFFFFF" fontSize="15px" borderRadius="full" _hover={{ bg: "brand.rouge" }} fontFamily="title" fontWeight="normal" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? <Spinner size="sm" color="white" /> : "S'inscrire"}
            </Button>

            <Text fontSize="10px" fontWeight="light" fontStyle="italic" color="gray.500" textAlign="center" whiteSpace="nowrap" mt={3} mb="10px">
                En créant un compte, vous acceptez les conditions d’utilisation
            </Text>
            
            <Text fontSize="sm" color="gray.500" mt={4}>
                Déjà un compte ? <Link color="brand.rouge" fontWeight="bold" textDecoration="underline" cursor="pointer" onClick={() => { onClose(); if (onSwitchToLogin) onSwitchToLogin(); }}>Se connecter</Link>
            </Text>
          </Dialog.Footer>

        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default SignUpModal;