import { db } from "@/db";
import { vendors, orders, orderItems } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Wallet, Utensils, Bike, CheckCircle2 } from "lucide-react";

export default async function VendorDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Server Action to move order status
  async function updateStatus(orderId: string, nextStatus: any) {
    "use server";
    await db.update(orders).set({ status: nextStatus }).where(eq(orders.id, orderId));
    revalidatePath(`/vendor/dashboard/${id}`);
  }

  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.id, id),
    with: { orderItems: { with: { order: true } } }
  });

  return (
    <div className="p-5 flex flex-col gap-6 bg-black min-h-screen pb-20">
      <div className="bg-orange-600 p-8 rounded-[2.5rem] shadow-xl">
        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Earnings</p>
        <h1 className="text-4xl font-black text-white italic">₦{(vendor?.walletBalance || 0).toLocaleString()}</h1>
      </div>

      <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Active Kitchen Flow</h2>

      <div className="flex flex-col gap-4">
        {vendor?.orderItems?.map((item) => (
          <div key={item.order.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex flex-col gap-4">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-white font-bold">{item.order.customerName}</p>
                   <p className="text-[10px] text-zinc-500 font-bold uppercase">{item.order.customerZone}</p>
                </div>
                <span className="text-orange-500 font-black text-xs">₦{item.order.totalAmount}</span>
             </div>

             <div className="grid grid-cols-2 gap-2">
                {item.order.status === 'paid' && (
                  <form action={updateStatus.bind(null, item.order.id, 'accepted')}>
                    <button className="w-full bg-zinc-800 text-white text-[10px] font-black p-3 rounded-xl uppercase">Accept</button>
                  </form>
                )}
                {item.order.status === 'accepted' && (
                  <form action={updateStatus.bind(null, item.order.id, 'preparing')}>
                    <button className="w-full bg-blue-600 text-white text-[10px] font-black p-3 rounded-xl uppercase">Cook</button>
                  </form>
                )}
                {item.order.status === 'preparing' && (
                  <form action={updateStatus.bind(null, item.order.id, 'out_for_delivery')}>
                    <button className="w-full bg-orange-600 text-white text-[10px] font-black p-3 rounded-xl uppercase flex items-center justify-center gap-2">
                      <Bike className="w-3 h-3" /> Dispatch
                    </button>
                  </form>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
