import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ShieldCheck, Search, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminLogistics() {
  const activeDeliveries = await db.query.orders.findMany({
    where: eq(orders.status, "out_for_delivery"),
    orderBy: [desc(orders.createdAt)]
  });

  return (
    <div className="p-6 flex flex-col gap-8 bg-black min-h-screen pb-32">
      <header>
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Logistics <span className="text-orange-500">Command</span></h1>
        <p className="text-zinc-500 text-sm font-bold">Manual override for delivery confirmation.</p>
      </header>

      <div className="flex flex-col gap-4">
        {activeDeliveries.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-[3rem]">
            <ShieldCheck className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-500 font-black text-[10px] uppercase">No active deliveries to override</p>
          </div>
        ) : (
          activeDeliveries.map(order => (
            <div key={order.id} className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 flex justify-between items-center group">
              <div>
                <p className="text-white font-black uppercase italic tracking-tighter">{order.customerName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-orange-500 font-bold bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                    CODE: {order.deliveryCode}
                  </span>
                </div>
              </div>
              <form action={async () => {
                "use server";
                // Action to force deliver
              }}>
                <button className="bg-white text-black text-[10px] font-black px-4 py-3 rounded-xl uppercase active:scale-95 transition-transform">
                  Force Deliver
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
