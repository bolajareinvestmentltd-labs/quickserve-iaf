"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { ArrowLeft, Trash2, Zap, Loader2, Gift } from "lucide-react";
import Link from "next/link";
import { initializePayment } from "@/app/actions/paystack";

export default function CheckoutPage() {
  const { items, removeItem, getTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const userId = localStorage.getItem("qs_user_id");
    if (userId) setIsGuest(false);
  }, []);

  async function handlePayment(formData: FormData) {
    setLoading(true);
    const res = await initializePayment({
      email: String(formData.get("email")),
      customerName: String(formData.get("name")),
      customerPhone: String(formData.get("phone")),
      customerZone: String(formData.get("zone")),
      amount: getTotal(),
      items: items,
      userId: localStorage.getItem("qs_user_id") || undefined
    });

    if (res.url) window.location.href = res.url;
    else { alert("Payment failed. Try again."); setLoading(false); }
  }

  if (items.length === 0) return (
    <div className="p-6 bg-black min-h-screen flex flex-col items-center justify-center text-white">
      <h2 className="text-xl font-black uppercase italic mb-4 text-zinc-700">Plate is empty</h2>
      <Link href="/" className="bg-zinc-900 border border-zinc-800 px-8 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest text-white">Explore Menu</Link>
    </div>
  );

  return (
    <div className="p-6 bg-black min-h-screen pb-32 text-white">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 bg-zinc-900 rounded-full text-zinc-500"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">Final <span className="text-orange-500">Plate</span></h1>
      </header>

      {/* 🎁 THE "CASHBACK" AD FOR GUESTS */}
      {isGuest && (
        <Link href="/auth" className="mb-8 bg-gradient-to-r from-orange-600/20 to-orange-900/10 border border-orange-500/20 p-4 rounded-[2rem] flex items-center gap-4 group">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/40">
            <Gift className="text-white w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Guest Member</p>
            <p className="text-white text-xs font-bold leading-tight mt-0.5">Sign up now to claim <span className="text-orange-500">₦{(getTotal() * 0.05).toLocaleString()}</span> cashback on this order!</p>
          </div>
        </Link>
      )}

      <form action={handlePayment} className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
           <input required name="name" placeholder="Full Name" className="bg-zinc-900 border border-zinc-800 p-5 rounded-[1.5rem] outline-none focus:border-orange-500 text-sm" />
           <div className="grid grid-cols-2 gap-3">
             <input required name="phone" placeholder="WhatsApp No." className="bg-zinc-900 border border-zinc-800 p-5 rounded-[1.5rem] outline-none focus:border-orange-500 text-sm" />
             <input required name="zone" placeholder="Zone / Stall" className="bg-zinc-900 border border-zinc-800 p-5 rounded-[1.5rem] outline-none focus:border-orange-500 text-sm" />
           </div>
           <input required name="email" type="email" placeholder="Email (for your digital receipt)" className="bg-zinc-900 border border-zinc-800 p-5 rounded-[1.5rem] outline-none focus:border-orange-500 text-sm" />
        </div>

        <button disabled={loading} className="w-full bg-orange-600 text-white font-black py-6 rounded-[2.5rem] mt-4 uppercase tracking-widest shadow-xl shadow-orange-900/40 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" /> : <><Zap className="w-5 h-5 fill-current" /> Pay ₦{getTotal().toLocaleString()}</>}
        </button>
      </form>
    </div>
  );
}
