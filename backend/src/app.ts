import express from "express";
import cors from "cors";
import areaRoutes from "./routes/Area.routes";
import employeeRoutes from "./routes/Employee.routes";
import projectRoutes from "./routes/Project.routes";
import tareaRoutes from "./routes/Tarea.routes";
import documentRoutes from "./routes/Document.routes";
import areaProjectRoutes from "./routes/AreaProject.routes";
import authRoutes from "./routes/Auth.routes";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.use("/api/auth", authRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/empleados", employeeRoutes);
app.use("/api/proyectos", projectRoutes);
app.use("/api/tareas", tareaRoutes);
app.use("/api/documentos", documentRoutes);
app.use("/api/area-proyectos", areaProjectRoutes);

export default app;
