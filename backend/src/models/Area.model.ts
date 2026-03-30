import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface areaAtributes {
    id_area: number,
    nombre: string,
    
}

interface areaCreationsAtribute extends Optional<areaAtributes, "id_area">{}

export class Area extends Model< areaAtributes, areaCreationsAtribute>
    implements areaAtributes {
        public id_area!: number;
        public nombre!: string;
        
    }
Area.init({
    id_area: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
    },{
        sequelize,
        tableName: "areas",
        timestamps: false
    }
)