"use client";
import { useCart } from "@/hooks/useCart";
import { Zap, Loader2, Info } from "lucide-react";
import { initializePayment } from "@/app/actions/paystack";
import { useState } from "react";

export default function CheckoutForm() {
  const cartStore = useCart() as any;
  const cart = cartStore.items || cartStore.cart || [];
  const cartTotal = cartStore.cartTotal || cartStore.totalPrice || cart.reduce((acc: any, item: any) => acc + (item.price * item.quantity), 0);
  
  const serviceFee = 50;
  const deliveryFee = 200;
  const finalTotal = cartTotal + serviceFee + deliveryFee;
  const [loading, setLoading] = useState(false);

  async function handlePay(formData: FormData) {
    setLoading(true);
    try {
      const data = Object.fromEntries(formData.entries());
      await initializePayment(data, cart, cartTotal);
    } catch (err) { setLoading(false); }
  }

  if (cart.length === 0) return <div className="text-zinc-500 font-bold uppercase text-center mt-10 text-xs">Your plate is empty</div>;

  return (
    <form action={handlePay} className="flex flex-col gap-4 max-w-md mx-auto w-full">
      {/* ITEMS BREAKDOWN */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col gap-3">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">Order Items</h3>
        {cart.map((item: any, i: number) => (
          <div key={i} className="flex justify-between text-sm text-zinc-300">
            <span>{item.quantity}x {item.name}</span>
            <span className="font-bold">₦{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* SEQUENTIAL FEE BREAKDOWN */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col gap-3">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2 flex items-center gap-1">Payment Summary <Info className="w-3 h-3" /></h3>
        <div className="flex justify-between text-sm text-zinc-300"><span>Subtotal</span><span>₦{cartTotal.toLocaleString()}</span></div>
        <div className="flex justify-between text-sm text-zinc-300"><span>Service Fee</span><span>₦{serviceFee.toLocaleString()}</span></div>
        <div className="flex justify-between text-sm text-zinc-300"><span>Delivery Fee</span><span>₦{deliveryFee.toLocaleString()}</span></div>
        
        <div className="flex justify-between items-center text-white pt-3 mt-1 border-t border-zinc-800 font-bold">
          <span className="uppercase tracking-widest text-xs">Final Plate</span>
          <span className="text-orange-500 font-black italic text-2xl">₦{finalTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* COMPACT INPUTS */}
      <div className="grid gap-3 mt-2">
        <input name="fullName" placeholder="Full Name" required className="bg-zinc-900 text-sm p-4 rounded-xl border border-zinc-800 text-white outline-none focus:border-orange-500" />
        <div className="grid grid-cols-2 gap-3">
          <input name="phone" placeholder="WhatsApp No." required className="bg-zinc-900 text-sm p-4 rounded-xl border border-zinc-800 text-white outline-none focus:border-orange-500" />
          <input name="zone" placeholder="Zone / Stall" required className="bg-zinc-900 text-sm p-4 rounded-xl border border-zinc-800 text-white outline-none focus:border-orange-500" />
        </div>
      </div>

      <button type="submit" disabled={loading} className="bg-orange-600 text-white font-black py-4 rounded-2xl mt-4 flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-orange-900/20">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap className="w-5 h-5 fill-current" /> PAY ₦{finalTotal.toLocaleString()}</>}
      </button>
    </form>
  );
}
