import { Request, Response } from "express";
import { ProjectService } from "../services/Project.service";

const projectService = new ProjectService();

export const getProjects = async (req: Request, res: Response) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
        const result = await projectService.findAllPaginated(page, limit);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getProject = async (req: Request, res: Response) => {
    try {
        const project = await projectService.find(Number(req.params.id));
        res.json(project);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const createProject = async (req: Request, res: Response) => {
    try {
        const project = await projectService.create(req.body);
        res.status(201).json(project);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateProject = async (req: Request, res: Response) => {
    try {
        const project = await projectService.fUpdate(req.body, Number(req.params.id));
        res.json(project);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const getProjectAlert = async (req: Request, res: Response) => {
    try {
        const projects = await projectService.functionAlert(Number(req.params.time));
        res.json(projects);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getProjectAlertByArea = async (req: Request, res: Response) => {
    try {
        const projects = await projectService.functionAlertProyectArea(
            Number(req.params.id_area),
            Number(req.params.time)
        );
        res.json(projects);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getProjectsDelayed = async (req: Request, res: Response) => {
    try {
        const { estado } = req.query;
        const projects = await projectService.functionProjectDelay(
            String(estado),
            Number(req.params.id_area)
        );
        res.json(projects);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
