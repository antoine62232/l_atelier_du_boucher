import React from "react";
import { 
  Dialog, 
  Button, 
  Input, 
  Stack, 
  Field, 
  Flex,
  Text,
  Link,
  Heading,
  Box
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiX } from "react-icons/fi";

const LoginModal = ({ isOpen, onClose, onSwitchToSignUp }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose} placement="center">
      
      {/* Arrière-plan flouté */}
      <Dialog.Backdrop 
        backdropFilter="blur(10px)"
        bg="blackAlpha.500"
      />
      <Dialog.Positioner>
        <Dialog.Content 
          bg="#F9F9F9" 
          borderRadius="2xl" 
          boxShadow="2xl" 
          p={8}
          maxW="md"
          w="90%"
          pt="40px"
          px={8}
          pb={8}
        >
          
          {/* Croix de fermeture */}
          <Dialog.CloseTrigger 
            position="absolute" 
            top="16px" 
            right="16px" 
            bg="transparent"
            color="gray.400"
            _hover={{ color: "brand.rouge", cursor: "pointer" }}
            outline="none"
          >
             <FiX size={22} />
          </Dialog.CloseTrigger>

          <Dialog.Header p={0}>
            <Flex direction="column" align="center" w="100%">
            <Dialog.Title asChild>
                <Heading 
                    fontFamily="title" 
                    color="brand.rouge" 
                    fontSize="28px" 
                    textAlign="center"
                    whiteSpace="nowrap"
                    lineHeight="1.2"
                    mb={1}
                    w="100%"
                >
                    Connexion
                </Heading>
            </Dialog.Title>
            <Text 
                color="brand.brun" 
                fontSize="sm" 
                fontWeight="normal"
                textAlign="center"
                whiteSpace="nowrap"
                mb="20px"
                w="100%"
            >
                Heureux de vous revoir
            </Text>
            </Flex>
          </Dialog.Header>

          <Dialog.Body p={0}>
            <Stack gap={5} align="center">
                
                {/* EMAIL */}
                <Field.Root w="340px">
                    <Input type="email" placeholder="Adresse e-mail" bg="#FFFFFF" borderRadius="md" />
                </Field.Root>

                {/* MOT DE PASSE */}
                <Field.Root w="340px">
                    <Input type="password" placeholder="Mot de passe" bg="#FFFFFF" borderRadius="md" />
                </Field.Root>

                {/* LIEN MOT DE PASSE OUBLIÉ */}
                <Box w="340px" textAlign="right">
                    <Link 
                        as={RouterLink} 
                        to="/forgot-password" 
                        fontSize="xs" 
                        color="gray.500" 
                        fontStyle="italic"
                        _hover={{ color: "brand.rouge", textDecoration: "underline" }}
                        onClick={onClose}
                    >
                        Mot de passe oublié ?
                    </Link>
                </Box>

            </Stack>
          </Dialog.Body>

          <Dialog.Footer justifyContent="center" flexDirection="column" pt={6} alignItems="center">
            <Button 
                w="340px" 
                bg="brand.brun" 
                color="#FFFFFF" 
                fontSize="15px"
                borderRadius="full"
                _hover={{ bg: "brand.rouge" }}
                fontFamily="title"
                fontWeight="normal"
            >
                Se connecter
            </Button>
            
            <Text fontSize="sm" color="gray.500" mt={6}>
                Pas encore de compte ?{" "}
                <Link 
                    // On utilise un bouton ici pour switcher de modale
                    color="brand.rouge" 
                    fontWeight="bold" 
                    textDecoration="underline"
                    cursor="pointer"
                    onClick={() => {
                        onClose(); // Ferme Connexion
                        if (onSwitchToSignUp) onSwitchToSignUp(); // Ouvre Inscription
                    }}
                >
                    S'inscrire
                </Link>
            </Text>
          </Dialog.Footer>

        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default LoginModal;