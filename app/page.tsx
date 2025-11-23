'use client';

import { useActionState, useEffect, useState } from "react";
import { setRedisData, getRedisData, deleteRedisData } from "./lib/redis_client";

export default function Home() {
  const [state,submit,isPending] = useActionState(addFood,null);
  const [foodName, setFoodName] =  useState('')
  const [data,setData] = useState({
    isLoading: false,
    foodData: ['']
  })

  async function getData() {
    setData({...data, isLoading:true});
    var response = await getRedisData()
     setData({foodData: response ?? [], isLoading:false});
  }

  async function addFood() {
    if(foodName.length <= 4)return;
    var response = await setRedisData(foodName)
    console.log(response);
    getData()
    setFoodName('');
    return response;
  }

  async function deleteFood(food:string) {
    setData({...data, isLoading:true})
    var res= await deleteRedisData({index: data.foodData.indexOf(food), value: food});
    setData({...data, isLoading:false})
    if(res)getData()
  }



  useEffect(()=>{getData()},[])


  return (
    <div className="flex min-h-screen items-center justify-center flex-col">
      <h2 className="font-bold text-3xl">FoodiE APP</h2>
      <div className="text-gray-500 mb-8">A NextJS and Redis workflow</div>
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
        <section className="flex flex-wrap max-w-4xl">
          { 
            data.foodData.map((food)=><div className="flex  flex-col p-4 m-2 shadow shadow-lg rounded-lg w-60 justify-start" key={food}>
              <span className="text-lg"> {food}</span>
              <span className="text-gray-500 mb-4">Ksh 500</span>
              <button 
                className="font-normal  text-white rounded bg-red-800 px-2 cursor-pointer"
                onClick={()=>deleteFood(food)}
              >Delete</button>
            </div>)
          }
        </section>
        }
    </div>
  );
}
