import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface proyectoInterface {
    id_proyecto: number,
    nombre: string,
    fecha_inicio: Date,
    fecha_entrega: Date,
    estado: string
}
interface areaProInterface {
    id_area_proyecto: number,
    id_area: number,
    id_proyecto: number
}

interface proyectoCreateInterface extends Optional<proyectoInterface, "id_proyecto">{}
interface areaProCreateInterface extends Optional<areaProInterface, "id_area_proyecto">{}

export class Proyecto extends Model<proyectoInterface, proyectoCreateInterface>
    implements proyectoInterface {
        public id_proyecto!: number;
        public nombre!: string;
        public fecha_inicio!: Date;
        public fecha_entrega!: Date;
        public estado!: string;
    }
export class AreaProyecto extends Model<areaProInterface, areaProCreateInterface>
    implements areaProInterface{
        public id_area_proyecto!: number;
        public id_area!: number;
        public id_proyecto!: number;
    }
Proyecto.init({
    id_proyecto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_entrega: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    sequelize,
    tableName: "proyectos",
    timestamps: false
});
AreaProyecto.init({
    id_area_proyecto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_area: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_proyecto: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    sequelize,
    tableName: "areas_proyectos",
    timestamps: false
});
