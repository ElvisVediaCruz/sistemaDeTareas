import { Op } from "sequelize";
import { BaseService } from "./Base.service";
import { Proyecto } from "../models/Proyecto.model";
import { Area } from "../models/Area.model";

export class ProjectService extends BaseService<Proyecto>{
    constructor(){
        super(Proyecto);
    }
    //proyectos de esta semana
    async functionAlert(time: number){
        const hoy = new Date();
        hoy.setHours(0,0,0,0);
        const limite = new Date();
        limite.setDate(hoy.getDate() + time);
        limite.setHours(23,59,59,999);
        return this.model.findAll({
            where: {
                fecha_entrega: {
                    [Op.between]: [hoy, limite]
                }
                },
        })
    }
    // fecha de entrega de proyectos por area
    async functionAlertProyectArea(id_area: number, time: number){
        const hoy = new Date();
        hoy.setHours(0,0,0,0);
        const limite = new Date();
        limite.setDate(hoy.getDate() + time);
        limite.setHours(23,59,59,999);
        return this.model.findAll({
            where: {
                fecha_entrega: {
                    [Op.between]: [hoy, limite]
                }
            },
            include: [
                {
                    model: Area,
                    as: "areas",
                    where: {
                        id_area
                    },
                    through: {attributes: []}
                }
            ]
        })
    }
    //proyectos no entregados
    async functionProjectDelay(estado: string, id_area: number){
        return this.model.findAll({
            where: {estado: estado},
            include: [
                {
                    model: Area,
                    as: "areas",
                    where: { id_area }
                }
            ]
        })
    }

}