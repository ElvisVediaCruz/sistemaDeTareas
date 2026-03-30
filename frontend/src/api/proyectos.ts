import api from "./axios";
import type { Proyecto } from "../types";

export const getProyectos = () => api.get<Proyecto[]>("/proyectos");
export const getProyecto = (id: number) => api.get<Proyecto>(`/proyectos/${id}`);
export const getAlertaProyectos = (time: number) =>
  api.get<Proyecto[]>(`/proyectos/alerta/${time}`);
export const getAlertaProyectosPorArea = (id_area: number, time: number) =>
  api.get<Proyecto[]>(`/proyectos/alerta/area/${id_area}/${time}`);
export const getProyectosRetraso = (id_area: number, estado: string) =>
  api.get<Proyecto[]>(`/proyectos/retraso/area/${id_area}`, { params: { estado } });
export const createProyecto = (data: Omit<Proyecto, "id_proyecto">) =>
  api.post<Proyecto>("/proyectos", data);
export const updateProyecto = (id: number, data: Partial<Proyecto>) =>
  api.put<Proyecto>(`/proyectos/${id}`, data);
