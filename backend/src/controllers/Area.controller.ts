import { Request, Response } from "express";
import { AreaService } from "../services/Area.service";

const areaService = new AreaService();

export const getAreas = async (req: Request, res: Response) => {
    try {
        const areas = await areaService.findAll();
        res.json(areas);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getArea = async (req: Request, res: Response) => {
    try {
        const area = await areaService.find(Number(req.params.id));
        res.json(area);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const createArea = async (req: Request, res: Response) => {
    try {
        const area = await areaService.create(req.body);
        res.status(201).json(area);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateArea = async (req: Request, res: Response) => {
    try {
        const area = await areaService.fUpdate(req.body, Number(req.params.id));
        res.json(area);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const deleteArea = async (req: Request, res: Response) => {
    try {
        await areaService.delete(Number(req.params.id));
        res.json({ message: "Area eliminada" });
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
