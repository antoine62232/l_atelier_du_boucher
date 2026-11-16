import React from "react";
import { Card, Text, Box, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import ImageAvecSecours from "../ImageAvecSecours";

const ActualityCard = ({ title, category, date, excerpt, image, link }) => {
  return (
    <LinkBox
      as={Card.Root}
      w="100%"
      maxW="400px"
      mx="auto"
      h="100%"
      bg="white"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="carte"
      border="none"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{ transform: "translateY(-4px)", boxShadow: "carteSurvol" }}
      display="flex"
      flexDirection="column"
    >
      <Box h="180px" w="100%" overflow="hidden" flexShrink={0}>
        <ImageAvecSecours src={image} alt="" w="100%" h="100%" objectFit="cover" />
      </Box>

      <Card.Body gap={2} p={5} flex="1">
        <Text color="brand.brun" fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">
          {category} • {date}
        </Text>

        <Card.Title as="h3" fontFamily="title" fontSize="lg" color="brand.rouge" lineHeight="1.3" lineClamp={2}>
          <LinkOverlay as={RouterLink} to={link}>
            {title}
          </LinkOverlay>
        </Card.Title>

        <Card.Description fontSize="sm" color="brand.gris" lineHeight="1.5" lineClamp={3}>
          {excerpt}
        </Card.Description>
      </Card.Body>

      <Card.Footer pt={0} pb={5} px={5}>
        <Text color="brand.brun" fontSize="sm" fontWeight="bold" aria-hidden="true">
          Lire l'article →
        </Text>
      </Card.Footer>
    </LinkBox>
  );
};

export default ActualityCard;
