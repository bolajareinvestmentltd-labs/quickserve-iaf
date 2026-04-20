import { db } from '@/db';
import * as schema from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { CheckCircle, Clock, MapPin, Phone } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Fetch all orders, newest first
  const allOrders = await db.query.orders.findMany({
    orderBy: [desc(schema.orders.createdAt)],
    with: {
      items: {
        with: {
          product: {
            with: { vendor: true }
          }
        }
      }
    }
  });

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black italic text-gray-900 uppercase">Dispatch Board</h1>
            <p className="text-gray-500">Live order tracking for runners</p>
          </div>
          <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-bold text-sm">
            {allOrders.length} Total Orders
          </div>
        </header>

        <div className="space-y-6">
          {allOrders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="font-bold text-lg text-gray-900">Order #{order.id}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4" /> {order.deliveryZone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Phone className="w-4 h-4" /> {order.customerPhone}
                  </div>
                  {order.ticketId && (
                    <div className="inline-block mt-2 bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded">
                      Ticket ID: {order.ticketId}
                    </div>
                  )}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${order.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                  {order.status === 'pending' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                  {order.status.toUpperCase()}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <span className="font-bold">{item.quantity}x</span> {item.product.name}
                      <p className="text-xs text-gray-400">from {item.product.vendor.businessName}</p>
                    </div>
                    <span className="font-medium text-gray-900">₦{Number(item.subtotal).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500">Customer: <span className="font-bold text-gray-900">{order.customerName}</span></span>
                <span className="font-black text-xl text-brand-orange">₦{Number(order.totalAmount).toLocaleString()}</span>
              </div>
            </div>
          ))}

          {allOrders.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No orders yet. Waiting for the festival to start!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
