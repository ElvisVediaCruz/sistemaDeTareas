import { Router } from "express";
import {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeesByArea,
    getHeadByArea,
    getHeads
} from "../controllers/Employee.controller";
import {
    verifyToken,
    isAdmin,
    isEncargadoOrAdmin,
    verifySameAreaOrAdmin
} from "../middlewares/auth.middleware";

const router = Router();

// Rutas estáticas primero (antes de /:id)
router.get("/jefes", verifyToken, isEncargadoOrAdmin, getHeads);
router.get("/area/:id_area", verifyToken, isEncargadoOrAdmin, verifySameAreaOrAdmin, getEmployeesByArea);
router.get("/jefe/area/:id_area", verifyToken, isEncargadoOrAdmin, verifySameAreaOrAdmin, getHeadByArea);

// CRUD — solo admin
router.get("/", verifyToken, isAdmin, getEmployees);
router.get("/:id", verifyToken, isAdmin, getEmployee);
router.post("/", verifyToken, isAdmin, createEmployee);
router.put("/:id", verifyToken, isAdmin, updateEmployee);
router.delete("/:id", verifyToken, isAdmin, deleteEmployee);

export default router;
