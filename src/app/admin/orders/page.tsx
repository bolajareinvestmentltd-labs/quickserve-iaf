import { db } from "@/db";
import { orders, runners, vendors } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { ArrowLeft, Clock, CheckCircle2, Bike, ChefHat, AlertCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminOrderMonitor() {
  const allOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    with: { 
      runner: true,
      items: { with: { vendor: true } }
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'preparing': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'out_for_delivery': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'delivered': return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen pb-32 text-white">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-zinc-900 rounded-full text-zinc-500 active:scale-90 transition-transform">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">
            Live <span className="text-[#D4AF37]">Orders</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[8px] text-green-500 font-black uppercase">Live Feed</span>
        </div>
      </header>

      <div className="grid gap-4">
        {allOrders.map((order) => (
          <div key={order.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-[2.5rem] flex flex-col gap-4 relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h3 className="font-black text-lg uppercase italic leading-none">{order.customerName}</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase mt-2">
                  Zone: <span className="text-white">{order.customerZone}</span> • {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusColor(order.status || "pending")}`}>
                {order.status}
              </div>
            </div>

            {/* 🥘 ITEMS IN THIS ORDER */}
            <div className="bg-black/40 rounded-2xl p-4 flex flex-col gap-2">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-3 h-3 text-zinc-600" />
                    <span className="text-[11px] font-bold text-zinc-300">{item.quantity}x {item.product?.name || "Product"}</span>
                  </div>
                  <span className="text-[9px] text-zinc-500 font-black uppercase">{item.vendor?.businessName}</span>
                </div>
              ))}
            </div>

            {/* 🏇 RUNNER ASSIGNED */}
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-zinc-800/50">
              <div className="flex items-center gap-2">
                <Bike className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[10px] font-black uppercase text-zinc-400">
                  {order.runner?.name || "Awaiting Runner..."}
                </span>
              </div>
              <p className="text-lg font-black text-white italic tracking-tighter">₦{order.totalAmount.toLocaleString()}</p>
            </div>
            
            {/* BACKGROUND DECOR */}
            <div className="absolute -right-4 -bottom-4 text-zinc-800/10 font-black text-6xl italic select-none">
              #{order.deliveryCode}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
