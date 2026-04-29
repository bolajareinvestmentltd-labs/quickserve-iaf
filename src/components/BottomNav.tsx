"use client";
import { Home, Search, ShoppingBag, MessageSquare, Smile } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/useCart";

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/vendor")) return null;
  const { items } = useCart();
  const cartCount = items.reduce((sum: number, item: any) => sum + Number(item.quantity), 0);

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: ShoppingBag, label: "Orders", href: "/orders", prefetch: false },
    { icon: MessageSquare, label: "Support", href: "/support" },
    { icon: Smile, label: "Profile", href: "/profile" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-zinc-800 px-6 py-4 z-[90]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item, i) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={i} href={item.href} prefetch={item.prefetch} className={`flex flex-col items-center gap-1 transition-colors ${isActive ? "text-orange-500" : "text-zinc-500 hover:text-zinc-400"}`}>
              <div className="relative">
                <item.icon className={`w-6 h-6 ${isActive ? "fill-orange-500/20" : ""}`} />
                {item.label === "Orders" && cartCount > 0 && !isActive && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-black tracking-widest uppercase">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
