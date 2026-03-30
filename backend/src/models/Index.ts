import { sequelize } from "../config/database";

import { Area } from "./Area.model";
import { Employee } from "./Empleado.model";
import { Proyecto } from "./Proyecto.model";
import { Tarea } from "./Tarea.model";
import { Documento } from "./Documento.model";

import { applyAssociations } from "./associations";

// ejecutar relaciones
applyAssociations();

export {
  sequelize,
  Area,
  Employee,
  Proyecto,
  Tarea,
  Documento
};