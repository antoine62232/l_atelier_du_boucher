import React from "react";
import { Card, Image, Text, Link, Box } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const ActualityCard = ({ title, category, date, excerpt, image, link }) => {
  return (
    <Card.Root
      w="380px"
      h="320px"
      bg="white"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="md"
      border="none"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{ 
        transform: "translateY(-5px)", 
        boxShadow: "xl" 
      }}
      variant="elevated"
      display="flex"
      flexDirection="column"
    >
      {/* 1. IMAGE */}
      <Box h="150px" w="100%" overflow="hidden" flexShrink={0}>
        <Image 
          src={image} 
          // 👇 LA SÉCURITÉ ANTI-IMAGE CASSÉE 👇
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop";
          }}
          alt={title} 
          w="100%" 
          h="100%" 
          objectFit="cover"
          transition="transform 0.5s"
          _hover={{ transform: "scale(1.05)" }}
        />
      </Box>

      {/* 2. CONTENU */}
      <Card.Body gap={1} p={4} textAlign="center" flex="1">
        
        {/* Métadonnées (Brun) */}
        <Text 
          color="brand.brun" 
          fontSize="xs" 
          fontWeight="bold" 
          textTransform="uppercase"
          letterSpacing="wider"
        >
          {category} • {date}
        </Text>

        {/* Titre (Rouge) */}
        <Card.Title 
          fontFamily="title" 
          fontSize="lg" 
          color="brand.rouge" 
          lineHeight="1.2"
          mb={1}
          isTruncated
        >
          {title}
        </Card.Title>

        {/* Extrait */}
        <Card.Description 
          fontSize="sm" 
          color="brand.gris" 
          lineHeight="1.4"
          noOfLines={2}
        >
          {excerpt}
        </Card.Description>

      </Card.Body>

      {/* 3. FOOTER */}
      <Card.Footer justifyContent="center" pt={0} pb={4}>
        <Link 
          as={RouterLink} 
          to={link}
          color="brand.brun"
          fontSize="sm"
          fontWeight="bold"
          textDecoration="none"
          _hover={{ 
            color: "brand.rouge", 
            textDecoration: "underline" 
          }}
        >
          Lire l'article &gt;
        </Link>
      </Card.Footer>
    </Card.Root>
  );
};

export default ActualityCard;