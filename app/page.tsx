'use client';

import { useActionState, useEffect, useState } from "react";
import { setRedisData, getRedisData } from "./lib/redis_client";

export default function Home() {
  const [state,submit,isPending] = useActionState(addFood,null);
  const [foodName, setFoodName] =  useState('')
  const [data,setData] = useState({
    isLoading: false,
    foodData: ''
  })

  async function getData() {
    setData({...data, isLoading:true});
    var response = await getRedisData('food')
     setData({foodData: response ?? '', isLoading:false});
  }

  async function addFood() {
    if(foodName.length <= 4)return;
    var response = await setRedisData({key: 'food',value: foodName})
    console.log(response);
    getData()
    return response;
  }

  useEffect(()=>{getData()},[])


  return (
    <div className="flex min-h-screen items-center justify-center flex-col">
       <form className="flex max-w-5xl flex-wrap m-5 gap-5" action={submit}>
          <input
            type="text"
            className="p-2 border border-gray-300 focus:outline-orange-800 rounded-lg w-100"
            placeholder="Add Food"
            value={foodName}
            onChange={(v)=>setFoodName(v.target.value)}
          />
         { 
          isPending ?
          <span className="flex w-10 border border-4 border-orange-200 border-b-orange-800  rounded-full mx-auto  animate-spin"/> :
          <button className="rounded-lg bg-orange-800 hover:bg-orange-900 text-white cursor-pointer px-5 " type="submit">Add Item</button>
         }
       </form>
      { 
        data.isLoading ? 
        <span className="flex p-5 border border-4 border-orange-200 border-b-orange-800  rounded-full mx-auto  animate-spin"/> :
        <section className="grid">
          <div className="col p-4 m-2 shadow shadow-lg rounded-lg font-bold">{data.foodData.toUpperCase()}</div>
        </section>
        }
    </div>
  );
}
