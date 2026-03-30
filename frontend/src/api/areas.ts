import api from "./axios";
import type { Area } from "../types";

export const getAreas = () => api.get<Area[]>("/areas");
export const getArea = (id: number) => api.get<Area>(`/areas/${id}`);
export const createArea = (data: Omit<Area, "id_area">) =>
  api.post<Area>("/areas", data);
export const updateArea = (id: number, data: Partial<Area>) =>
  api.put<Area>(`/areas/${id}`, data);
export const deleteArea = (id: number) => api.delete(`/areas/${id}`);
