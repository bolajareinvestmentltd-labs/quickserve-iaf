import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Bike, CheckCircle2 } from "lucide-react";
import TrackerQR from "@/components/TrackerQR";

export default async function OrderTrackerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
  });

  if (!order) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://quickserve-iaf.vercel.app";
  const trackingUrl = `${baseUrl}/orders/${order.id}/track`;

  const steps = [
    { name: "Payment Confirmed", icon: CheckCircle2, status: order.status !== "pending" ? "completed" : "pending" },
    { name: "Kitchen Preparing", icon: Clock, status: ["preparing", "out_for_delivery", "delivered"].includes(order.status || "") ? "completed" : "pending" },
    { name: "Runner Assigned", icon: Bike, status: order.runnerId ? "completed" : "pending" },
    { name: "Out for Delivery", icon: Bike, status: order.status === "out_for_delivery" || order.status === "delivered" ? "completed" : "pending" },
    { name: "Enjoy Your Meal", icon: CheckCircle2, status: order.status === "delivered" ? "completed" : "pending" },
  ];

  return (
    <div className="p-6 bg-black min-h-screen text-white pb-32">
      <header className="flex items-center justify-between mb-8">
        <Link href="/" className="p-2 bg-zinc-900 rounded-full text-zinc-500 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Live Order Tracker</p>
      </header>

      {/* 🧾 QR CODE & SECURITY CODE CHECKLIST CARD */}
      <div className="bg-orange-600 p-6 rounded-3xl mb-10 flex flex-col items-center gap-6 shadow-lg shadow-orange-900/20">
        <h2 className="text-[10px] font-black text-white/70 uppercase tracking-widest">Delivery Checklist 📝</h2>
        
        {/* THE REAL-TIME QR CODE (Client Component) */}
        <TrackerQR url={trackingUrl} />
        
        <p className="text-zinc-100 text-xs text-center font-bold px-4 leading-tight">
          Show this QR code to the Runner. If camera fails, provide the fallback code:
        </p>
        
        {/* FALLBACK NUMERIC CODE */}
        <div className="flex gap-2">
          {order.deliveryCode?.split('').map((char, i) => (
            <div key={i} className="w-12 h-16 bg-white rounded-xl flex items-center justify-center font-black text-4xl text-orange-600 shadow-xl shadow-orange-950/20">
              {char}
            </div>
          ))}
        </div>
      </div>

      <div className="relative pl-10 border-l border-zinc-900 ml-3">
        {steps.map((step, index) => (
          <div key={step.name} className={`mb-12 relative flex items-start ${step.status === "completed" ? "opacity-100" : "opacity-40"}`}>
            <div className={`absolute -left-16 p-3 rounded-full border shadow-xl ${
              step.status === "completed" 
                ? 'bg-zinc-900 text-orange-500 border-zinc-800' 
                : 'bg-zinc-950 text-zinc-600 border-zinc-900'
            }`}>
              <step.icon className="w-6 h-6" />
            </div>
            <div className="pt-2">
              <p className={`font-black italic uppercase text-lg ${
                step.status === "completed" ? "text-white" : "text-zinc-600"
              }`}>
                {step.name}
              </p>
              <p className="text-xs text-zinc-500 font-bold mt-1 tracking-widest uppercase">
                {step.status === "completed" ? "Completed" : "Waiting"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
