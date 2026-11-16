import { NavLink, Outlet } from "react-router-dom";
import { Box, Flex, Stack, Text, Icon } from "@chakra-ui/react";
import { FiGrid, FiFileText } from "react-icons/fi";

const SECTIONS = [
  { to: "/admin", label: "Tableau de bord", icone: FiGrid, end: true },
  { to: "/admin/actualites", label: "Actualités", icone: FiFileText },
];

const LienSection = ({ to, label, icone, end }) => (
  <NavLink to={to} end={end} style={{ textDecoration: "none" }}>
    {({ isActive }) => (
      <Flex
        align="center"
        gap={3}
        px={4}
        py={3}
        borderRadius="lg"
        fontWeight="medium"
        bg={isActive ? "brand.rouge" : "transparent"}
        color={isActive ? "white" : "brand.gris"}
        _hover={{ bg: isActive ? "brand.rouge" : "blackAlpha.50" }}
        transition="background 0.2s"
      >
        <Icon as={icone} boxSize={5} />
        <Text>{label}</Text>
      </Flex>
    )}
  </NavLink>
);

const AdminLayout = () => {
  return (
    <Box bg="brand.beige" minH="100vh" pt="130px" pb="64px">
      <Flex maxW="1360px" mx="auto" px={6} gap={8} direction={{ base: "column", lg: "row" }}>
        <Box
          as="aside"
          w={{ base: "100%", lg: "260px" }}
          flexShrink={0}
          bg="brand.creme"
          border="1px solid"
          borderColor="brand.acier"
          borderRadius="2xl"
          p={4}
          alignSelf="flex-start"
          position={{ lg: "sticky" }}
          top="130px"
        >
          <Text fontSize="xs" fontWeight="bold" letterSpacing="wider" color="gray.500" px={4} pb={3}>
            ADMINISTRATION
          </Text>
          <Stack gap={1}>
            {SECTIONS.map((section) => (
              <LienSection key={section.to} {...section} />
            ))}
          </Stack>
        </Box>

        <Box as="main" flex="1" minW={0}>
          <Outlet />
        </Box>
      </Flex>
    </Box>
  );
};

export default AdminLayout;
