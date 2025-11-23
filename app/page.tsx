'use client';

import { useActionState, useEffect, useState } from "react";
import { deleteFoodItemData, FoodItem, getFoodItemData, setFoodItemData } from "./lib/food_items_service";

export default function Home() {
  const [state,submit,isPending] = useActionState(addFood,null);
  const [food, setFood] = useState<FoodItem>({id: crypto.randomUUID(), name:'', price:0});
  const [data,setData] = useState({
    isLoading: false,
    foodData: [] as Array<FoodItem>
  })

  async function getData() {
    setData({...data, isLoading:true});
    var response = await getFoodItemData()
     setData({foodData: response, isLoading:false});
  }

  async function addFood() {
    if(food.name.length < 4)return;
    var response = await setFoodItemData(food)
    console.log(response);
    getData()
    setFood({name: '', price:0, id: crypto.randomUUID()});
    return response;
  }

  async function deleteFood(food:FoodItem) {
    setData({...data, isLoading:true})
    var res= await deleteFoodItemData({index: data.foodData.indexOf(food), value: food});
    setData({...data, isLoading:false})
    if(res)getData()
  }



  useEffect(()=>{getData()},[])


  return (
    <div className="flex min-h-screen items-center justify-center flex-col p-4">
      <h2 className="font-bold text-3xl">FoodiE APP</h2>
      <div className="text-gray-500 mb-8">A NextJS and Redis workflow</div>
       <form className="flex max-w-5xl flex-wrap m-5 gap-5" action={submit}>
          <input
            type="text"
            className="p-2 border border-gray-300 focus:outline-orange-800 rounded-lg"
            placeholder="Food Name"
            value={food.name}
            onChange={(event)=>setFood(prev=>({...prev, name: event.target.value }))}
            required
            minLength={4}
          />
           <input
            type="text"
            className="p-2 border border-gray-300 focus:border-0 focus:outline-orange-800 rounded-lg"
            placeholder="Price"
            value={food.price}
            onChange={(event) => {
              const val = event.target.value;
              const num = Number.parseFloat(val);
              if (!Number.isNaN(num)) {
                setFood(prev => ({ ...prev, price: num }));
              }else{
                setFood(prev => ({ ...prev, price: 0 }));
              }
            }}
            required
            minLength={1}
          />
         { 
          isPending ?
          <span className="flex w-10 border border-4 border-orange-200 border-b-orange-800  rounded-full mx-auto  animate-spin"/> :
          <button className="rounded-lg bg-orange-800 hover:bg-orange-900 text-white cursor-pointer px-5 py-2" type="submit">Add Item</button>
         }
       </form>
      { 
        data.isLoading ? 
        <span className="flex p-5 border border-4 border-orange-200 border-b-orange-800  rounded-full mx-auto  animate-spin"/> :
        <section className="flex flex-wrap max-w-4xl">
          { 
            data.foodData.map((food)=><div className="flex flex-col p-4 m-2 shadow-lg rounded-lg w-60" key={food.id}>
              <span className="text-lg"> {food.name}</span>
              <span className="text-gray-500 mb-4">Ksh {food.price}</span>
              <button 
                className="font-normal  text-white rounded bg-red-800 px-2 cursor-pointer py-1"
                onClick={()=>deleteFood(food)}
              >Delete</button>
            </div>)
          }
        </section>
        }
    </div>
  );
}
