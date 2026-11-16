import React from "react";
import { Box, Button, Card, Image } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const ToolsCard = ({ title, description, image, link, buttonText }) => {
  return (
    <Card.Root 
      w="100%"
      h="100%"
      overflow="hidden"
      bg="white"
      boxShadow="carte"
      borderRadius="xl"
      border="none"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-4px)", boxShadow: "carteSurvol" }}
      display="flex"
      flexDirection="column"
    >
      <Image
        src={image}
        alt=""
        h={{ base: "200px", md: "180px" }}
        w="100%"
        objectFit="cover"
      />
      
      <Card.Body gap="2" p={5}>
        <Card.Title 
          as="h3"
          textAlign="center"
          fontFamily="title" 
          fontWeight="bold"
          fontSize="lg"
          color="brand.rouge"
          mb={1}
          lineHeight="1.2"
        >
          {title}
        </Card.Title>

        <Box
            w="40px"
            h="1px"
            bg="brand.acier"
            my={2}
            mx="auto"
            alignSelf="center"
        />
        
        <Card.Description 
          textAlign="center"
          fontSize="sm" 
          color="brand.gris" 
          lineHeight="1.5"
          lineClamp={3}
        >
          {description}
        </Card.Description>
      </Card.Body>

      <Card.Footer display="flex" justifyContent="center" pt={0} pb={6}>
        <Button 
            as={RouterLink}
            to={link}
            variant="outline" 
            rounded="full"
            borderColor="brand.brun"
            color="brand.brun"
            fontWeight="medium"
            size="md"
            px={6}
            _hover={{ 
                bg: "brand.brun", 
                color: "white",
                borderColor: "brand.brun"
            }}
        >
          {buttonText}
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default ToolsCard;