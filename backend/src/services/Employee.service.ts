import { BaseService } from "./Base.service";
import { Employee } from "../models/Empleado.model";
import { Area } from "../models/Area.model";

export class EmployeeService extends BaseService<Employee>{
    constructor(){
        super(Employee);
    }
    //todos los empleados de un area
    async functionEmployeeArea(id_area: number){
        return this.model.findAll({
            where: { id_area },
            include: [
                {
                    model: Area,
                    as: "area"
                }
            ]
        })
    }
    //el jefe de un area en especifico
    async funtionHeadArea(id_area: number){
        return this.model.findOne({
            where: { 
                id_area, 
                id_jefe: null
            },
            include: [
                {
                    model: Employee,
                    as: "subordinados"
                }
            ]
        })
    }
    //todos los jefes
    async functionHeads(){
        return this.model.findAll({
            include: [
                {
                    model: Employee,
                    as: "subordinados"
                },
                {
                    model: Area,
                    as: "areas"
                }
            ]
        })
    }
}