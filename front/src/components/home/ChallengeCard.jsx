import React from "react";
import {
  Card,
  Button,
  Box,
  Heading,
  Text
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const ChallengeCard = ({
  title,
  description,
  buttonText,
  link,
  iconChar,
  titleColor = "brand.gris",
  iconBg = "gray.100",
  iconColor = "gray.600",
  btnColor = "brand.gris",
  btnBorderColor = "gray.300"
}) => {
  return (
    <Card.Root
      bg="white"
      boxShadow="carte"
      borderRadius="xl"
      border="none"
      overflow="hidden"
      variant="elevated"
      h="100%"
      py={{ base: 6, md: 8 }}
      px={{ base: 4, md: 6 }}
      textAlign="center"
      transition="transform 0.3s"
      _hover={{ transform: "translateY(-4px)", boxShadow: "carteSurvol" }}
    >
      <Card.Body gap={6} w="100%">
        <Box
          position="relative"
          w="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          minH="64px"
        >
          <Box
            w="64px"
            h="64px"
            bg={iconBg}
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={iconColor}
            fontSize="2xl"
            fontFamily="title"
            aria-hidden="true"
          >
            {iconChar}
          </Box>
        </Box>

        <Heading
          as="h3"
          mt="2"
          fontFamily="title"
          fontSize={{ base: "2xl", md: "3xl" }}
          color={titleColor}
          fontWeight="bold"
          lineHeight="1.2"
          mb={0}
          px={{ base: 0, md: "20px" }}
        >
          {title}
        </Heading>

        <Text
          fontSize="md"
          color="brand.gris"
          fontWeight="medium"
          lineHeight="1.6"
          maxW="320px"
          mx="auto"
        >
          {description}
        </Text>
      </Card.Body>

      <Card.Footer justifyContent="center" w="100%" pt={4}>
        <Button
          as={RouterLink}
          to={link}
          variant="outline"
          rounded="full"
          size="lg"
          px={8}
          height="50px"
          fontSize="sm"
          fontFamily="title"
          fontWeight="bold"
          textTransform="uppercase"
          color={btnColor}
          borderColor={btnBorderColor}
          borderWidth="2px"
          _hover={{
            bg: btnColor,
            color: "white"
          }}
        >
          {buttonText}
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default ChallengeCard;