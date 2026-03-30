import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface EmployeeAtributes {
    id_empleado: number,
    nombre: string,
    apellido: string,
    edad: number,
    usuario: string,
    password: string,
    cargo: string,
    tipo: string,
    id_area: number| null,
    id_jefe: number | null
}

interface EmployeeCreationAtributes extends Optional<EmployeeAtributes, "id_empleado"> {}

export class Employee extends Model<EmployeeAtributes, EmployeeCreationAtributes>
    implements EmployeeAtributes{
        public id_empleado!: number;
        public nombre!: string;
        public apellido!: string;
        public edad!: number;
        public usuario!: string;
        public password!: string;
        public cargo!: string;
        public tipo!: string;
        public id_area!: number;
        public id_jefe!: number;
    }
Employee.init(
  {
    id_empleado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false
    },
    edad: {
      type: DataTypes.INTEGER
    },
    usuario: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cargo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING
    },
    id_area: {
      type: DataTypes.INTEGER
    },
    id_jefe: {
      type: DataTypes.INTEGER
    }
  },
  {
    sequelize,
    tableName: "empleados",
    timestamps: false
  }
);