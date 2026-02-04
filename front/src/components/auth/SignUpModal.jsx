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
  Heading
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiX } from "react-icons/fi";

const SignUpModal = ({ isOpen, onClose }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose} placement="center">
      
      {/* L'arrière-plan flouté (Backdrop) */}
      <Dialog.Backdrop 
        backdropFilter="blur(10px)"
        bg="blackAlpha.500"
      />

      <Dialog.Positioner>
        <Dialog.Content 
          bg="#FFFFFF" 
          borderRadius="2xl" 
          boxShadow="2xl" 
          p={8}
          maxW="md"
          w="90%"
          pt="40px"
          px={8}
          pb={8}
        >
          
          {/* La croix de fermeture en haut à droite */}
          <Dialog.CloseTrigger 
            position="absolute" 
            top="16px" 
            right="16px" 
            bg="transparent"
            color="gray.400"
            _hover={{ color: "brand.rouge", cursor: "pointer" }}
            outline="none"
          >
             {/* ✅ On met l'icône visible à l'intérieur */}
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
                    Créer un compte
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
                Rejoignez l'Atlas de l'Artisan Boucher
            </Text>
            </Flex>
          </Dialog.Header>

          <Dialog.Body p={0}>
            <Stack gap={5}>
                <Flex gap={4} direction={{ base: "column", sm: "row" }}>
                    <Field.Root w="100%">
                        <Input placeholder="Prénom" bg="#FFFFFF" borderRadius="md" />
                    </Field.Root>
                    <Field.Root w="100%">
                        <Input placeholder="Nom" bg="#FFFFFF" borderRadius="md" />
                    </Field.Root>
                </Flex>

                <Field.Root>
                    <Input type="email" placeholder="Adresse e-mail" bg="#FFFFFF" borderRadius="md" />
                </Field.Root>

                <Field.Root>
                    <Input type="password" placeholder="Mot de passe" bg="#FFFFFF" borderRadius="md" />
                </Field.Root>

                <Field.Root>
                    <Input type="password" placeholder="Confirmer le mot de passe" bg="#FFFFFF" borderRadius="md" />
                </Field.Root>
            </Stack>
          </Dialog.Body>

          <Dialog.Footer justifyContent="center" flexDirection="column" pt={6}>
            <Button 
                w="full" 
                bg="brand.brun" 
                color="#FFFFFF" 
                fontSize="15px"
                borderRadius="full"
                _hover={{ bg: "brand.rouge" }}
                fontFamily="title"
                fontWeight="normal"
            >
                S'inscrire
            </Button>

            {/* 2. LE TEXTE LÉGAL */}
            <Text
                fontSize="10px"
                fontWeight="light"
                fontStyle="italic"
                color="gray.500"
                textAlign="center"
                whiteSpace="nowrap"
                mt={3}
                mb="10px"
            >
                En créant un compte, vous acceptez les conditions d’utilisation
            </Text>
            
            <Text fontSize="sm" color="gray.500" mt={4}>
                Déjà un compte ?{" "}
                <Link 
                    as={RouterLink} 
                    to="/login" 
                    color="brand.rouge" 
                    fontWeight="bold" 
                    textDecoration="underline"
                    onClick={onClose} // Ferme la modale si on clique sur Login
                >
                    Se connecter
                </Link>
            </Text>
          </Dialog.Footer>

        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default SignUpModal;