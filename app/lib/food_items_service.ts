'use server';

import { redisClient } from "./redis_client";

const redisObjectKey: string = 'food';

export type FoodItem = {
    id: string,
    name: string,
    price: number
}


export async function setFoodItemData(value: FoodItem) {
   try {
        var response =  await (await redisClient()).lPush(redisObjectKey,JSON.stringify(value))
        console.log(response);
        return response;
   } catch (error) {
        console.log(error);
        return 0;
   }
    
}

export async function getFoodItemData() : Promise<Array<FoodItem>> {
   try {
        var respose = await (await redisClient()).lRange(redisObjectKey, 0, -1)
        return respose.map((item)=>JSON.parse(item)) as Array<FoodItem>;
   } catch (error) {
        console.log(error);
        return [];
   }
}

export async function deleteFoodItemData({index,value}:{index: number, value:FoodItem}) {
   try {
        var response = await (await redisClient()).lRem(redisObjectKey,index,JSON.stringify(value))
        console.log(response);
        return response;
   } catch (error) {
        console.log(error);
        return 0;
   }
}