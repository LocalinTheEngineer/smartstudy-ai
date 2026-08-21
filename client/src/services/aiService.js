import api from "./api";

export const summarizeMaterial = (materialId) =>
  api.post(`/ai/summarize/${materialId}`);

export const generateQuiz = (courseId, options) =>
  api.post(`/ai/quiz/${courseId}`, options);

export const generateStudyPlan = (data) => api.post("/ai/study-plan", data);
