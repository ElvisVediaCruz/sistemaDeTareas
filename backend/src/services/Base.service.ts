import { Model, ModelStatic } from "sequelize";
import { Op } from "sequelize";
import { redisClient } from "../config/redis";

export class BaseService<T extends Model>{
    protected model: ModelStatic<T>;

    constructor(model: ModelStatic<T>){
        this.model = model;
    }

    async getCache(key: string){
        const data = await redisClient.get(key);
        if(!data) return null;
        return JSON.parse(data);
    }
    async setCache(key: string, value: any, ttl = 60){
        await redisClient.set(
            key,
            JSON.stringify(value),
            { EX: ttl}
        )
    }
    async delCache(key: string){
        await redisClient.del(key);
    }
    async delCacheByPattern(pattern: string){
        let cursor = "0";
        do {
            const result = await redisClient.scan(cursor, { MATCH: pattern, COUNT: 100 });
            cursor = result.cursor;
            if (result.keys.length > 0) {
                await redisClient.del(result.keys);
            }
        } while (cursor !== "0");
    }
    async create(data: any){
        if(Array.isArray(data)){
            return this.model.bulkCreate(data);
        }
        return this.model.create(data);
    }
    async fUpdate(data: any, id: number){
        const instance = await this.model.findByPk(id);
        if(!instance) throw new Error("no encontrado");
        return instance.update(data);
    }
    async delete(id: number){
        const instance = await this.model.findByPk(id);
        if(!instance) throw new Error("no encontrado");
        return instance.destroy();
    }
    async findAll(){
        return this.model.findAll();
    }
    async findAllPaginated(page: number, limit: number){
        const offset = (page - 1) * limit;
        const { count, rows } = await this.model.findAndCountAll({ limit, offset });
        return { data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
    }
    async find(id: number){
        const instance = await this.model.findByPk(id);
        if(!instance) throw new Error("no encontrado");
        return instance;
    }

}
