import api from "./axios";
import type { AreaProyecto } from "../types";

export const getAreaProyectos = () => api.get<AreaProyecto[]>("/area-proyectos");
export const getAreaProyecto = (id: number) =>
  api.get<AreaProyecto>(`/area-proyectos/${id}`);
export const createAreaProyecto = (data: Omit<AreaProyecto, "id_area_proyecto" | "area" | "proyecto">) =>
  api.post<AreaProyecto>("/area-proyectos", data);
export const deleteAreaProyecto = (id: number) =>
  api.delete(`/area-proyectos/${id}`);
