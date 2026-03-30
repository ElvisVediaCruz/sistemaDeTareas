import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { Proyecto } from "./Proyecto.model";

interface tareaAtributes {
    id_tarea: number,
    nombre: string,
    fecha_entrega: Date,
    estado: string,
    id_proyecto: number,
    id_empleado: number
}

interface tareaCreateAtributes extends Optional< tareaAtributes, "id_tarea" >{}

export class Tarea extends Model <tareaAtributes, tareaCreateAtributes>
    implements tareaAtributes {
        public id_tarea!: number;
        public nombre!: string;
        public fecha_entrega!: Date;
        public estado!: string;
        public id_proyecto!: number;
        public id_empleado!: number;
    }
Tarea.init({
    id_tarea: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_entrega: {
        type: DataTypes.DATE
    },
    estado: {
        type: DataTypes.STRING
    },
    id_proyecto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_empleado: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    sequelize,
    tableName: "tareas",
    timestamps: false
});