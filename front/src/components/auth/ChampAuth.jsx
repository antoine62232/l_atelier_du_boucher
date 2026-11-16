import React from "react";
import { Field, Input } from "@chakra-ui/react";

const ChampAuth = ({ label, ...props }) => (
  <Field.Root w="100%">
    <Field.Label fontSize="sm" color="gray.700" mb={1}>
      {label}
    </Field.Label>
    <Input h="44px" fontSize="16px" bg="white" borderColor="gray.300" borderRadius="md" {...props} />
  </Field.Root>
);

export default ChampAuth;
