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

const redisObjectKey: string = 'food';

export async function setRedisData(value: string) {
    var response =  await client.lPush(redisObjectKey,value)
    console.log(response);
    return response;
    
}

export async function getRedisData() {
    var respose = await client.lRange(redisObjectKey, 0, -1)
    return respose;
}

export async function deleteRedisData({index,value}:{index: number, value:any}) {
    var response = await client.lRem(redisObjectKey,index,value)
    console.log(response);
    return response;
}