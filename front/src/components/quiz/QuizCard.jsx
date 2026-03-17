import React from "react";
import { Box, Text, Heading, SimpleGrid, Button } from "@chakra-ui/react";

const QuizCard = ({ currentQ, currentIndex, totalQuestions, progressPercent, onAnswer }) => {
  
  return (
    <Box bg="white" p={8} borderRadius="2xl" shadow="lg">
      
      {/* En-tête : Numéro de la question */}
      <Text fontWeight="bold" color="gray.500" mb={2} textAlign="center">
        Question {currentIndex + 1} sur {totalQuestions}
      </Text>
      
      {/* Barre de progression custom */}
      <Box w="100%" h="6px" bg="gray.100" borderRadius="full" mb={8} overflow="hidden">
        <Box 
            h="100%" 
            bg="brand.rouge" 
            w={`${progressPercent}%`} 
            transition="width 0.4s ease-in-out" 
        />
      </Box>

      {/* Titre de la question */}
      <Heading size="lg" color="brand.brun" mb={8} textAlign="center" lineHeight="1.4">
        {currentQ.texteQuestion}
      </Heading>

      {/* Grille des réponses */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        {currentQ.reponses.map((reponse) => (
          <Button 
            key={reponse.idReponse}
            height="auto" p={6} whiteSpace="normal"
            variant="outline" colorScheme="red" borderColor="gray.300" color="gray.700"
            _hover={{ bg: "brand.rouge", color: "white", borderColor: "brand.rouge" }}
            onClick={() => onAnswer(reponse)} 
          >
            {reponse.texteReponse}
          </Button>
        ))}
      </SimpleGrid>

    </Box>
  );
};

export default QuizCard;