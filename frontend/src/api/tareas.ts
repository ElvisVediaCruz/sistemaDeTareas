import api from "./axios";
import type { Tarea } from "../types";

export const getTareas = () => api.get<{ data: Tarea[]; total: number; page: number; limit: number; totalPages: number }>("/tareas");
export const getTarea = (id: number) => api.get<Tarea>(`/tareas/${id}`);
export const createTarea = (data: Omit<Tarea, "id_tarea" | "proyecto" | "empleado" | "documentos">) =>
  api.post<Tarea>("/tareas", data);
export const updateTarea = (id: number, data: Partial<Tarea>) =>
  api.put<Tarea>(`/tareas/${id}`, data);
export const deleteTarea = (id: number) => api.delete(`/tareas/${id}`);
