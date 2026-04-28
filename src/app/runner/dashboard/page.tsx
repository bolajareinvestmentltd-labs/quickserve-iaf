"use client";
import { useState } from "react";
import { MapPin, Package, QrCode, LogOut, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RunnerDashboard() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);

  // Dummy active order for UI display. Later connected to DB real-time feed.
  const activeDelivery = {
    id: "REF-9832",
    customer: "John Doe",
    zone: "VIP Section A",
    status: "out_for_delivery"
  };

  const handleArrival = () => {
    // Triggers the QR Scanner Modal
    setScanning(true);
  };

  return (
    <div className="bg-black min-h-screen text-white pb-32">
      <header className="px-6 py-6 bg-zinc-950 border-b border-zinc-900 flex justify-between items-center sticky top-0 z-40">
        <div>
          <h1 className="text-xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
             <Package className="w-5 h-5 text-orange-500" /> Runner <span className="text-orange-500">Hub</span>
          </h1>
        </div>
        <button onClick={() => router.push('/')} className="p-2 bg-red-950/30 text-red-500 rounded-full active:scale-90 transition-transform">
           <LogOut className="w-5 h-5" />
        </button>
      </header>

      <div className="px-6 mt-8">
        <h2 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-4">Active Mission</h2>

        <div className="bg-zinc-900 border border-orange-500/50 rounded-3xl p-6 shadow-[0_0_20px_rgba(234,88,12,0.1)] relative overflow-hidden">
           <div className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl">In Transit</div>
           
           <h3 className="text-2xl font-black text-white italic mb-1">{activeDelivery.customer}</h3>
           <p className="text-zinc-400 font-bold text-sm flex items-center gap-2 mb-6">
             <MapPin className="w-4 h-4 text-orange-500" /> {activeDelivery.zone}
           </p>

           <div className="bg-black border border-zinc-800 rounded-2xl p-4 mb-6">
             <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Pickups Completed:</p>
             <ul className="text-sm font-bold text-zinc-300 flex flex-col gap-2">
               <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Zaddys Creamery</li>
               <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Amuda Drinks</li>
             </ul>
           </div>

           <button onClick={handleArrival} className="w-full bg-orange-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-orange-900/20 text-lg uppercase tracking-tight">
             <QrCode className="w-6 h-6" /> I've Arrived - Scan QR
           </button>
        </div>
      </div>

      {/* QR SCANNER MODAL */}
      {scanning && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
           <div className="w-full max-w-sm aspect-square border-4 border-dashed border-orange-500 rounded-3xl flex items-center justify-center relative overflow-hidden bg-zinc-900/50">
              <div className="absolute inset-0 bg-orange-500/10 animate-pulse"></div>
              <p className="text-orange-500 font-black tracking-widest uppercase text-sm animate-bounce">Camera Active...</p>
           </div>
           <p className="text-zinc-400 font-bold text-center mt-8 px-6 text-sm">Point your camera at the customer's delivery code screen to validate and complete the order.</p>
           
           <button onClick={() => setScanning(false)} className="mt-8 text-zinc-500 font-black uppercase tracking-widest text-xs border border-zinc-800 bg-zinc-900 px-6 py-3 rounded-xl active:scale-90">
             Cancel Scan
           </button>
        </div>
      )}
    </div>
  );
}
