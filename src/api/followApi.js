import api from "./axios";

export const followUser = async (userId) => {
  const res = await api.post(`/follows/${userId}`);
  return res.data;
};
export const unfollowUser = async (userId) => {
  const res = await api.delete(`/follows/${userId}`);
  return res.data;
};
export const getFollowCounts = async (userId) => {
  const res = await api.get(`/follows/${userId}/count`);
  return res.data;
};
export const checkFollowStatus = async (userId) => {
  const res = await api.get(`/follows/${userId}/status`);
  return res.data;
};