"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  price: number;
  vendorId: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === newItem.id);
        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...currentItems, { ...newItem, quantity: 1 }] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        const subtotal = get().items.reduce((acc, i) => acc + i.price * i.quantity, 0);
        return subtotal > 0 ? subtotal + 50 : 0; // Adding your ₦50 Platform Fee
      },
    }),
    { name: "quickserve-cart" }
  )
);
