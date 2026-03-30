import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Employee } from "../models/Empleado.model";

const privateKey = fs.readFileSync(path.join(__dirname, "../../keys/private.pem"));
const publicKey = fs.readFileSync(path.join(__dirname, "../../keys/public.pem"));

const SALT_ROUNDS = 10;

export class AuthService {
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, SALT_ROUNDS);
    }

    async register(data: any): Promise<Employee> {
        const hashedPassword = await this.hashPassword(data.password);
        return Employee.create({ ...data, password: hashedPassword });
    }

    async login(usuario: string, password: string): Promise<string> {
        const employee = await Employee.findOne({ where: { usuario } });
        if (!employee) throw new Error("Usuario no encontrado");

        const valid = await bcrypt.compare(password, employee.password);
        if (!valid) throw new Error("Contraseña incorrecta");

        const token = jwt.sign(
            {
                id: employee.id_empleado,
                usuario: employee.usuario,
                tipo: employee.tipo,
                id_area: employee.id_area
            },
            privateKey,
            { algorithm: "RS256", expiresIn: "8h" }
        );
        return token;
    }

    verifyToken(token: string): any {
        return jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    }
}
