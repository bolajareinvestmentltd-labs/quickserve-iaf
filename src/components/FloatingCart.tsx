"use client";
import { ShoppingBasket, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useRouter, usePathname } from "next/navigation";

export default function FloatingCart() {
  const { items } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  if (items.length === 0 || pathname === "/checkout") return null;

  // Safe Math to prevent Next.js silent crashes
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
  const totalItems = items.reduce((sum, item) => sum + Number(item.quantity), 0);

  return (
    <div className="fixed bottom-6 left-4 right-4 z-[9999] animate-in slide-in-from-bottom-10">
      <div 
        onClick={() => router.push("/checkout")}
        className="bg-orange-600 rounded-[2rem] p-4 flex items-center justify-between shadow-2xl shadow-orange-900/50 cursor-pointer active:scale-95 transition-transform"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black/20 rounded-full flex items-center justify-center">
            <ShoppingBasket className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-200">Your Basket</span>
            <span className="text-white font-black">{totalItems} Items</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white font-black italic text-xl">₦{totalAmount.toLocaleString()}</span>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
