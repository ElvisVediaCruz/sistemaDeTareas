import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import { getDocuments, getDocument, createDocument, deleteDocument, downloadDocument } from "../controllers/Document.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

//verifyToken

router.get("/", verifyToken, getDocuments);                                    // filtrado por rol en controller
router.get("/:id/download", verifyToken, downloadDocument);                    // descarga el archivo
router.get("/:id", verifyToken, getDocument);
router.post("/", verifyToken, upload.single("archivo"), createDocument);       // ownership check en controller
router.delete("/:id", verifyToken, deleteDocument);                            // ownership check en controller

export default router;
