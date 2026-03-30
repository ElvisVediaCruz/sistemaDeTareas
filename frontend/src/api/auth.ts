import api from "./axios";
import type { LoginResponse, RegisterBody, Employee } from "../types";

export const login = (usuario: string, password: string) =>
  api.post<LoginResponse>("/auth/login", { usuario, password });

export const register = (data: RegisterBody) =>
  api.post<Omit<Employee, "password">>("/auth/register", data);
