import { db } from "@/db";
import { orders, runners, vendors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft, Package, Bike, ChefHat, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function TrackOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: { runner: true, items: { with: { vendor: true } } }
  });

  if (!order) notFound();

  const statuses = [
    { id: 'paid', label: 'Payment Confirmed', icon: ShieldCheck },
    { id: 'accepted', label: 'Runner Assigned', icon: Bike },
    { id: 'preparing', label: 'Kitchen Preparing', icon: ChefHat },
    { id: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
    { id: 'delivered', label: 'Enjoy your Meal', icon: CheckCircle2 },
  ];

  const currentIdx = statuses.findIndex(s => s.id === order.status);

  return (
    <div className="p-6 bg-black min-h-screen pb-32 text-white">
      <header className="flex items-center justify-between mb-8">
        <Link href="/orders" className="p-2 bg-zinc-900 rounded-full text-zinc-500 active:scale-90 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="text-right">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Order ID</p>
          <p className="text-xs font-bold text-white uppercase">{id.slice(0, 8)}</p>
        </div>
      </header>

      {/* 🎫 SECURITY CODE CARD */}
      <div className="bg-orange-600 p-6 rounded-[2.5rem] mb-8 shadow-xl shadow-orange-900/20 flex flex-col items-center text-center">
        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Delivery Security Code</p>
        <h2 className="text-5xl font-black text-white italic tracking-tighter">
          {order.deliveryCode || "----"}
        </h2>
        <p className="text-white/80 text-[9px] font-bold uppercase mt-3 leading-tight">
          Show this code to the runner <br /> to receive your order
        </p>
      </div>

      {/* 🚦 LIVE PROGRESS TRACKER */}
      <div className="flex flex-col gap-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
        {statuses.map((step, idx) => {
          const isDone = idx <= currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={step.id} className="flex gap-4 items-start relative z-10">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                isDone ? 'bg-orange-600 border-orange-500 scale-110 shadow-lg shadow-orange-900/40' : 'bg-zinc-900 border-zinc-800 text-zinc-700'
              }`}>
                <step.icon className={`w-5 h-5 ${isDone ? 'text-white' : 'text-zinc-700'}`} />
              </div>
              <div className="flex flex-col pt-1">
                <p className={`text-xs font-black uppercase tracking-widest ${isDone ? 'text-white' : 'text-zinc-600'}`}>
                  {step.label}
                </p>
                {isCurrent && (
                  <span className="text-[10px] text-orange-500 font-bold uppercase animate-pulse mt-0.5 italic">
                    In Progress...
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 🏇 RUNNER INFO CARD */}
      {order.runner && (
        <div className="mt-12 bg-zinc-900 border border-zinc-800 p-5 rounded-[2.5rem] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
              <Bike className="text-orange-500 w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Your Runner</p>
              <h4 className="text-white font-black text-lg uppercase italic">{order.runner.name}</h4>
            </div>
          </div>
          <a href={`tel:${order.runner.phone}`} className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
            Call
          </a>
        </div>
      )}
    </div>
  );
}
