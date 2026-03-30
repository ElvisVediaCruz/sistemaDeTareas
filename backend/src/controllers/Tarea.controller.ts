import { Request, Response } from "express";
import { TareaService } from "../services/Task.service";

const tareaService = new TareaService();

export const getTareas = async (req: Request, res: Response) => {
    const user = (req as any).user;
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

        if (user.tipo === "administrador") {
            const result = await tareaService.findAllPaginated(page, limit);
            return res.json(result);
        } else if (user.tipo === "encargado") {
            // query con includes (datos completos) → usar Redis
            const cacheKey = `task_encargado_${user.id}_p${page}_l${limit}`;
            const cache = await tareaService.getCache(cacheKey);
            if (cache) return res.json(cache);
            const result = await tareaService.findByArea(user.id_area, page, limit);
            await tareaService.setCache(cacheKey, result);
            return res.json(result);
        } else {
            // empleado: query simple sin includes
            const result = await tareaService.findByEmpleado(user.id, page, limit);
            return res.json(result);
        }
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

export const getTarea = async (req: Request, res: Response) => {
    const user = (req as any).user;
    try {
        const tarea = await tareaService.find(Number(req.params.id));
        if (user.tipo === "empleado" && (tarea as any).id_empleado !== user.id) {
            res.status(403).json({ message: "No tienes acceso a esta tarea" });
            return;
        }
        res.json(tarea);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const createTarea = async (req: Request, res: Response) => {
    try {
        const tarea = await tareaService.create(req.body);
        await tareaService.delCacheByPattern(`task_encargado_*`);
        res.status(201).json(tarea);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateTarea = async (req: Request, res: Response) => {
    const user = (req as any).user;
    try {
        if (user.tipo === "empleado") {
            const tarea = await tareaService.find(Number(req.params.id));
            if ((tarea as any).id_empleado !== user.id) {
                res.status(403).json({ message: "Solo puedes actualizar tus propias tareas" });
                return;
            }
        }
        const tarea = await tareaService.fUpdate(req.body, Number(req.params.id));
        await tareaService.delCacheByPattern(`task_encargado_*`);
        res.json(tarea);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const deleteTarea = async (req: Request, res: Response) => {
    try {
        await tareaService.delete(Number(req.params.id));
        await tareaService.delCacheByPattern(`task_encargado_*`);
        res.json({ message: "Tarea eliminada" });
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
