"use client";

import { useCartStore } from "@/lib/store";
import { Plus } from "lucide-react";

interface AddToCartBtnProps {
  product: {
    id: string;
    name: string;
    price: number;
  };
  vendorId: string;
}

export default function AddToCartBtn({ product, vendorId }: AddToCartBtnProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      vendorId: vendorId,
    });
    // Optional: You can trigger a small haptic feedback here if using a PWA
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50); 
    }
  };

  return (
    <button
      onClick={handleAdd}
      className="bg-orange-100 text-orange-600 hover:bg-orange-200 active:bg-orange-300 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm"
      aria-label="Add to cart"
    >
      <Plus className="w-5 h-5" />
    </button>
  );
}
