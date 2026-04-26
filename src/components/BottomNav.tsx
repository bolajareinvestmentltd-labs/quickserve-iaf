"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Shield, Bike, Utensils } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  // Define which paths should display the consumer nav bar
  const consumerRootPaths = ["/", "/vendors", "/orders", "/track"];

  // Logic: Show nav only if it's a consumer path and NOT an admin or vendor specific dashboard
  const showNav = consumerRootPaths.some(p => pathname.startsWith(p)) && !pathname.includes('/admin') && !pathname.includes('/dashboard');

  if (!showNav) return null;

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/vendors", icon: Store, label: "Vendors" },
    { href: "/orders", icon: Shield, label: "Orders" },
    { href: "/admin", icon: Utensils, label: "Logistics", exclusive: true }, // Internal link
  ];

  return (
    <nav className="fixed bottom-6 left-6 right-6 z-[100] bg-zinc-900/80 backdrop-blur-2xl border border-white/5 p-4 rounded-[2.5rem] flex items-center justify-around shadow-2xl shadow-black/50">
      {links.map((link) => {
        const isActive = pathname === link.href;
        
        // Skip exclusive links unless you are an admin
        if (link.exclusive && pathname !== "/") return null;

        return (
          <Link key={link.href} href={link.href} className="flex flex-col items-center gap-1 relative group">
            <link.icon className={`w-5 h-5 transition-all ${isActive ? 'text-orange-500 scale-110' : 'text-zinc-600 group-active:scale-90'}`} />
            <span className={`text-[8px] font-bold uppercase transition-all ${isActive ? 'text-white' : 'text-zinc-600'}`}>{link.label}</span>
            {isActive && <div className="absolute -bottom-2 w-1 h-1 bg-orange-500 rounded-full" />}
          </Link>
        );
      })}
    </nav>
  );
}
