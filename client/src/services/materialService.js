import api from "./api";

export const getMaterials = (courseId) => api.get(`/materials/course/${courseId}`);
export const addNoteMaterial = (courseId, data) =>
  api.post(`/materials/course/${courseId}/note`, data);
export const uploadMaterialFile = (courseId, formData) =>
  api.post(`/materials/course/${courseId}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteMaterial = (id) => api.delete(`/materials/${id}`);
