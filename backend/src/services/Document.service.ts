import { BaseService } from "./Base.service";
import { Documento } from "../models/Documento.model";
import { Tarea } from "../models/Tarea.model";
import { Proyecto, AreaProyecto } from "../models/Proyecto.model";

export class DocumentService extends BaseService<Documento> {
    constructor() {
        super(Documento);
    }

    /** Documentos de tareas cuyos proyectos pertenecen al área indicada (con includes) */
    async findByArea(id_area: number, page: number, limit: number) {
        const offset = (page - 1) * limit;
        const { count, rows } = await Documento.findAndCountAll({
            distinct: true,
            limit,
            offset,
            include: [{
                model: Tarea,
                as: "tarea",
                required: true,
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
            }]
        });
        return { data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
    }

    /** Documentos de tareas asignadas a un empleado específico (con includes) */
    async findByEmpleado(id_empleado: number, page: number, limit: number) {
        const offset = (page - 1) * limit;
        const { count, rows } = await Documento.findAndCountAll({
            distinct: true,
            limit,
            offset,
            include: [{
                model: Tarea,
                required: true,
                as: "tarea",
                where: { id_empleado }
            }]
        });
        return { data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
    }

    /** Verifica si un documento pertenece al área indicada (para autorización) */
    async existsInArea(id_documento: number, id_area: number): Promise<boolean> {
        const doc = await Documento.findOne({
            where: { id_documento },
            include: [{
                model: Tarea,
                as: "tarea",
                required: true,
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
            }]
        });
        return doc !== null;
    }
}
