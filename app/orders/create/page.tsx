'use client';

import { FoodItem, getFoodItemData } from "@/app/lib/food_items_service";
import { createOrder, Order, OrderItem } from "@/app/lib/orders_service";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

export default function CreateNewOrder() {
    const [order,setOrder] = useState<Order>({
        id: crypto.randomUUID(),
        documentNumber: parseInt(crypto.getRandomValues(new Uint8Array(1)).toString()),
        customerName: '',
        documentTotal: 0,
        items : []
    });
    const [foodItems,setFoodItems] =  useState<Array<FoodItem>>([])
    const [state,submit,isLoading] =  useActionState(handleSubmit,null);

    async function getFoods() {
        var response = await getFoodItemData();
        setFoodItems(response)
    }

    function addFoodItem(item?: FoodItem){
        console.log(item);
        if(item == null)return;
        if(order.items.find((i)=>i.itemID === item.id) !== undefined)return;
        var foodItem : OrderItem = {
            itemID: item.id,
            itemName: item.name,
            quantity: 1,
            price: item.price
        }
        setOrder(prev=> ({...prev,documentTotal:(prev.documentTotal +foodItem.price)  ,items:[...prev.items, foodItem ]}))
    }

    async function removeItem(item: OrderItem){
        const confirmed = confirm(`Remove ${item.itemName} from the list`)
        console.log();
        if(confirmed){
            var x = order.items.filter((i)=> i.itemID == item.itemID ? null : i);
            let total = 0;
             x.forEach((i)=> total +=  i.price )
            setOrder(prev=> ({...prev, documentTotal: total, items: x}))
        }
    }

    async function handleSubmit(){
        var res =  await createOrder(order);
        if(res == null) redirect('/orders');
        return res;
    }
    
    useEffect(()=>{getFoods()},[])

    return (
        <div className="max-w-4xl mx-auto p-5 items-center">
            <div className="flex  justify-between w-full mt-5">
                <h2 className="font-bold text-3xl">Create Order</h2>
                 <Link className='bg-orange-800 hover:bg-orange-900 text-white px-5 py-2 cursor-pointer rounded-lg' href={'/orders'}>Back To Orders</Link>
            </div>
            <form action={submit} id="CreateOrderForm">
                <label htmlFor="customer">Customer</label>
                <br />
                <input type="text" name="customer" required minLength={4} 
                    className="border border-gray-300 rounded-lg focus:outline-3 focus:border-0 focus:outline-orange-800 px-4 py-2 w-full mb-5" 
                    placeholder="John Doe"
                    value={order.customerName}
                    onChange={(e)=>setOrder((prev)=>({...prev,customerName: e.target.value}))}
                />
                <div className="flex flex-row flex-wrap gap-3 mb-3 w-full my-4">
                {
                    order.items.map((item)=><span 
                        className="border border-gray-200 rounded-lg w-65 p-3 shadow"
                        key={item.itemID}
                    >
                        <h3 className="font-bold mb-2">{item.itemName}</h3>
                        <div className="flex items-center w-full justify-between">
                            <span className="text-orange-800">Ksh.{item.price}</span>
                            <button className="bg-orange-800 px-3  py-1 rounded-lg font-bold text-sm text-white" type="button" onClick={()=>removeItem(item)} >Delete</button>
                        </div>
                    </span> )
                }
               </div>
               <br />
                {
                    state != null ? <span className="mb-3 text-red-800">{state}</span> : null
                }
               <div className="flex flex-wrap w-full justify-between mt-2">
                <select name="" id="" className="rounded-lg border border-gray-200 focus:outline-0 px-4 py-2 text-lg"
                onChange={(v)=>addFoodItem(foodItems.find((f)=>f.id == v.target.value))}
                >
                    <option value=""  key={'select'}>Select Food Item</option>
                    {
                        foodItems.map((food)=> <option  value={food.id} key={food.id} >{food.name}</option> )
                    }
                </select>
               
                 { 
                    isLoading ?
                    <span className="flex p-4 border border-5 border-orange-200 border-b-orange-800  rounded-full  animate-spin"/> :
                    order.items.length <= 0 ? <span/> :
                    <button className="rounded-lg bg-orange-800 hover:bg-orange-900 text-white cursor-pointer px-5 py-2" type="submit" >Submit (Ksh {order.documentTotal})</button>
                }
               </div>
            </form>
        </div>
    );
}