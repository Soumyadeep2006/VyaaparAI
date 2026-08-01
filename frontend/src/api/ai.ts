import api from "./axios";

export const askAI = async (prompt: string) => {
  const response = await api.post("/api/ai/chat", {
    prompt,
  });

  return response.data;
};