import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  vendorId: string;
  vendorName: string;
  imageUrl?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: any, quantity?: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  total: number; 
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      // DEFAULT TO 1 IF NO QUANTITY IS PROVIDED
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity }] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },
      clearCart: () => set({ items: [] }),
      // RESTORED GETTOTAL FOR OLDER COMPONENTS
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      get total() {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'quickserve-cart-storage',
    }
  )
);
