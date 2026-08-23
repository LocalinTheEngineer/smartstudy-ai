import api from "./api";

export const summarizeText = (text) => api.post("/ai/summarize", { text });
export const summarizeMaterial = (materialId) => api.post("/ai/summarize", { materialId });
export const generateQuiz = (topic, questionCount, difficulty) =>
  api.post("/ai/quiz", { topic, questionCount, difficulty });
export const generateStudyPlan = (data) => api.post("/ai/study-plan", data);
