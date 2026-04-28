"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, X, QrCode, Loader2, CheckCircle2, AlertTriangle, Bike } from "lucide-react";
import TrackerQR from "@/components/TrackerQR";
import { submitRating } from "@/app/actions/rating";
import { cancelOrder } from "@/app/actions/cancel";

export default function LiveTracker({ order, steps, trackingUrl }: any) {
  const router = useRouter();
  const [showQR, setShowQR] = useState(false);
  const [showRating, setShowRating] = useState(order.status === "delivered" && !order.rating);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [distance, setDistance] = useState(100); // Radar distance simulation

  // REAL-TIME PULSE & RADAR SIMULATION
  useEffect(() => {
    if (order.status !== "delivered" && order.status !== "cancelled") {
      const interval = setInterval(() => {
        router.refresh();
      }, 8000);
      
      // Radar shrinking logic
      let distInterval: NodeJS.Timeout;
      if (order.status === "out_for_delivery") {
        distInterval = setInterval(() => {
           setDistance(prev => Math.max(12, prev - 8)); // Shrinks down to a close radius
        }, 3000);
      }

      return () => {
        clearInterval(interval);
        if (distInterval) clearInterval(distInterval);
      };
    } else if (order.status === "delivered" && !order.rating) {
      setShowQR(false);
      setShowRating(true);
    }
  }, [order.status, order.rating, router]);

  async function handleRatingSubmit() {
    if (rating === 0) return;
    setSubmitting(true);
    await submitRating({ orderId: order.id, rating, feedback });
    setShowRating(false);
    setSubmitting(false);
  }

  async function handleCancelOrder() {
    if (confirm("Are you sure you want to cancel this order?")) {
      setCancelling(true);
      await cancelOrder(order.id);
      setCancelling(false);
    }
  }

  if (order.status === "cancelled") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center border border-red-500/30">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mt-4">Order Cancelled</h2>
      </div>
    );
  }

  return (
    <>
      {/* 1. OUT FOR DELIVERY DYNAMIC RADAR */}
      {order.status === "out_for_delivery" && (
        <div className="mb-10 bg-zinc-900 border border-orange-600/30 p-8 rounded-3xl flex flex-col items-center text-center shadow-[0_0_30px_rgba(234,88,12,0.1)] relative overflow-hidden">
          
          {/* Pulsing Radar UI */}
          <div className="relative w-32 h-32 flex items-center justify-center mb-6">
             <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping duration-1000"></div>
             <div className="absolute inset-4 bg-orange-500/40 rounded-full animate-pulse"></div>
             <div className="relative z-10 bg-orange-600 w-14 h-14 rounded-full flex items-center justify-center border-2 border-white shadow-[0_0_20px_rgba(234,88,12,0.8)]">
               <Bike className="w-7 h-7 text-white" />
             </div>
          </div>
          
          <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-1">Runner Approaching</h3>
          <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-6">Proximity: {distance}m away</p>

          <button onClick={() => setShowQR(true)} className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform z-10 relative">
            <QrCode className="w-5 h-5" /> SHOW DELIVERY CODE
          </button>
        </div>
      )}

      {/* 2. THE TRACKING CHAIN */}
      <div className="relative pl-10 border-l border-zinc-900 ml-3 mb-10">
        {steps.map((step: any, index: number) => (
          <div key={step.name} className={`mb-12 relative flex items-start ${step.status === "completed" ? "opacity-100" : "opacity-40"}`}>
            <div className={`absolute -left-16 p-3 rounded-full border shadow-xl ${
              step.status === "completed" ? 'bg-zinc-900 text-orange-500 border-zinc-800' : 'bg-zinc-950 text-zinc-600 border-zinc-900'
            }`}>
              <step.icon className="w-6 h-6" />
            </div>
            <div className="pt-2">
              <p className={`font-black italic uppercase text-lg ${step.status === "completed" ? "text-white" : "text-zinc-600"}`}>{step.name}</p>
              <p className="text-xs text-zinc-500 font-bold mt-1 tracking-widest uppercase">{step.status === "completed" ? "Completed" : "Waiting"}</p>
            </div>
          </div>
        ))}
      </div>

      {order.status !== "delivered" && (
        <button onClick={handleCancelOrder} disabled={cancelling} className="w-full bg-red-950/20 border border-red-900/50 text-red-500 font-bold py-4 rounded-2xl mt-4 active:scale-95 transition-transform flex items-center justify-center gap-2">
          {cancelling ? <Loader2 className="w-5 h-5 animate-spin" /> : "CANCEL ORDER"}
        </button>
      )}

      {/* QR & RATING MODALS (Preserved Logic) */}
      {showQR && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-3xl p-6 flex flex-col items-center relative shadow-[0_0_40px_rgba(234,88,12,0.2)]">
            <button onClick={() => setShowQR(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-6 mt-4">Customer Delivery Code</h2>
            <TrackerQR url={trackingUrl} />
            <div className="flex gap-3 mt-8 mb-4">
              {order.deliveryCode?.split('').map((char: string, i: number) => (
                <div key={i} className="w-14 h-16 bg-black border border-zinc-800 rounded-2xl flex items-center justify-center font-black text-3xl text-orange-500 shadow-inner">{char}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showRating && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-3xl p-6 flex flex-col items-center relative shadow-2xl shadow-orange-900/20">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">Order Delivered</h2>
            <p className="text-xs text-zinc-400 font-bold text-center mb-6">How was your QuickServe experience?</p>
            
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="active:scale-90 transition-transform">
                  <Star className={`w-10 h-10 ${rating >= star ? 'fill-orange-500 text-orange-500' : 'text-zinc-700'}`} />
                </button>
              ))}
            </div>

            <textarea 
              placeholder="Tell us what you loved (or what we can improve)..." 
              className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white outline-none focus:border-orange-500 mb-4 h-24 resize-none"
              value={feedback} onChange={(e) => setFeedback(e.target.value)}
            />

            <button onClick={handleRatingSubmit} disabled={rating === 0 || submitting} className="w-full bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all">
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "SUBMIT FEEDBACK"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
