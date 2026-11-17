import React, { useState, useEffect } from "react";
import { Box, Container, Heading, Text, VStack, Button, Flex, Center, Spinner, Icon } from "@chakra-ui/react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiInfo, FiRotateCcw } from "react-icons/fi";
import { getAllQuestions, getAllReponses, saveQuizScore } from "../services/QuizService";
import QuizCard from "../components/quiz/QuizCard";


const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erreurChargement, setErreurChargement] = useState(false);
  const [scoreEnregistre, setScoreEnregistre] = useState(null);
  const estConnecte = Boolean(localStorage.getItem("authToken"));
  // Quiz limité à une pièce quand on vient de sa fiche (?pieceId=5).
  const [searchParams] = useSearchParams();
  const pieceId = Number(searchParams.get("pieceId")) || null;
  const [nomPiece, setNomPiece] = useState(null);

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
        })).filter(q => q.reponses.length > 0)
          .filter(q => !pieceId || q.pieceId === pieceId);

        setNomPiece(pieceId ? allQuestions.find(q => q.pieceId === pieceId)?.nomPiece || null : null);
        setQuestions(quizData);
        setCurrentIndex(0);
        setUserAnswers([]);
        setIsFinished(false);
      } catch (error) {
        console.error("Erreur lors du chargement du Quiz :", error);
        setErreurChargement(true);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchQuizData();
  }, [pieceId]);

  const handleAnswer = async (reponse) => {
    const currentQuestion = questions[currentIndex];
    
    const newAnswer = {
      question: currentQuestion,
      reponseChoisie: reponse,
      estCorrect: reponse.resultatReponse === 1 || reponse.resultatReponse === true
    };

    // On crée le nouveau tableau de réponses complet
    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);

    if (currentIndex < questions.length - 1) {
      // On passe à la question suivante
      setCurrentIndex(currentIndex + 1);
    } else {
      // LE QUIZ EST FINI !
      setIsFinished(true);
      
      // On calcule le score final
      const finalScore = updatedAnswers.filter(a => a.estCorrect).length;
      
      // On l'envoie à la base de données
      if (estConnecte) {
        try {
          await saveQuizScore({ score: finalScore, total: questions.length });
          setScoreEnregistre(true);
        } catch (error) {
          console.error("Erreur lors de la sauvegarde du score :", error);
          setScoreEnregistre(false);
        }
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserAnswers([]);
    setIsFinished(false);
    setScoreEnregistre(null);
    window.scrollTo(0, 0);
  };

  const enTete = (
    <Box textAlign="center" mb={{ base: 8, md: 12 }}>
      <Heading as="h1" fontFamily="title" color="brand.rouge" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
        Le Test de l'Apprenti
      </Heading>
      <Text color="gray.700" fontSize="md" maxW="600px" mx="auto">
        {isFinished
          ? "Voici vos résultats, avec la correction de chaque question."
          : pieceId
            ? `Questions sur ${nomPiece || "cette pièce"} : une seule bonne réponse par question.`
            : "Pièces, cuissons et culture bouchère : une seule bonne réponse par question."}
      </Text>
      {pieceId && (
        <Button asChild variant="ghost" color="brand.rouge" mt={2}>
          <RouterLink to="/quiz">Faire le quiz complet</RouterLink>
        </Button>
      )}
    </Box>
  );

  const cadre = (contenu) => (
    <Box bg="brand.beige" minH="calc(100vh - 100px)" pt={{ base: "120px", md: "140px" }} pb="80px">
      <Container maxW="800px" px={{ base: 4, md: 6 }}>
        {enTete}
        {contenu}
      </Container>
    </Box>
  );

  if (loading) {
    return cadre(<Center h="240px"><Spinner size="xl" color="brand.rouge" aria-label="Chargement du quiz" /></Center>);
  }

  if (questions.length === 0) {
    return cadre(
      <Box bg="white" p={{ base: 6, md: 10 }} borderRadius="2xl" boxShadow="carte" textAlign="center">
        <Heading as="h2" size="md" fontFamily="title" color="brand.gris" mb={3}>
          {erreurChargement
            ? "Le quiz n'a pas pu être chargé"
            : pieceId
              ? "Pas encore de question sur cette pièce"
              : "Le quiz est en cours de préparation"}
        </Heading>
        <Text color="gray.600" mb={6}>
          {erreurChargement
            ? "Vérifiez votre connexion puis rechargez la page."
            : "Les questions seront bientôt disponibles. En attendant, explorez l'atlas des pièces."}
        </Text>
        <Button asChild bg="brand.rouge" color="white" rounded="full" px={8} _hover={{ bg: "brand.rougeFonce" }}>
          <RouterLink to="/atlas">Explorer l'atlas</RouterLink>
        </Button>
      </Box>
    );
  }

  // --- RÉSULTATS ---
  if (isFinished) {
    const score = userAnswers.filter(a => a.estCorrect).length;
    
    return cadre(
          <VStack gap={8}>
            <Box bg="white" p={{ base: 6, md: 8 }} borderRadius="2xl" w="100%" textAlign="center" boxShadow="carte">
              <Heading as="h2" fontFamily="title" color="brand.rouge" mb={2}>Résultat final</Heading>
              <Text fontSize="2xl" fontWeight="bold" color={score > questions.length / 2 ? "green.700" : "orange.700"}>
                {score} / {questions.length}
              </Text>
              <Text fontSize="sm" color="gray.600" mt={2}>
                {!estConnecte && "Connectez-vous pour garder une trace de vos scores."}
                {estConnecte && scoreEnregistre === true && "Score enregistré dans votre Établi."}
                {estConnecte && scoreEnregistre === false && "Le score n'a pas pu être enregistré."}
              </Text>
              <Button bg="brand.rouge" color="white" rounded="full" px={8} mt={6} onClick={handleRestart} _hover={{ bg: "brand.rougeFonce" }}>
                <FiRotateCcw aria-hidden="true" /> Rejouer
              </Button>
            </Box>

            <VStack w="100%" gap={6} align="stretch">
              {userAnswers.map((item, index) => {
                const bonneReponse = item.question.reponses.find(r => r.resultatReponse === 1 || r.resultatReponse === true);

                return (
                  <Box key={item.question.idQuestion} bg="white" p={{ base: 5, md: 6 }} borderRadius="xl" boxShadow="carte" borderLeft="6px solid" borderColor={item.estCorrect ? "green.500" : "red.500"}>
                    <Flex align="flex-start" gap={3} mb={3}>
                      <Icon as={item.estCorrect ? FiCheckCircle : FiXCircle} color={item.estCorrect ? "green.600" : "red.600"} boxSize={6} flexShrink={0} aria-label={item.estCorrect ? "Bonne réponse" : "Mauvaise réponse"} />
                      <Heading as="h3" size="sm" color="gray.800" lineHeight="1.4">Question {index + 1} : {item.question.texteQuestion}</Heading>
                    </Flex>
                    
                    <Box pl={{ base: 0, md: 9 }}>
                      {item.estCorrect ? (
                        <Text color="green.700" fontWeight="bold">✓ Bonne réponse : {item.reponseChoisie.texteReponse}</Text>
                      ) : (
                        <>
                          <Text color="red.700" as="s">Votre réponse : {item.reponseChoisie.texteReponse}</Text>
                          <Text color="green.700" fontWeight="bold">✓ La bonne réponse était : {bonneReponse?.texteReponse}</Text>
                        </>
                      )}

                      {item.question.explication && (
                        <Box mt={4} p={3} bg="brand.beige" borderRadius="md">
                          <Flex gap={2}>
                            <Icon as={FiInfo} color="brand.brun" mt={1} flexShrink={0} aria-hidden="true" />
                            <Text fontSize="sm" color="brand.gris">{item.question.explication}</Text>
                          </Flex>
                        </Box>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </VStack>
          </VStack>
    );
  }

  // --- VUE 2 : LE JEU EN COURS ---
  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex) / questions.length) * 100;

  return cadre(
    <QuizCard
      currentQ={currentQ}
      currentIndex={currentIndex}
      totalQuestions={questions.length}
      progressPercent={progressPercent}
      onAnswer={handleAnswer}
    />
  );
};

export default Quiz;