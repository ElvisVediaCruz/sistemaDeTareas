import { Router } from "express";
import { getTareas, getTarea, createTarea, updateTarea, deleteTarea } from "../controllers/Tarea.controller";
import { verifyToken, isEncargadoOrAdmin } from "../middlewares/auth.middleware";

const router = Router();
//verifyToken
router.get("/", verifyToken, getTareas);           // filtrado por rol en el controller
router.get("/:id", verifyToken, getTarea);         // ownership check para empleado en controller
router.post("/", verifyToken, isEncargadoOrAdmin, createTarea);
router.put("/:id", verifyToken, updateTarea);      // ownership check para empleado en controller
router.delete("/:id", verifyToken, isEncargadoOrAdmin, deleteTarea);

export default router;
