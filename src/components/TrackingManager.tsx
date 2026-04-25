"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { Star, Send, X } from "lucide-react";

export default function TrackingManager({ orderId, initialStatus }: { orderId: string, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const router = useRouter();

  // 🔄 REAL-TIME STATUS POLLING
  useEffect(() => {
    if (status === "delivered") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`);
        const data = await res.json();
        if (data.status !== status) {
          setStatus(data.status);
          if (data.status === "delivered") setShowRating(true);
        }
      } catch (e) { console.error("Polling error", e); }
    }, 5000);

    return () => clearInterval(interval);
  }, [status, orderId]);

  return (
    <>
      {/* 📲 QR CODE FOR WAITER */}
      {status === "out_for_delivery" && (
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl flex flex-col items-center">
          <p className="text-black font-black uppercase text-[10px] mb-6 tracking-[0.2em]">Show to Waiter for Scan</p>
          <div className="p-4 bg-white rounded-3xl border-4 border-black">
            <QRCode value={orderId} size={200} viewBox={`0 0 256 256`} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
          </div>
          <div className="mt-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            <span className="text-black font-black italic uppercase text-sm">Waiting for Handshake</span>
          </div>
        </div>
      )}

      {/* ⭐ AUTOMATIC RATING MODAL */}
      {showRating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-[3rem] p-8 flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6">
              <Star className="text-white fill-current w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white italic uppercase leading-tight">Order<br/>Delivered!</h2>
            <p className="text-zinc-500 text-xs font-bold mt-2 uppercase tracking-widest">How was the experience?</p>

            <div className="flex gap-2 my-8">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)} className={`p-3 rounded-2xl transition-all ${rating >= s ? 'bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/20' : 'bg-zinc-800 text-zinc-600'}`}>
                  <Star className={`w-6 h-6 ${rating >= s ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>

            <textarea placeholder="Any feedback for the kitchen?" className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white text-xs outline-none focus:border-orange-500 min-h-[80px]" />

            <button onClick={() => setShowRating(false)} className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl mt-6 uppercase shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Submit Feedback
            </button>
          </div>
        </div>
      )}
    </>
  );
}
