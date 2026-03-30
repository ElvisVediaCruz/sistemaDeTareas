import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/Auth.service";

const authService = new AuthService();

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Token requerido" });
        return;
    }

    try {
        const payload = authService.verifyToken(token);
        (req as any).user = payload;
        next();
    } catch (error) {
        res.status(403).json({ message: "Token invalido o expirado" });
    }
};

/** Solo administrador */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user?.tipo !== "administrador") {
        res.status(403).json({ message: "Acceso restringido a administradores" });
        return;
    }
    next();
};

/** Administrador o encargado */
export const isEncargadoOrAdmin = (req: Request, res: Response, next: NextFunction) => {
    const tipo = (req as any).user?.tipo;
    if (tipo !== "administrador" && tipo !== "encargado") {
        res.status(403).json({ message: "Acceso restringido a encargados y administradores" });
        return;
    }
    next();
};

/**
 * Verifica que el encargado solo acceda a su propia área.
 * El admin pasa siempre. Requiere param :id_area en la ruta.
 */
export const verifySameAreaOrAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user?.tipo === "administrador") return next();
    const id_area = Number(req.params.id_area);
    if (user?.id_area !== id_area) {
        res.status(403).json({ message: "Solo puedes acceder a tu propia área" });
        return;
    }
    next();
};
