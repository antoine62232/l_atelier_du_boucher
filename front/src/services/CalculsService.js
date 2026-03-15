import api from "../api/api";

export const createCalcul = (calculData) => {
  return api.post("/calculs-rendement/create", calculData);
};

export const getCalculsByUser = (userId) => {
  return api.get(`/calculs-rendement/user/${userId}`);
};

export const deleteCalcul = (id) => {
  return api.delete(`/calculs-rendement/delete/${id}`);
};