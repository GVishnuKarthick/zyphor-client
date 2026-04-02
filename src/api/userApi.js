import api from "./axios";

export const getCurrentUser = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const getSuggestions = async () => {
  const res = await api.get("/users/suggestions");
  return res.data;
};