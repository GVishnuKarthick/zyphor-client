import api from "./axios";

export const toggleLike = async (postId) => {
  const res = await api.post(`/likes/${postId}`);
  return res.data;
};

export const getLikes = async (postId) => {
  const res = await api.get(`/likes/${postId}`);
  return res.data;
};