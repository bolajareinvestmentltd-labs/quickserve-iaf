"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, MessageSquare, Smile } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function BottomNav() {
  const pathname = usePathname();
  const cartStore = useCart() as any;
  const cart = cartStore.items || cartStore.cart || [];
  const cartCount = cart.reduce((acc: any, item: any) => acc + item.quantity, 0);

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Search", icon: Search, path: "/search" },
    { name: "Orders", icon: ShoppingBag, path: "/checkout", badge: cartCount },
    { name: "Support", icon: MessageSquare, path: "/support" },
    { name: "Profile", icon: Smile, path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-zinc-900 px-6 py-4 flex justify-between items-center z-50 pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link href={item.path} key={item.name} className="relative flex flex-col items-center gap-1 group">
            <div className={`p-2 rounded-xl transition-all ${isActive ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
              <item.icon className={`w-6 h-6 ${isActive ? 'fill-orange-500/20' : ''}`} />
              {item.badge > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-black">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`text-[9px] font-bold ${isActive ? 'text-orange-500' : 'text-zinc-600'}`}>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
