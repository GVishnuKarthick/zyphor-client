import axios from "./axios";

export async function getConversations() {
  const res = await axios.get("/conversations");
  return res.data;
}

export async function createConversation(members) {
  const res = await axios.post("/conversations", members);
  return res.data;
}
