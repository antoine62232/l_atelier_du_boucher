import React, { Fragment } from "react";
import { Box, Breadcrumb, Heading, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const FilAriane = ({ etapes, titre, sousTitre }) => {
  const precedentes = etapes.slice(0, -1);
  const courante = etapes[etapes.length - 1];

  return (
    <Box mb={titre ? { base: 6, md: 10 } : { base: 4, md: 6 }}>
      <Breadcrumb.Root fontSize="sm" color="gray.600">
        <Breadcrumb.List flexWrap="wrap" rowGap={0}>
          {precedentes.map((etape) => (
            <Fragment key={etape.to}>
              <Breadcrumb.Item>
                <Breadcrumb.Link
                  asChild
                  color="gray.600"
                  display="inline-flex"
                  alignItems="center"
                  minH="44px"
                  _hover={{ color: "brand.rouge" }}
                >
                  <RouterLink to={etape.to}>{etape.label}</RouterLink>
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
            </Fragment>
          ))}
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink color="brand.rouge" fontWeight="medium" display="inline-flex" alignItems="center" minH="44px">
              {courante.label}
            </Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      {titre && (
        <Box mt={2}>
          <Heading as="h1" fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "4xl" }} lineHeight="1.15">
            {titre}
          </Heading>
          {sousTitre && (
            <Text color="brand.gris" mt={2}>
              {sousTitre}
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
};

export default FilAriane;
