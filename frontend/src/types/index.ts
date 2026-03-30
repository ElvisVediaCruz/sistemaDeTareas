export interface Area {
  id_area: number;
  nombre: string;
}

export interface Employee {
  id_empleado: number;
  nombre: string;
  apellido: string;
  edad?: number;
  usuario: string;
  password?: string;
  cargo: string;
  tipo?: "administrador" | "encargado" | "empleado";
  id_area?: number;
  id_jefe?: number | null;
  area?: Area;
  subordinados?: Employee[];
  jefe?: Employee;
}

export interface Proyecto {
  id_proyecto: number;
  nombre: string;
  fecha_inicio: string;
  fecha_entrega: string;
  estado: string;
}

export interface AreaProyecto {
  id_area_proyecto: number;
  id_area: number;
  id_proyecto: number;
  area?: Area;
  proyecto?: Proyecto;
}

export interface Tarea {
  id_tarea: number;
  nombre: string;
  fecha_entrega?: string;
  estado?: string;
  id_proyecto?: number;
  id_empleado?: number;
  proyecto?: Proyecto;
  empleado?: Employee;
  documentos?: Documento[];
}

export interface Documento {
  id_documento: number;
  nombre: string;
  url: string;
  fecha?: string;
  id_tarea?: number;
  tarea?: Tarea;
}

export interface AuthPayload {
  id: number;
  usuario: string;
  tipo: string;
  id_area: number;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterBody {
  id_empleado: number;
  nombre: string;
  apellido: string;
  edad?: number;
  usuario: string;
  password: string;
  cargo: string;
  tipo?: string;
  id_area?: number;
  id_jefe?: number | null;
}
