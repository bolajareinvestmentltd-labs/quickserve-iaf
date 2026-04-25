"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ClipboardList, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show this nav if the user is in the admin dashboard
  if (pathname?.startsWith('/admin')) return null;

  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Search', icon: Search, href: '#' },
    { name: 'Orders', icon: ClipboardList, href: '/orders' },
    { name: 'Profile', icon: User, href: '#' },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 flex justify-between px-8 py-3 z-40 rounded-t-3xl">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1">
            <item.icon className={`w-6 h-6 transition-colors ${isActive ? 'text-orange-500' : 'text-zinc-500'}`} />
            <span className={`text-[10px] font-bold ${isActive ? 'text-orange-500' : 'text-zinc-500'}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}