import { create } from 'zustand';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  vendorName: string;
};

type CartStore = {
  isOpen: boolean;
  items: CartItem[];
  toggleCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  isOpen: false,
  items: [],
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  closeCart: () => set({ isOpen: false }),
  
  addItem: (item) => set((state) => {
    const existingItem = state.items.find((i) => i.id === item.id);
    if (existingItem) {
      return {
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),

  updateQuantity: (id, delta) => set((state) => {
    const updatedItems = state.items.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return { ...item, quantity: Math.max(0, newQuantity) };
      }
      return item;
    }).filter(item => item.quantity > 0); // Automatically remove if quantity hits 0
    return { items: updatedItems };
  }),

  clearCart: () => set({ items: [] }),
  totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
  totalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
}));
