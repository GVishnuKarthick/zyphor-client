import api from "./axios";

export const createPost = async (formData) => {
  const res = await api.post("/posts", formData); // remove headers
  return res.data;
};

export const getPosts = async () => {
  const res = await api.get("/posts");
  return res.data;
};

export const deletePost = async (postId) => {
  const res = await api.delete(`/posts/${postId}`);
  return res.data;
};

export const getUserPosts = async (userId) => {
  const res = await api.get(`/posts/user/${userId}`);
  return res.data;
};