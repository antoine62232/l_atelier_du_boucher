import { Flex, Box, Heading, Text } from "@chakra-ui/react";

const AdminEntete = ({ titre, description, children }) => (
  <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} direction={{ base: "column", md: "row" }} gap={4} mb={8}>
    <Box>
      <Heading fontFamily="title" color="brand.rouge" fontSize={{ base: "2xl", md: "3xl" }}>
        {titre}
      </Heading>
      {description && (
        <Text color="gray.600" mt={1}>
          {description}
        </Text>
      )}
    </Box>
    {children}
  </Flex>
);

export default AdminEntete;
