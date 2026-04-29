"use client";
import { ArrowLeft, CheckCircle2, Clock, ChefHat, Bike, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";

export default function LiveTracker({ order }: any) {
  const router = useRouter();

  // THE WIPE: Automatically dump the basket on successful payment
  useEffect(() => {
    try {
      useCart.setState({ items: [] });
    } catch(e) {
      console.log("Basket cleared natively.");
    }
  }, []);

  const timeline = [
    { id: "pending", label: "Payment Confirmed", icon: ShieldCheck, desc: "Waiting for vendor to accept" },
    { id: "preparing", label: "Kitchen Preparing", icon: ChefHat, desc: "Your food is being made" },
    { id: "ready", label: "Runner Assigned", icon: Bike, desc: "Runner is heading to the kitchen" },
    { id: "out_for_delivery", label: "Out For Delivery", icon: Clock, desc: "Runner is on the way to you" },
    { id: "delivered", label: "Enjoy Your Meal", icon: CheckCircle2, desc: "Order completed" }
  ];

  const statusMap: Record<string, number> = {
    "pending": 0, "preparing": 1, "ready": 2, "out_for_delivery": 3, "delivered": 4
  };
  const activeIndex = statusMap[order.status] || 0;

  return (
    <div className="bg-black min-h-screen text-white font-sans p-6 pb-32 relative">
      <header className="flex items-center justify-between mb-8">
        <button onClick={() => router.push("/")} className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center active:scale-90 transition-transform">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="text-right">
          <p className="text-[10px] text-zinc-500 font-black tracking-widest uppercase">Live Order Tracker</p>
          <p className="text-xs font-bold text-white tracking-widest">#{order.id.slice(0, 8).toUpperCase()}</p>
        </div>
      </header>

      {order.status === "out_for_delivery" && (
        <div className="bg-orange-600 rounded-3xl p-6 mb-10 text-center shadow-2xl shadow-orange-900/50 animate-in slide-in-from-top-4 fade-in duration-300">
          <h2 className="text-white font-black text-sm tracking-widest uppercase mb-4">Delivery Checklist 📝</h2>
          <div className="bg-white p-4 rounded-2xl inline-block mb-4 shadow-xl">
             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${order.deliveryCode}`} alt="Secure QR Code" className="w-40 h-40" />
          </div>
          <p className="text-orange-100 font-bold text-xs mb-4 px-2 leading-relaxed">Show this QR code to the Runner. If camera fails, provide the fallback code:</p>
          <div className="flex justify-center gap-3">
            {order.deliveryCode.split('').map((char: string, i: number) => (
              <div key={i} className="w-12 h-14 bg-white rounded-xl flex items-center justify-center text-orange-600 font-black text-2xl shadow-inner border-b-4 border-orange-200">
                {char}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative pl-6 space-y-8 mt-4">
        {/* The Vertical Connecting Line */}
        <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-zinc-800"></div>
        
        {timeline.map((step, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;
          return (
            <div key={step.id} className={`relative flex items-center gap-6 transition-all duration-500 ${isPast || isActive ? "opacity-100" : "opacity-30"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-colors duration-500 ${isActive ? "bg-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.6)]" : isPast ? "bg-green-500" : "bg-zinc-900 border border-zinc-700"}`}>
                <step.icon className={`w-5 h-5 ${isActive || isPast ? "text-white" : "text-zinc-500"}`} />
              </div>
              <div>
                <h3 className={`font-black uppercase italic tracking-tight transition-colors duration-500 ${isActive ? "text-orange-500 text-lg" : "text-white text-md"}`}>{step.label}</h3>
                {(isActive || isPast) && <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase mt-1">{step.desc}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
