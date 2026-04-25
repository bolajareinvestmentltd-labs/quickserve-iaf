import Link from "next/link";
import { LayoutDashboard, Store, ClipboardList, Car } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 pb-20">
      <div className="flex-1">
        {children}
      </div>

      {/* Admin Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-neutral-900 border-t border-neutral-800 flex justify-between px-6 py-4 z-50 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <Link href="/admin" className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white active:scale-95">
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-bold tracking-wider">HUB</span>
        </Link>
        <Link href="/admin/vendors" className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white active:scale-95">
          <Store className="w-6 h-6" />
          <span className="text-[10px] font-bold tracking-wider">VENDORS</span>
        </Link>
        <Link href="/admin/orders" className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white active:scale-95">
          <ClipboardList className="w-6 h-6" />
          <span className="text-[10px] font-bold tracking-wider">ORDERS</span>
        </Link>
        <Link href="/admin/rides" className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white active:scale-95">
          <Car className="w-6 h-6" />
          <span className="text-[10px] font-bold tracking-wider">RIDES</span>
        </Link>
      </nav>
    </div>
  );
}
