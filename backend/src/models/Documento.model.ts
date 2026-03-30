import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface documentoAtributes {
    id_documento: number,
    nombre: string,
    url: string,
    fecha: Date,
    id_tarea: number
}

interface documentCreateAtributes extends Optional <documentoAtributes, "id_documento">{}

export class Documento extends Model<documentoAtributes, documentCreateAtributes> 
    implements documentoAtributes {
        public id_documento!: number;
        public nombre!: string;
        public url!: string;
        public fecha!: Date;
        public id_tarea!: number;
    }
Documento.init({
    id_documento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE
    },
    id_tarea: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    sequelize,
    tableName: "documentos",
    timestamps: false
});