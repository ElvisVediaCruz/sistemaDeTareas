import { BaseService } from "./Base.service";
import { Area } from "../models/Area.model";

export class AreaService extends BaseService<Area>{
    constructor (){
        super(Area);
    }
    
}