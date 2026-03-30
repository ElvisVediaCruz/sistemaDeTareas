import { Request, Response } from "express";
import { AuthService } from "../services/Auth.service";

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
    try {
        const employee = await authService.register(req.body);
        const { password, ...data } = employee.toJSON();
        res.status(201).json(data);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { usuario, password } = req.body;
        if (!usuario || !password) {
            res.status(400).json({ message: "Usuario y contraseña requeridos" });
            return;
        }
        const token = await authService.login(usuario, password);
        res.json({ token });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};
