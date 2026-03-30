import { BaseService } from "./Base.service";
import { Tarea } from "../models/Tarea.model";
import { Proyecto, AreaProyecto } from "../models/Proyecto.model";

export class TareaService extends BaseService<Tarea> {
    constructor() {
        super(Tarea);
    }

    /** Tareas cuyo proyecto pertenece al área indicada (con includes) */
    async findByArea(id_area: number, page: number, limit: number) {
        const offset = (page - 1) * limit;
        const { count, rows } = await Tarea.findAndCountAll({
            distinct: true,
            limit,
            offset,
            include: [{
                model: Proyecto,
                required: true,
                as: "proyectos",
                include: [{
                    model: AreaProyecto,
                    required: true,
                    where: { id_area }
                }]
            }]
        });
        return { data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
    }

    /** Tareas asignadas a un empleado específico */
    async findByEmpleado(id_empleado: number, page: number, limit: number) {
        const offset = (page - 1) * limit;
        const { count, rows } = await Tarea.findAndCountAll({
            where: { id_empleado },
            limit,
            offset
        });
        return { data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
    }
}
