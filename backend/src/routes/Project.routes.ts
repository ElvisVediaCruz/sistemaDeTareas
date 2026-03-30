import { Router } from "express";
import {
    getProjects,
    getProject,
    createProject,
    updateProject,
    getProjectAlert,
    getProjectAlertByArea,
    getProjectsDelayed
} from "../controllers/Project.controller";
import {
    verifyToken,
    isAdmin,
    isEncargadoOrAdmin,
    verifySameAreaOrAdmin
} from "../middlewares/auth.middleware";

const router = Router();

// Rutas estáticas primero
router.get("/alerta/:time", verifyToken, isAdmin, getProjectAlert);
router.get("/alerta/area/:id_area/:time", verifyToken, isEncargadoOrAdmin, verifySameAreaOrAdmin, getProjectAlertByArea);
router.get("/retraso/area/:id_area", verifyToken, isEncargadoOrAdmin, verifySameAreaOrAdmin, getProjectsDelayed);

// CRUD
router.get("/", verifyToken, isAdmin, getProjects);
router.get("/:id", verifyToken, isEncargadoOrAdmin, getProject);
router.post("/", verifyToken, isAdmin, createProject);
router.put("/:id", verifyToken, isEncargadoOrAdmin, updateProject);

export default router;
