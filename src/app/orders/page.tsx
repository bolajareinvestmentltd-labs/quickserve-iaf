import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ShoppingBag, ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const allOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
  });

  return (
    <div className="p-6 bg-black min-h-screen pb-32 text-white">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">My <span className="text-orange-500">Orders</span></h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Order History & Tracking</p>
      </header>

      <div className="flex flex-col gap-3">
        {allOrders.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-[2.5rem]">
            <ShoppingBag className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest">No orders placed yet</p>
          </div>
        ) : (
          allOrders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}/track`} className="bg-zinc-900 border border-zinc-800 p-5 rounded-[2.5rem] flex items-center justify-between active:scale-95 transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${order.status === 'delivered' ? 'bg-green-500/10' : 'bg-orange-500/10'}`}>
                  {order.status === 'delivered' ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <Clock className="w-6 h-6 text-orange-500" />}
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase italic tracking-tight">{order.customerZone}</h4>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">₦{order.totalAmount.toLocaleString()} • {new Date(order.createdAt || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                  {order.status}
                </span>
                <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-white transition-colors" />
              </div>
            </Link>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  );
}
