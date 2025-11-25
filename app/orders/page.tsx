import Link from "next/link";
import { getAllOrders } from "../lib/orders_service";

export default async function OrdersPage() {
    var data = await getAllOrders();

    return (
        <div className="flex max-w-5xl p-5 mx-auto">
            <div className="flex  justify-between w-full mt-5">
                <h2 className="fw-bold text-3xl">Food orders</h2>
                 <Link className='bg-orange-800 hover:bg-orange-900 text-white px-5 py-2 cursor-pointer rounded-lg' href={'/orders/new'}>Create Order</Link>
            </div>
            <div></div>

        </div>
    );
}