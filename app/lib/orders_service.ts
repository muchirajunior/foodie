import { redisClient } from "./redis_client";

export type Order = {
    id: string,
    docNum: number,
    customerName: string,
    documentTotal: number,
    items : Array<OrderItem>,
}

type OrderItem = {
    itemID: string,
    itemName: string,
    quantity: number,
    price: number,
}

export async function createOrder(order: Order) : Promise<String | null> {
    try {
        var response =  await (await redisClient()).hSet(`orders:${order.id}`,Object(order))
        if(response === 1) return null;
        return 'Error creating order.';
    } catch (error: any) {
        return error.toString()
    }
}

export async function getAllOrders() {
    try {
        var response =  await (await redisClient()).hGetAll('orders:*');
        console.log(response);
        return response;
    } catch (error: any) {
        console.log(error.toString());
        return [];
    }
}