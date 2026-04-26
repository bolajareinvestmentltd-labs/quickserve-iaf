"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  // Show nav only on consumer paths
  const showNav = ["/", "/search", "/orders", "/vendors"].some(p => pathname === p || pathname.startsWith(p)) 
    && !pathname.includes('/admin') 
    && !pathname.includes('/dashboard');

  if (!showNav) return null;

  return (
    <nav className="fixed bottom-6 left-6 right-6 z-[100] bg-zinc-900/90 backdrop-blur-3xl border border-white/5 p-4 rounded-[2.5rem] flex items-center justify-between px-8 shadow-2xl shadow-black/50">
      <Link href="/" className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-orange-500' : 'text-zinc-500'}`}>
        <Home className="w-5 h-5" />
        <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
      </Link>
      
      <Link href="/search" className={`flex flex-col items-center gap-1 ${pathname === '/search' ? 'text-orange-500' : 'text-zinc-500'}`}>
        <Search className="w-5 h-5" />
        <span className="text-[8px] font-black uppercase tracking-widest">Search</span>
      </Link>

      <Link href="/orders" className={`flex flex-col items-center gap-1 ${pathname === '/orders' ? 'text-orange-500' : 'text-zinc-500'}`}>
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[8px] font-black uppercase tracking-widest">Orders</span>
      </Link>

      <button onClick={() => alert("Profile & Settings coming in the next update!")} className="flex flex-col items-center gap-1 text-zinc-500 active:scale-90 transition-transform">
        <User className="w-5 h-5" />
        <span className="text-[8px] font-black uppercase tracking-widest">Profile</span>
      </button>
    </nav>
  );
}
