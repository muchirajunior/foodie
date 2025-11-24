'use server';

import { createClient, RedisClientType } from 'redis';

let client : RedisClientType | null = null; 

export const  redisClient =  async () : Promise<RedisClientType> =>{
    if(client != null) return client;
    console.log('Connect to redis');
    
    client = await createClient({
        username:  process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST_URL,
            port: Number.parseInt(process.env.REDIS_PORT ?? '0000')
        }
    }) .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

    return client ?? createClient();
}

