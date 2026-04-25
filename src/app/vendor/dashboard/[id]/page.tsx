import { db } from "@/db";
import { vendors, orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Wallet, Bell, CheckCircle2, Clock } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function VendorDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.id, id),
    with: {
      orders: {
        orderBy: [desc(orders.createdAt)],
        limit: 10
      }
    }
  });

  if (!vendor) notFound();

  return (
    <div className="p-5 flex flex-col gap-6">
      {/* 💳 VIRTUAL WALLET CARD */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2.5rem] relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Available Balance</p>
          <h1 className="text-4xl font-black text-white mt-1">₦{(vendor.walletBalance || 0).toLocaleString()}</h1>
          <p className="text-[10px] text-orange-500 font-bold mt-2 bg-orange-500/10 w-fit px-2 py-1 rounded-full border border-orange-500/20">
            Escrowed by Admin
          </p>
        </div>
        <Wallet className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 -rotate-12" />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Live Orders</h2>
        <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-green-500 uppercase">Receiving</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {vendor.orders?.length === 0 ? (
          <p className="text-zinc-500 text-center py-10 font-bold">Waiting for your first order...</p>
        ) : (
          vendor.orders?.map((order) => (
            <div key={order.id} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl flex items-center justify-between">
              <div>
                <p className="text-white font-bold">{order.customerName}</p>
                <p className="text-xs text-zinc-500">{order.customerZone}</p>
                <p className="text-sm font-black text-orange-500 mt-1">₦{order.totalAmount.toLocaleString()}</p>
              </div>
              <button className="bg-orange-600 text-white text-[10px] font-black px-4 py-3 rounded-2xl uppercase">
                Accept Order
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}