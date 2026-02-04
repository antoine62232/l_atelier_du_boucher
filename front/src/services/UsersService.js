import api from "../api/api";

export const registerUser = (userData) => {
  return api.post("/users/register", userData);
};

export const loginUser = async (credentials) => {
  const response = await api.post("/users/login", credentials);

  const { token, user } = response.data;

  if (token) {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  window.location.reload();
};

export const getAllUsers = () => {
  return api.get("/users/all");
};

export const getProfile = () => {
  return api.get("/users/profile");
};

export const forgotPassword = (email) => {
  return api.post("/users/forgot-password", { email });
};