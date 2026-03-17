import React, { useState, useEffect } from "react";
import { Box, Container, Heading, Text, VStack, Button, Flex, Center, Spinner, Icon } from "@chakra-ui/react";
import { FiCheckCircle, FiXCircle, FiInfo, FiRotateCcw } from "react-icons/fi";
import { getAllQuestions, getAllReponses } from "../services/QuizService";
import QuizCard from "../components/quiz/QuizCard";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const [questionsRes, reponsesRes] = await Promise.all([
          getAllQuestions(),
          getAllReponses()
        ]);

        const allQuestions = questionsRes.data;
        const allReponses = reponsesRes.data;

        const quizData = allQuestions.map(q => ({
          ...q,
          reponses: allReponses.filter(r => r.questionId === q.idQuestion)
        })).filter(q => q.reponses.length > 0); 

        setQuestions(quizData);
      } catch (error) {
        console.error("Erreur lors du chargement du Quiz :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  const handleAnswer = (reponse) => {
    const currentQuestion = questions[currentIndex];
    
    const newAnswer = {
      question: currentQuestion,
      reponseChoisie: reponse,
      estCorrect: reponse.resultatReponse === 1 || reponse.resultatReponse === true
    };

    setUserAnswers([...userAnswers, newAnswer]);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserAnswers([]);
    setIsFinished(false);
  };

  if (loading) return <Center h="70vh"><Spinner size="xl" color="brand.rouge" /></Center>;
  if (questions.length === 0) return <Center h="70vh"><Text>Aucune question disponible pour le moment.</Text></Center>;

  // --- RÉSULTATS ---
  if (isFinished) {
    const score = userAnswers.filter(a => a.estCorrect).length;
    
    return (
      <Box bg="brand.beige" minH="calc(100vh - 100px)" pt="140px" pb="80px">
        <Container maxW="800px">
          
          <Box textAlign="center" mb={12}>
            <Heading fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
              Le Test de l'Apprenti
            </Heading>
            <Text color="gray.600" fontSize="md" maxW="600px" mx="auto">
              Voici vos résultats. Prenez le temps de lire les explications du chef boucher !
            </Text>
          </Box>

          <VStack spacing={8}>
            <Box bg="white" p={8} borderRadius="2xl" w="100%" textAlign="center" shadow="lg">
              <Heading color="brand.rouge" mb={2}>Résultat Final</Heading>
              <Text fontSize="2xl" fontWeight="bold" color={score > questions.length / 2 ? "green.500" : "orange.500"}>
                Votre score : {score} / {questions.length}
              </Text>
              <Button leftIcon={<FiRotateCcw />} colorScheme="red" bg="brand.rouge" mt={6} onClick={handleRestart}>
                Rejouer
              </Button>
            </Box>

            <VStack w="100%" spacing={6} align="stretch">
              {userAnswers.map((item, index) => {
                const bonneReponse = item.question.reponses.find(r => r.resultatReponse === 1 || r.resultatReponse === true);

                return (
                  <Box key={index} bg="white" p={6} borderRadius="xl" shadow="sm" borderLeft="6px solid" borderColor={item.estCorrect ? "green.400" : "red.400"}>
                    <Flex align="center" gap={3} mb={3}>
                      <Icon as={item.estCorrect ? FiCheckCircle : FiXCircle} color={item.estCorrect ? "green.500" : "red.500"} boxSize={6} />
                      <Heading size="sm" color="gray.700">Question {index + 1} : {item.question.texteQuestion}</Heading>
                    </Flex>
                    
                    <Box pl={9}>
                      {item.estCorrect ? (
                        <Text color="green.600" fontWeight="bold">✓ Bonne réponse : {item.reponseChoisie.texteReponse}</Text>
                      ) : (
                        <>
                          <Text color="red.500" as="s">Votre réponse : {item.reponseChoisie.texteReponse}</Text>
                          <Text color="green.600" fontWeight="bold">✓ La bonne réponse était : {bonneReponse?.texteReponse}</Text>
                        </>
                      )}

                      {item.question.explication && (
                        <Box mt={4} p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.100">
                          <Flex gap={2}>
                            <Icon as={FiInfo} color="blue.500" mt={1} />
                            <Text fontSize="sm" color="blue.800">{item.question.explication}</Text>
                          </Flex>
                        </Box>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </VStack>
          </VStack>
        </Container>
      </Box>
    );
  }

  // --- VUE 2 : LE JEU EN COURS ---
  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex) / questions.length) * 100;

  return (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt="140px" pb="80px">
      <Container maxW="800px">
        
        <Box textAlign="center" mb={12}>
          <Heading fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
            Le Test de l'Apprenti
          </Heading>
          <Text color="gray.600" fontSize="md" maxW="600px" mx="auto">
            Testez vos connaissances sur les pièces de viande, les cuissons et la culture bouchère. Une seule bonne réponse possible par question !
          </Text>
        </Box>

        <QuizCard 
          currentQ={currentQ} 
          currentIndex={currentIndex} 
          totalQuestions={questions.length} 
          progressPercent={progressPercent} 
          onAnswer={handleAnswer} 
        />
      </Container>
    </Box>
  );
};

export default Quiz;