import api from "./axios";
import type { Documento } from "../types";

export const getDocumentos = () => api.get<{ data: Documento[]; total: number; page: number; limit: number; totalPages: number }>("/documentos");
export const getDocumento = (id: number) => api.get<Documento>(`/documentos/${id}`);

export const createDocumento = (nombre: string, id_tarea: number, archivo: File) => {
  const form = new FormData();
  form.append("nombre", nombre);
  form.append("id_tarea", String(id_tarea));
  form.append("archivo", archivo);
  return api.post<Documento>("/documentos", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteDocumento = (id: number) => api.delete(`/documentos/${id}`);

export const downloadDocumento = async (id: number, nombre: string) => {
  const response = await api.get(`/documentos/${id}/download`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", nombre);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
