import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import LiveTracker from "@/components/LiveTracker";
import ClientCookieSetter from "./ClientCookieSetter";

export const dynamic = "force-dynamic";

export default async function TrackOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.query.orders.findFirst({ where: eq(orders.id, id) });
  
  if (!order) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-white font-black text-xl mb-2 uppercase">Order Vanished</h2>
        <p className="text-zinc-500 font-bold text-sm mb-6">We couldn't find this tracking link.</p>
        <a href="/" className="bg-orange-600 text-white font-black px-6 py-3 rounded-xl uppercase text-xs">Go Home</a>
      </div>
    );
  }

  return (
    <>
      <ClientCookieSetter orderId={id} />
      <LiveTracker order={order} />
    </>
  );
}
