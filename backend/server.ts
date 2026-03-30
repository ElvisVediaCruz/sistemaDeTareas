import expres from "express";
import dotenv from "dotenv";
dotenv.config();
import app from "./src/app";
import { sequelize, Employee, Area, Proyecto, Tarea, Documento } from "./src/models/Index";
import { connectRedis } from "./src/config/redis";

async function start(){
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        await connectRedis();
        app.listen(process.env.PORT, ()=> {
        console.log(`http://localhost:${process.env.PORT}`)
    })
    } catch (error) {
        console.error("Error de conexión", error);
    }
}
start();