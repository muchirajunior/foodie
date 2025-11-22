import { createClient } from 'redis';

export const client = await createClient({
    username:  process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST_URL,
        port: Number.parseInt(process.env.REDIS_PORT ?? '0000')
    }
}) .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

