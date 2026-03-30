import path from "path";
import { Request, Response } from "express";
import { DocumentService } from "../services/Document.service";
import { TareaService } from "../services/Task.service";

const documentService = new DocumentService();
const tareaService = new TareaService();

export const getDocuments = async (req: Request, res: Response) => {
    const user = (req as any).user;
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

        if (user.tipo === "administrador") {
            // query simple sin includes
            const result = await documentService.findAllPaginated(page, limit);
            return res.json(result);
        } else if (user.tipo === "encargado") {
            // query con includes (datos completos) → usar Redis
            const cacheKey = `documents_encargado_${user.id}_p${page}_l${limit}`;
            const cache = await documentService.getCache(cacheKey);
            if (cache) return res.json(cache);
            const result = await documentService.findByArea(user.id_area, page, limit);
            await documentService.setCache(cacheKey, result);
            return res.json(result);
        } else {
            // empleado: query con includes (datos completos) → usar Redis
            const cacheKey = `documents_empleado_${user.id}_p${page}_l${limit}`;
            const cache = await documentService.getCache(cacheKey);
            if (cache) return res.json(cache);
            const result = await documentService.findByEmpleado(user.id, page, limit);
            await documentService.setCache(cacheKey, result);
            return res.json(result);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getDocument = async (req: Request, res: Response) => {
    try {
        const document = await documentService.find(Number(req.params.id));
        res.json(document);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const createDocument = async (req: Request, res: Response) => {
    const user = (req as any).user;
    try {
        const archivo = req.file;

        if (!archivo) {
            res.status(400).json({ message: "error file" });
            return;
        }

        if (user.tipo === "empleado") {
            const tarea = await tareaService.find(Number(req.body.id_tarea));
            if ((tarea as any).id_empleado !== user.id) {
                res.status(403).json({ message: "Solo puedes subir documentos para tus propias tareas" });
                return;
            }
        }

        archivo.filename = req.body.nombre;
        const data = {
            nombre: req.body.nombre,
            url: `/uploads/${archivo.filename}`,
            fecha: new Date(),
            id_tarea: req.body.id_tarea
        };
        const document = await documentService.create(data);
        await documentService.delCacheByPattern(`documents_encargado_*`);
        await documentService.delCacheByPattern(`documents_empleado_${user.id}_*`);
        res.status(201).json(document);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const downloadDocument = async (req: Request, res: Response) => {
    try {
        const document = await documentService.find(Number(req.params.id));
        const doc = document as any;
        const filename = path.basename(doc.url);
        const filePath = path.join(process.cwd(), "uploads", filename);
        res.download(filePath, doc.nombre);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const deleteDocument = async (req: Request, res: Response) => {
    const user = (req as any).user;
    try {
        if (user.tipo === "empleado") {
            const doc = await documentService.find(Number(req.params.id));
            const tarea = await tareaService.find((doc as any).id_tarea);
            if ((tarea as any).id_empleado !== user.id) {
                res.status(403).json({ message: "Solo puedes eliminar tus propios documentos" });
                return;
            }
        } else if (user.tipo === "encargado") {
            const pertenece = await documentService.existsInArea(Number(req.params.id), user.id_area);
            if (!pertenece) {
                res.status(403).json({ message: "Solo puedes eliminar documentos de tu área" });
                return;
            }
        }
        await documentService.delete(Number(req.params.id));
        await documentService.delCacheByPattern(`documents_encargado_*`);
        await documentService.delCacheByPattern(`documents_empleado_*`);
        res.json({ message: "Documento eliminado" });
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
