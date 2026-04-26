import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export default async function AdminOrders() {
  const allOrders = await db.query.orders.findMany({ orderBy: [desc(orders.createdAt)] });

  async function updateOrderStatus(formData: FormData) {
    "use server";
    const orderId = String(formData.get("orderId"));
    const status = String(formData.get("status")) as "pending" | "paid" | "accepted" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
    await db.update(orders).set({ status }).where(eq(orders.id, orderId));
    revalidatePath("/admin/orders");
  }

  return (
    <div className="p-6 bg-black min-h-screen pb-32">
      <h1 className="text-3xl font-black text-white italic mb-6">ALL <span className="text-orange-500">ORDERS</span></h1>
      <div className="grid gap-4">
        {allOrders.map(order => (
          <div key={order.id} className="bg-zinc-900 p-4 rounded-3xl border border-zinc-800 text-white flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-lg uppercase tracking-tight">{order.customerName}</p>
                <p className="text-xs text-orange-500 font-black">₦{order.totalAmount.toLocaleString()}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'pending' ? 'bg-orange-500/20 text-orange-500' : order.status === 'delivered' ? 'bg-green-500/20 text-green-500' : 'bg-zinc-800 text-zinc-400'}`}>
                {order.status}
              </div>
            </div>
            <form action={updateOrderStatus} className="flex gap-2">
              <input type="hidden" name="orderId" value={order.id} />
              <button name="status" value="delivered" className="bg-green-600/20 text-green-500 border border-green-600/50 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex-1 active:scale-95 transition-all">Mark Delivered</button>
              <button name="status" value="cancelled" className="bg-red-600/20 text-red-500 border border-red-600/50 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex-1 active:scale-95 transition-all">Cancel</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
