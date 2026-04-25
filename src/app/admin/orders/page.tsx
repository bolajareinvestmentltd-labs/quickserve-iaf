import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Clock, CheckCircle2, XCircle, MapPin, Phone, User, Package } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function OrdersBoard() {
  // 1. Fetch all orders and their nested items
  const allOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    with: {
      items: {
        with: {
          product: true,
          vendor: true,
        },
      },
    },
  });

  // 🚀 2. NEXT.JS SERVER ACTION: Update Order Status
  async function updateOrderStatus(formData: FormData) {
    "use server";
    const orderId = String(formData.get("orderId"));
    const status = formData.get("status") as "completed" | "cancelled";

    await db.update(orders)
      .set({ status })
      .where(eq(orders.id, orderId));

    revalidatePath("/admin/orders");
    revalidatePath("/admin"); // Refresh the main hub stats too
  }

  return (
    <div className="p-5 flex flex-col min-h-screen bg-neutral-950 pb-24">
      <header className="mb-6 mt-4">
        <h1 className="text-3xl font-black text-white">Live Orders</h1>
        <p className="text-neutral-400 text-sm mt-1">Manage all festival checkouts</p>
      </header>

      {allOrders.length === 0 ? (
        <div className="text-center p-10 bg-neutral-900 border border-neutral-800 border-dashed rounded-3xl mt-10">
          <Package className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <p className="text-neutral-400">No orders yet. They will appear here instantly.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {allOrders.map((order) => (
            <div key={order.id} className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-lg">
              {/* Order Header */}
              <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-800/30">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${order.status === 'pending' ? 'bg-orange-500 animate-pulse' : order.status === 'completed' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-white font-bold text-sm uppercase tracking-wider">{order.status}</span>
                </div>
                <span className="text-orange-500 font-black text-lg">₦{order.totalAmount.toLocaleString()}</span>
              </div>

              {/* Customer Details */}
              <div className="p-4 bg-neutral-900 flex flex-col gap-2">
                <div className="flex items-center gap-3 text-neutral-300">
                  <User className="w-4 h-4 text-neutral-500" />
                  <span className="font-semibold">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-300">
                  <Phone className="w-4 h-4 text-neutral-500" />
                  <span className="font-mono text-sm">{order.customerPhone}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-300">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="font-bold text-orange-100">{order.customerZone}</span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="p-4 border-t border-neutral-800 bg-neutral-950/50">
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Items Ordered</h4>
                <div className="flex flex-col gap-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="bg-neutral-800 text-white text-xs font-bold px-2 py-1 rounded-md">x{item.quantity}</span>
                        <div>
                          <p className="text-white font-semibold text-sm leading-tight">{item.product.name}</p>
                          <p className="text-neutral-500 text-[10px] uppercase font-bold">{item.vendor.businessName}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons (Only show if pending) */}
              {order.status === "pending" && (
                <div className="p-4 border-t border-neutral-800 flex gap-3">
                  <form action={updateOrderStatus} className="flex-1">
                    <input type="hidden" name="orderId" value={order.id} />
                    <input type="hidden" name="status" value="cancelled" />
                    <button type="submit" className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-red-400 font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform text-sm">
                      <XCircle className="w-4 h-4" /> Cancel
                    </button>
                  </form>
                  
                  <form action={updateOrderStatus} className="flex-1">
                    <input type="hidden" name="orderId" value={order.id} />
                    <input type="hidden" name="status" value="completed" />
                    <button type="submit" className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform text-sm">
                      <CheckCircle2 className="w-4 h-4" /> Complete
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
