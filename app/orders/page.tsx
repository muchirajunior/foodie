import Link from "next/link";
import { getAllOrders } from "../lib/orders_service";

export default async function OrdersPage() {
    var data = await getAllOrders();

    return (
        <div className="flex flex-col max-w-5xl p-5 mx-auto">
            <div className="flex  justify-between w-full mt-5">
                <h2 className="font-bold text-3xl">FoodiE Orders</h2>
                 <Link className='bg-orange-800 hover:bg-orange-900 text-white px-5 py-2 cursor-pointer rounded-lg' href={'/orders/create'}>Create Order</Link>
            </div>
            <div className="flex flex-row flex-wrap gap-3 mt-5 justify-between">
                {
                    data.map((order)=> <div className=" border border-gray-200 w-120 p-3 rounded-lg ">
                        <section className="flex justify-between gap-3 items-center">
                            <div> 
                                <p className="text-gray-500">customer</p>
                                <h2 className="font-bold"> {order.customerName}</h2>
                            </div>

                            <span className="shadow bg-orange-100 p-2 rounded-lg text-center font-bold px-4">No#{order.documentNumber}</span>

                        </section>
                        <table className="w-full mt-3 text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-2 font-semibold text-gray-700">Item</th>
                                    <th className="text-left py-2 font-semibold text-gray-700">Price</th>
                                    <th className="text-left py-2 font-semibold text-gray-700">Qty</th>
                                    <th className="text-left py-2 font-semibold text-gray-700">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    order.items.map((item, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 last:border-0">
                                            <td className="py-2">{item.itemName}</td>
                                            <td className="py-2">Ksh {item.price}</td>
                                            <td className="py-2">{item.quantity}</td>
                                            <td className="py-2">Ksh {item.quantity * item.price}</td>
                                        </tr>
                                    ))
                                }
                                <tr>
                                    <td className="py-2 font-bold">Order Total</td>
                                    <td></td>
                                    <td></td>
                                    <td className="py-2 font-bold">Ksh. {order.documentTotal}</td>

                                </tr>
                            </tbody>
                        </table>
                    </div> )
                }
            </div>

        </div>
    );
}