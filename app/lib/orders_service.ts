'use server';

import { revalidatePath } from "next/cache";
import { redisClient } from "./redis_client";

export type Order = {
    id: string,
    documentNumber: number,
    customerName: string,
    documentTotal: number,
    items : Array<OrderItem>,
}

export type OrderItem = {
    itemID: string,
    itemName: string,
    quantity: number,
    price: number,
}

export async function createOrder(order: Order) : Promise<String | null> {
    try {
        const client = await redisClient();
        const response = await client.hSet(`orders:${order.id}`, {
            id: order.id,
            documentNumber: order.documentNumber.toString(),
            customerName: order.customerName,
            documentTotal: order.documentTotal.toString(),
            items: JSON.stringify(order.items)
        });
        console.log(response);
        revalidatePath('/orders')
        return null;
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