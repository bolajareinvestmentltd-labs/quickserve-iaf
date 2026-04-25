"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, ShoppingBag, Shield, Bike } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/vendors", icon: Store, label: "Kitchens" },
    { href: "/admin/inventory", icon: Shield, label: "Admin" },
    { href: "/admin/runners", icon: Bike, label: "Runners" },
  ];

  return (
    <nav className="fixed bottom-6 left-6 right-6 z-[100] bg-zinc-900/80 backdrop-blur-2xl border border-white/5 p-4 rounded-[2.5rem] flex items-center justify-around shadow-2xl shadow-black/50">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link key={link.href} href={link.href} className="flex flex-col items-center gap-1 relative group">
            <link.icon className={`w-5 h-5 transition-all ${isActive ? 'text-orange-500 scale-110' : 'text-zinc-600 group-active:scale-90'}`} />
            {isActive && <div className="absolute -bottom-2 w-1 h-1 bg-orange-500 rounded-full" />}
          </Link>
        );
      })}
    </nav>
  );
}
