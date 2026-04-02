import api from "./axios";

export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};
export const markNotificationRead = async (id) => {
  const res = await api.put(`/notifications/read/${id}`);
  return res.data;
};
export const clearNotifications = async () => {
  const res = await api.delete("/notifications/clear");
  return res.data;
};