import { Area } from "./Area.model";
import { Employee } from "./Empleado.model";
import { Proyecto } from "./Proyecto.model";
import { AreaProyecto } from "./Proyecto.model";
import { Tarea } from "./Tarea.model";
import { Documento } from "./Documento.model";

export function applyAssociations() {

  // AREA -> EMPLOYEES
  Area.hasMany(Employee, {
    foreignKey: "id_area",
    as: "empleados"
  });

  Employee.belongsTo(Area, {
    foreignKey: "id_area",
    as: "area"
  });

  // EMPLOYEE -> EMPLOYEE (jefe)
  Employee.hasMany(Employee, {
    foreignKey: "id_jefe",
    as: "subordinados"
  });

  Employee.belongsTo(Employee, {
    foreignKey: "id_jefe",
    as: "jefe"
  });

  // TAREA -> DOCUMENTOS
  Tarea.hasMany(Documento, {
    foreignKey: "id_tarea",
    as: "documentos"
  });

  Documento.belongsTo(Tarea, {
    foreignKey: "id_tarea",
    as: "tarea"
  });
  Proyecto.hasMany(Tarea, {
    foreignKey: "id_proyecto"
  });
  Tarea.belongsTo(Proyecto, {
    foreignKey: "id_proyecto",
    as: "proyectos"
  });
  Area.hasMany(AreaProyecto, {
    foreignKey: "id_area",
    as: "areasproyectos"
  })
  Proyecto.hasMany(AreaProyecto, {
    foreignKey: "id_proyecto"
  });
  AreaProyecto.belongsTo(Proyecto, {
    foreignKey: "id_proyecto"
  });
  AreaProyecto.belongsTo(Area, {
    foreignKey: "id_area"
  });
  Employee.hasMany(Tarea, {
    foreignKey: "id_empleado"
  });
  Tarea.belongsTo(Employee, {
    foreignKey: "id_empleado"
  });
}