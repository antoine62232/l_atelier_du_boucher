import React from "react";
import { Box, Text, Heading, SimpleGrid, Button } from "@chakra-ui/react";

const QuizCard = ({ currentQ, currentIndex, totalQuestions, progressPercent, onAnswer }) => {
  
  return (
    <Box bg="white" p={{ base: 5, md: 8 }} borderRadius="2xl" boxShadow="carte">
      
      {/* En-tête : Numéro de la question */}
      <Text fontWeight="bold" color="gray.600" mb={2} textAlign="center">
        Question {currentIndex + 1} sur {totalQuestions}
      </Text>
      
      {/* Barre de progression custom */}
      <Box
        w="100%" h="6px" bg="gray.100" borderRadius="full" mb={{ base: 6, md: 8 }} overflow="hidden"
        role="progressbar" aria-label="Progression du quiz"
        aria-valuemin={0} aria-valuemax={totalQuestions} aria-valuenow={currentIndex}
      >
        <Box 
            h="100%" 
            bg="brand.rouge" 
            w={`${progressPercent}%`} 
            transition="width 0.4s ease-in-out" 
        />
      </Box>

      {/* Titre de la question */}
      <Heading as="h2" size={{ base: "md", md: "lg" }} fontFamily="title" color="brand.gris" mb={{ base: 6, md: 8 }} textAlign="center" lineHeight="1.4">
        {currentQ.texteQuestion}
      </Heading>

      {/* Grille des réponses */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        {currentQ.reponses.map((reponse) => (
          <Button 
            key={reponse.idReponse}
            height="auto" minH="56px" px={5} py={4} whiteSpace="normal" fontSize="md" fontWeight="medium"
            variant="outline" borderColor="gray.300" color="gray.800" borderRadius="xl"
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