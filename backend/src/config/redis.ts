import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const redisClient = createClient({
  url: `redis://localhost:${process.env.PORT_REDIS}`
});

redisClient.on("error", (err) => {
  console.log("Redis error", err);
});

export const connectRedis = async () => {
  await redisClient.connect();
};