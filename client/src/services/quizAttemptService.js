import api from "./api";

export const saveQuizAttempt = (data) => api.post("/quiz-attempts", data);
export const getQuizAttempts = () => api.get("/quiz-attempts");
export const getQuizStats = () => api.get("/quiz-attempts/stats");
