import api from "./axios";

/* Add comment to a post */
export const addComment = async (postId, data) => {
  const res = await api.post(`/comments/${postId}`, data);
  return res.data;
};

/* Get all comments for a post */
export const getComments = async (postId) => {
  const res = await api.get(`/comments/${postId}`);
  return res.data;
};