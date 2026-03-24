import React from "react";
import { Box, Flex, Text, Heading, Badge, VStack } from "@chakra-ui/react";
import { FiCheckCircle, FiXCircle, FiAward } from "react-icons/fi";

const ScoreCard = ({ quiz }) => {
  // On calcule le pourcentage pour savoir si c'est une réussite
  const pourcentage = (quiz.score / quiz.total) * 100;
  const isSuccess = pourcentage >= 50; // On considère que la moyenne suffit pour valider

  // Formatage de la date
  const dateStr = new Date(quiz.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <Box 
        bg="white" 
        p={4} 
        borderRadius="lg" 
        border="1px solid" 
        borderColor={isSuccess ? "green.200" : "red.200"} 
        boxShadow="sm"
        transition="all 0.2s"
        _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
    >
      <Flex justify="space-between" align="flex-start" mb={3}>
        <VStack align="start" gap={1}>
            <Badge bg={isSuccess ? "green.50" : "red.50"} color={isSuccess ? "green.600" : "red.500"} fontSize="xs" display="flex" alignItems="center" gap={1}>
                {isSuccess ? <FiCheckCircle /> : <FiXCircle />}
                {isSuccess ? "Validé" : "À réviser"}
            </Badge>
            <Heading size="sm" color="brand.gris" fontFamily="title" noOfLines={2}>
                {quiz.titre}
            </Heading>
        </VStack>
        <Box textAlign="right">
            <Text fontSize="xs" color="gray.500" mb={1}>{dateStr}</Text>
            <Flex align="center" justify="flex-end" gap={1} color={isSuccess ? "green.600" : "red.500"} fontWeight="bold" fontSize="lg">
                <FiAward /> {quiz.score}/{quiz.total}
            </Flex>
        </Box>
      </Flex>
      
      {/* Petite barre de progression visuelle intégrée à la carte */}
      <Box w="100%" bg="gray.100" h="4px" borderRadius="full" overflow="hidden">
          <Box w={`${pourcentage}%`} h="100%" bg={isSuccess ? "green.400" : "red.400"} />
      </Box>
    </Box>
  );
};

export default ScoreCard;