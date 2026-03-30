import { BaseService } from "./Base.service";
import { AreaProyecto } from "../models/Proyecto.model";

export class AreaProyectService extends BaseService<AreaProyecto>{
    constructor(){
        super(AreaProyecto);
    }
}