import api from "./axios";

export const updateProfile = async (formData) => {
  const res = await api.put("/users/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};