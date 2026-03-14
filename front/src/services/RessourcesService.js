import api from "../api/api";

export const getAllRessources = () => {
  return api.get("/ressources/all");
};

export const getRessourceById = (id) => {
  return api.get(`/ressources/${id}`);
};