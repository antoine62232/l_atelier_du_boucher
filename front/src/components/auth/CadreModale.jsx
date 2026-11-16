import React from "react";
import { Dialog, Heading, Text, Box } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";

const CadreModale = ({ isOpen, onClose, titre, sousTitre, children }) => (
  <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center" scrollBehavior="inside">
    <Dialog.Backdrop backdropFilter="blur(6px)" bg="blackAlpha.500" />
    <Dialog.Positioner px={3}>
      <Dialog.Content bg="brand.creme" borderRadius="2xl" boxShadow="2xl" w="100%" maxW="420px" px={{ base: 5, md: 8 }} pt={10} pb={{ base: 6, md: 8 }}>
        <Dialog.CloseTrigger
          aria-label="Fermer"
          position="absolute"
          top="8px"
          right="8px"
          w="44px"
          h="44px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          rounded="full"
          color="gray.600"
          _hover={{ color: "brand.rouge", bg: "brand.beige" }}
        >
          <FiX size={22} aria-hidden="true" />
        </Dialog.CloseTrigger>

        <Box textAlign="center" mb={6}>
          <Dialog.Title asChild>
            <Heading as="h2" fontFamily="title" color="brand.rouge" fontSize="28px" lineHeight="1.2" mb={1}>
              {titre}
            </Heading>
          </Dialog.Title>
          {sousTitre && (
            <Text color="brand.brun" fontSize="sm">
              {sousTitre}
            </Text>
          )}
        </Box>

        <Dialog.Body p={0}>{children}</Dialog.Body>
      </Dialog.Content>
    </Dialog.Positioner>
  </Dialog.Root>
);

export default CadreModale;
