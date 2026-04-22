import { db } from '@/db';
import * as schema from '@/db/schema';
import { desc } from 'drizzle-orm';
import { Clock, MapPin, Phone, CheckCircle2 } from 'lucide-react';
import OrderStatusButton from '@/components/OrderStatusButton';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const allOrders = await db.query.orders.findMany({
    orderBy: [desc(schema.orders.createdAt)],
    with: {
      items: {
        with: { product: { with: { vendor: true } } }
      }
    }
  });

  const pendingOrders = allOrders.filter(o => o.status === 'pending');
  const completedOrders = allOrders.filter(o => o.status === 'completed');

  return (
    <main className="min-h-screen bg-[#0A0C10] text-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black italic text-white uppercase">Dispatch Board</h1>
            <p className="text-gray-400 mt-1">Live order tracking for runners</p>
          </div>
          <div className="bg-orange-500/20 border border-orange-500/30 text-orange-500 px-4 py-2 rounded-full font-bold text-sm">
            {pendingOrders.length} Active
          </div>
        </header>

        {/* ACTIVE ORDERS QUEUE */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" /> Action Required
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingOrders.map((order) => (
              <div key={order.id} className="bg-[#14171F] p-5 rounded-2xl border border-orange-500/30 shadow-lg shadow-orange-500/5">
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-white/5">
                  <div>
                    <h2 className="font-black text-xl text-white">Order #{order.id}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1.5"><MapPin className="w-4 h-4 text-orange-500" /> {order.deliveryZone}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1"><Phone className="w-4 h-4 text-orange-500" /> {order.customerPhone}</div>
                  </div>
                  <span className="font-black text-xl text-orange-500">₦{Number(order.totalAmount).toLocaleString()}</span>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="text-sm">
                      <span className="font-bold text-white">{item.quantity}x</span> <span className="text-gray-300">{item.product.name}</span>
                      <p className="text-xs text-orange-500 font-bold uppercase tracking-wider mt-0.5">{item.product.vendor.businessName}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/5">
                  <span className="text-sm text-gray-400">Customer: <span className="font-bold text-white">{order.customerName}</span></span>
                  {order.ticketId && <div className="mt-1 text-xs text-blue-400 font-bold">Ticket: {order.ticketId}</div>}
                </div>

                <OrderStatusButton orderId={order.id} />
              </div>
            ))}
            {pendingOrders.length === 0 && (
              <div className="col-span-full bg-[#14171F] border border-white/5 p-8 rounded-2xl text-center text-gray-500">
                <p className="font-bold">Queue is empty. Waiting for hungry people!</p>
              </div>
            )}
          </div>
        </div>

        {/* COMPLETED ORDERS LOG */}
        <div>
          <h2 className="text-lg font-bold text-gray-500 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Recently Delivered
          </h2>
          <div className="space-y-3">
            {completedOrders.map((order) => (
              <div key={order.id} className="bg-[#0A0C10] p-4 rounded-xl border border-white/5 flex justify-between items-center opacity-60">
                <div>
                  <span className="font-bold text-gray-300">#{order.id} - {order.customerName}</span>
                  <span className="text-sm text-gray-500 ml-2">({order.deliveryZone})</span>
                </div>
                <div className="text-green-500 flex items-center gap-1 text-sm font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Delivered
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
