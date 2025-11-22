'use server';

import { createClient } from 'redis';

const client = await createClient({
    username:  process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST_URL,
        port: Number.parseInt(process.env.REDIS_PORT ?? '0000')
    }
}) .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

export async function setRedisData({key,value}:{key:string, value:any}) {
    var response =  await client.set(key,value)
    console.log(response);
    return response;
    
}

export async function getRedisData(params:string) {
    var respose = await client.get(params)
    return respose;
}