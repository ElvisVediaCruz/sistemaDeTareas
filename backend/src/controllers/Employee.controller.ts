import { Request, Response } from "express";
import { EmployeeService } from "../services/Employee.service";
import { AuthService } from "../services/Auth.service";

const employeeService = new EmployeeService();
const authService = new AuthService();

export const getEmployees = async (req: Request, res: Response) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
        const result = await employeeService.findAllPaginated(page, limit);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getEmployee = async (req: Request, res: Response) => {
    try {
        const employee = await employeeService.find(Number(req.params.id));
        res.json(employee);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const createEmployee = async (req: Request, res: Response) => {
    try {
        const hash = await authService.hashPassword(req.body.password);
        req.body.password = hash;
        const employee = await employeeService.create(req.body);
        res.status(201).json(employee);
    } catch (error: any) {
        console.log(error.message)
        res.status(400).json({ message: error.message });
    }
};

export const updateEmployee = async (req: Request, res: Response) => {
    try {
        const employee = await employeeService.fUpdate(req.body, Number(req.params.id));
        res.json(employee);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        await employeeService.find(Number(req.params.id));
        await employeeService.delete(Number(req.params.id));
        res.json({ message: "Empleado eliminado" });
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const getEmployeesByArea = async (req: Request, res: Response) => {
    try {
        const employees = await employeeService.functionEmployeeArea(Number(req.params.id_area));
        res.json(employees);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getHeadByArea = async (req: Request, res: Response) => {
    try {
        const head = await employeeService.funtionHeadArea(Number(req.params.id_area));
        res.json(head);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getHeads = async (req: Request, res: Response) => {
    try {
        const heads = await employeeService.functionHeads();
        res.json(heads);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
