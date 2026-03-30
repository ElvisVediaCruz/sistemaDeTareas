import { Request, Response } from "express";
import { AreaProyectService } from "../services/AreaProyect.service";

const areaProjectService = new AreaProyectService();

export const getAreaProjects = async (req: Request, res: Response) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
        const result = await areaProjectService.findAllPaginated(page, limit);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAreaProject = async (req: Request, res: Response) => {
    try {
        const relation = await areaProjectService.find(Number(req.params.id));
        res.json(relation);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const createAreaProject = async (req: Request, res: Response) => {
    try {
        const relation = await areaProjectService.create(req.body);
        res.status(201).json(relation);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteAreaProject = async (req: Request, res: Response) => {
    try {
        await areaProjectService.delete(Number(req.params.id));
        res.json({ message: "Relacion area-proyecto eliminada" });
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
