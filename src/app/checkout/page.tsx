"use client";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { ArrowLeft, Trash2, ShieldCheck, Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { initializePayment } from "@/app/actions/paystack";

export default function CheckoutPage() {
  const { items, removeItem, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  async function handlePayment(formData: FormData) {
    setLoading(true);
    const res = await initializePayment({
      email: String(formData.get("email")),
      customerName: String(formData.get("name")),
      customerPhone: String(formData.get("phone")),
      customerZone: String(formData.get("zone")),
      amount: getTotal(),
      items: items,
    });

    if (res.url) {
      window.location.href = res.url; // Redirect to Paystack
    } else {
      alert("Payment failed to initialize. Check your keys!");
      setLoading(false);
    }
  }

  if (items.length === 0) return (
    <div className="p-6 bg-black min-h-screen flex flex-col items-center justify-center text-white">
      <h2 className="text-xl font-black uppercase italic mb-4">Your plate is empty</h2>
      <Link href="/" className="bg-orange-600 px-6 py-3 rounded-full font-black uppercase text-xs tracking-widest">Back to Kitchens</Link>
    </div>
  );

  return (
    <div className="p-6 bg-black min-h-screen pb-32 text-white">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 bg-zinc-900 rounded-full text-zinc-500"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">Review <span className="text-orange-500">Order</span></h1>
      </header>

      <form action={handlePayment} className="flex flex-col gap-6">
        {/* 📋 CUSTOMER DETAILS */}
        <div className="flex flex-col gap-3">
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Delivery Details</p>
           <input required name="name" placeholder="Full Name" className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-orange-500 text-sm" />
           <input required name="email" type="email" placeholder="Email Address (for receipt)" className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-orange-500 text-sm" />
           <div className="grid grid-cols-2 gap-3">
             <input required name="phone" placeholder="WhatsApp No." className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-orange-500 text-sm" />
             <input required name="zone" placeholder="Zone / Table" className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-orange-500 text-sm" />
           </div>
        </div>

        {/* 🛒 ITEM LIST */}
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Plate Summary</p>
          {items.map((item) => (
            <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl flex justify-between items-center">
              <div>
                <p className="font-bold text-sm uppercase italic leading-none">{item.name}</p>
                <p className="text-zinc-500 text-[10px] font-bold mt-1 uppercase">{item.quantity}x @ ₦{item.price}</p>
              </div>
              <button type="button" onClick={() => removeItem(item.id)} className="text-red-500/50 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>

        {/* 💳 TOTAL & PAY */}
        <div className="mt-4 bg-zinc-900/50 p-6 rounded-[2.5rem] border border-zinc-800">
          <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase mb-2">
            <span>Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[10px] font-black text-orange-500 uppercase mb-4">
            <span>Platform Fee</span>
            <span>₦50</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-white font-black uppercase italic text-sm">Grand Total</span>
            <span className="text-3xl font-black text-white italic tracking-tighter leading-none">₦{getTotal().toLocaleString()}</span>
          </div>

          <button disabled={loading} className="w-full bg-orange-600 text-white font-black py-5 rounded-[2rem] mt-8 uppercase tracking-widest shadow-xl shadow-orange-900/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <><Zap className="w-5 h-5 fill-current" /> Confirm & Pay</>}
          </button>
        </div>
      </form>
    </div>
  );
}
