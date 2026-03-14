import api from "../api/api";

// Récupérer toutes les pièces
export const getAllPieces = () => {
  return api.get("/pieces/all");
};

// Récupérer une pièce par son ID
export const getPieceById = (id) => {
  return api.get(`/pieces/${id}`);
};

// Récupérer toutes les pièces d'une partie spécifique
export const getPiecesByPartie = (partieId) => {
  return api.get(`/pieces/partie/${partieId}`);
};