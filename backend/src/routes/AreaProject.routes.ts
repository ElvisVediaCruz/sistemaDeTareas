import { Router } from "express";
import { getAreaProjects, getAreaProject, createAreaProject, deleteAreaProject } from "../controllers/AreaProject.controllers";
import { verifyToken, isAdmin, isEncargadoOrAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", verifyToken, isEncargadoOrAdmin, getAreaProjects);
router.get("/:id", verifyToken, isEncargadoOrAdmin, getAreaProject);
router.post("/", verifyToken, isAdmin, createAreaProject);
router.delete("/:id", verifyToken, isAdmin, deleteAreaProject);

export default router;
