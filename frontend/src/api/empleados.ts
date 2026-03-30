import api from "./axios";
import type { Employee } from "../types";

export const getEmpleados = () => api.get<Employee[]>("/empleados");
export const getEmpleado = (id: number) => api.get<Employee>(`/empleados/${id}`);
export const getJefes = () => api.get<Employee[]>("/empleados/jefes");
export const getEmpleadosPorArea = (id_area: number) =>
  api.get<Employee[]>(`/empleados/area/${id_area}`);
export const getJefeDeArea = (id_area: number) =>
  api.get<Employee>(`/empleados/jefe/area/${id_area}`);
export const createEmpleado = (data: Omit<Employee, "area" | "subordinados" | "jefe">) =>
  api.post<Employee>("/empleados", data);
export const updateEmpleado = (id: number, data: Partial<Employee>) =>
  api.put<Employee>(`/empleados/${id}`, data);
export const deleteEmpleado = (id: number) => api.delete(`/empleados/${id}`);
