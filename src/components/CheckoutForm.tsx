"use client";
import { useCart } from "@/hooks/useCart";
import { Zap, Loader2 } from "lucide-react";
import { initializePayment } from "@/app/actions/paystack";
import { useState } from "react";

export default function CheckoutForm() {
  // Bypass TS strictness on the cart store structure
  const cartStore = useCart() as any;
  const cart = cartStore.items || cartStore.cart || [];
  const cartTotal = cartStore.cartTotal || cartStore.totalPrice || cart.reduce((acc: any, item: any) => acc + (item.price * item.quantity), 0);
  
  const platformFee = 50;
  const finalTotal = cartTotal + platformFee;
  const [loading, setLoading] = useState(false);

  async function handlePay(formData: FormData) {
    setLoading(true);
    try {
      const data = Object.fromEntries(formData.entries());
      // Server action handles the redirect to Paystack natively
      await initializePayment(data, cart, cartTotal);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  if (cart.length === 0) return <div className="text-zinc-500 font-bold uppercase text-center mt-10 text-xs">Your plate is empty</div>;

  return (
    <form action={handlePay} className="flex flex-col gap-4 max-w-md mx-auto w-full">
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col gap-2">
        <div className="flex justify-between text-sm text-zinc-300"><span>Subtotal</span><span>₦{cartTotal.toLocaleString()}</span></div>
        <div className="flex justify-between text-sm text-zinc-300"><span>Platform Fee</span><span>₦{platformFee.toLocaleString()}</span></div>
        <div className="flex justify-between items-center text-white pt-2 mt-1 border-t border-zinc-800 font-bold">
          <span>Final Plate</span><span className="text-orange-500 italic text-xl">₦{finalTotal.toLocaleString()}</span>
        </div>
      </div>
      <div className="grid gap-3">
        <input name="fullName" placeholder="Full Name" required className="bg-zinc-900 text-sm p-4 rounded-xl border border-zinc-800 text-white outline-none focus:border-orange-500" />
        <input name="phone" placeholder="WhatsApp No." required className="bg-zinc-900 text-sm p-4 rounded-xl border border-zinc-800 text-white outline-none focus:border-orange-500" />
        <input name="zone" placeholder="Zone / Stall" required className="bg-zinc-900 text-sm p-4 rounded-xl border border-zinc-800 text-white outline-none focus:border-orange-500" />
      </div>
      <button type="submit" disabled={loading} className="bg-orange-600 text-white font-black py-4 rounded-2xl mt-4 flex items-center justify-center gap-2 active:scale-95 transition-transform">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap className="w-5 h-5 fill-current" /> PAY ₦{finalTotal.toLocaleString()}</>}
      </button>
    </form>
  );
}
