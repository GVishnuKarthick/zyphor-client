import api from "./axios";

export const getStories = async () => {
  const res = await api.get("/stories");
  return res.data;
};

export const createStory = async (mediaUrl) => {
  const res = await api.post("/stories", {
    mediaUrl: mediaUrl
  });

  return res.data;
};

export const deleteStory = async (storyId) => {
  const res = await api.delete(`/stories/${storyId}`);
  return res.data;
};