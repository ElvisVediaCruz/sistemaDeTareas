import { Router } from "express";
import { getAreas, getArea, createArea, updateArea, deleteArea } from "../controllers/Area.controller";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", verifyToken, getAreas);
router.get("/:id", verifyToken, getArea);
router.post("/", verifyToken, isAdmin, createArea);
router.put("/:id", verifyToken, isAdmin, updateArea);
router.delete("/:id", verifyToken, isAdmin, deleteArea);

export default router;
