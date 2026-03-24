import api from "../api/api";

// Récupérer toutes les questions
export const getAllQuestions = () => {
  return api.get("/questions/all");
};

// Récupérer une question spécifique
export const getQuestionById = (id) => {
  return api.get(`/questions/${id}`);
};

// Récupérer les réponses associées à une question spécifique
export const getReponsesByQuestion = (questionId) => {
  return api.get(`/reponses-qcm/question/${questionId}`);
};

// Récupérer TOUTES les réponses (pour le mapping côté client)
export const getAllReponses = () => {
  return api.get("/reponses-qcm/all");
};

// Sauvegarder un score
export const saveQuizScore = (scoreData) => {
  return api.post("/resultats-quiz/save", scoreData);
};

// Récupérer l'historique des scores
export const getMesScores = () => {
  return api.get("/resultats-quiz/mes-scores");
};