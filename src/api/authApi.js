import api from "./axios";

export const loginUser = async (payload) => {
  const res = await api.post("/auth/login", payload);
  return res.data;
};

export const registerUser = async (payload) => {
  const res = await api.post("/auth/register", payload);
  return res.data;
};

export const verifyEmail = async (payload) => {
  const res = await api.post("/auth/verify-email", payload);
  return res.data;
};

export const resendOtp = async (payload) => {
  const res = await api.post("/auth/resend-otp", payload);
  return res.data;
};

export const logoutUser = async (payload) => {
  const res = await api.post("/auth/logout", payload);
  return res.data;
};