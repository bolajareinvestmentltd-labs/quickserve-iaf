"use client";
import { useState, useEffect } from "react";
import { claimOrder, verifyDeliveryCode } from "@/app/actions/runner";
import { MapPin, Package, KeyRound, LogOut, Loader2, Bike, ScanLine, Wallet, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RunnerDashboardClient({ allOrders }: any) {
  const router = useRouter();
  const [processing, setProcessing] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [activePinOrder, setActivePinOrder] = useState<any>(null);
  const [pin, setPin] = useState("");

  const [myRunnerId, setMyRunnerId] = useState<string | null>(null);
  useEffect(() => {
    const id = localStorage.getItem("quickserve_runner_id");
    if (!id) router.push("/runner/login");
    else setMyRunnerId(id);
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 8000);
    return () => clearInterval(interval);
  }, [router]);

  if (!myRunnerId) return <div className="bg-black min-h-screen"></div>;

  const availablePickups = allOrders.filter((o: any) => o.status === "preparing");
  const myActiveMission = allOrders.find((o: any) => o.status === "out_for_delivery" && o.runnerId === myRunnerId);
  const myCompletedMissions = allOrders.filter((o: any) => o.status === "delivered" && o.runnerId === myRunnerId);
  
  // FLAT DELIVERY PAYOUT CALCULATION (₦200 per trip)
  const totalEarnings = myCompletedMissions.length * 200; 

  const handleClaim = async (orderId: string) => {
    if (myActiveMission) return alert("You must complete your active mission first!");
    setProcessing(orderId);
    await claimOrder(orderId, myRunnerId);
    setProcessing(null);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    const res = await verifyDeliveryCode(activePinOrder.id, pin);
    if (res.success) {
      alert("Delivery Confirmed! Excellent work.");
      setActivePinOrder(null);
      setPin("");
      router.refresh();
    } else {
      alert(res.error);
    }
    setVerifying(false);
  };

  return (
    <div className="bg-black min-h-screen text-white pb-32">
      <header className="px-6 py-6 bg-zinc-950 border-b border-zinc-900 flex justify-between items-center sticky top-0 z-40">
        <div>
          <h1 className="text-xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
             <Package className="w-5 h-5 text-orange-500" /> Runner <span className="text-orange-500">Hub</span>
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-1">Live Logistics</p>
        </div>
        <button onClick={() => { localStorage.removeItem("quickserve_runner_id"); router.push('/'); }} className="p-2 bg-red-950/30 text-red-500 rounded-full active:scale-90 transition-transform"><LogOut className="w-5 h-5" /></button>
      </header>

      <div className="px-6 mt-6 flex flex-col gap-8">
        
        {/* RUNNER WALLET */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-lg shadow-black flex flex-col items-center text-center justify-center">
            <Wallet className="w-6 h-6 text-green-500 mb-2" />
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Today's Earnings</p>
            <h2 className="text-xl font-black italic text-white">₦{totalEarnings.toLocaleString()}</h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-lg shadow-black flex flex-col items-center text-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-orange-500 mb-2" />
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Missions Done</p>
            <h2 className="text-xl font-black italic text-white">{myCompletedMissions.length}</h2>
          </div>
        </div>

        {/* ACTIVE MISSION */}
        {myActiveMission && (
          <div>
            <h2 className="text-sm font-black text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2 animate-pulse">
              <Bike className="w-4 h-4" /> Active Mission
            </h2>
            <div className="bg-zinc-900 border border-orange-500/50 rounded-3xl p-6 shadow-[0_0_20px_rgba(234,88,12,0.15)] relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-orange-600 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl">In Transit</div>
               <h3 className="text-2xl font-black text-white italic mb-1">{myActiveMission.customerName}</h3>
               <p className="text-zinc-400 font-bold text-sm flex items-center gap-2 mb-6">
                 <MapPin className="w-4 h-4 text-orange-500" /> {myActiveMission.customerPhone}
               </p>
               <button onClick={() => setActivePinOrder(myActiveMission)} className="w-full bg-orange-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-orange-900/20 text-lg uppercase tracking-tight">
                 <ScanLine className="w-6 h-6" /> I've Arrived - Validate
               </button>
            </div>
          </div>
        )}

        {/* AVAILABLE PICKUPS */}
        <div>
          <h2 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-4">Available Pickups ({availablePickups.length})</h2>
          {availablePickups.length === 0 ? (
             <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 text-center text-zinc-600 font-bold text-xs uppercase tracking-widest border-dashed">No orders waiting.</div>
          ) : (
            <div className="flex flex-col gap-4">
               {availablePickups.map((order: any) => (
                 <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg shadow-black">
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-1">Order #{order.id.slice(0,6)}</p>
                    <h3 className="text-lg font-black text-white italic">{order.customerName}</h3>
                    <button onClick={() => handleClaim(order.id)} disabled={processing === order.id || myActiveMission} className="w-full bg-zinc-800 text-white font-black py-4 rounded-xl mt-4 flex items-center justify-center gap-2 active:scale-95 transition-transform uppercase tracking-widest text-xs disabled:opacity-50">
                      {processing === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Claim & Pickup"}
                    </button>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>

      {/* HYBRID VERIFICATION MODAL (QR + PIN) */}
      {activePinOrder && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-start pt-20 p-6 overflow-y-auto">
           <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center shadow-2xl">
              <h2 className="text-lg font-black italic uppercase tracking-tighter text-white mb-6">Scan Customer QR</h2>
              <div className="w-full aspect-square bg-black border-2 border-dashed border-orange-500/50 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden mb-6">
                 <div className="absolute inset-0 bg-orange-500/5 animate-pulse"></div>
                 <ScanLine className="w-12 h-12 text-orange-500/50 mb-2 animate-bounce" />
                 <p className="text-xs font-bold text-orange-500/50 uppercase tracking-widest">Camera Initializing...</p>
              </div>

              <div className="w-full flex items-center gap-4 mb-6">
                 <div className="h-px bg-zinc-800 flex-1"></div>
                 <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">OR ENTER PIN</span>
                 <div className="h-px bg-zinc-800 flex-1"></div>
              </div>
              
              <form onSubmit={handleVerify} className="w-full flex flex-col gap-4">
                <input required type="text" maxLength={4} placeholder="0000" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full bg-black border-2 border-zinc-800 rounded-2xl p-4 text-center text-3xl font-black text-white tracking-[0.5em] outline-none focus:border-orange-500 transition-colors" />
                <button type="submit" disabled={verifying || pin.length !== 4} className="w-full bg-orange-600 disabled:bg-zinc-800 text-white font-black py-4 rounded-xl active:scale-95 transition-transform flex justify-center uppercase tracking-widest text-sm shadow-lg shadow-orange-900/20">
                  {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Delivery"}
                </button>
              </form>
              <button onClick={() => {setActivePinOrder(null); setPin("");}} className="mt-6 text-zinc-500 font-black uppercase tracking-widest text-xs py-2">
                Cancel
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
