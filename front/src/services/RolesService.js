import api from "../api/api";

export const createRole = (roleData) => {
  return api.post("/roles/register", roleData);
};

export const getAllRoles = () => {
  return api.get("/roles/all");
};

export const getRoleById = (id) => {
  return api.get(`/roles/${id}`);
};

export const updateRole = (id, roleData) => {
  return api.put(`/roles/update/${id}`, roleData);
};

export const deleteRole = (id) => {
  return api.delete(`/roles/delete/${id}`);
};