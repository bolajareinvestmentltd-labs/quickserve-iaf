import { db } from "@/db";
import { orders, products, vendors } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LayoutGrid, ShoppingBag, Users, Zap, ArrowRight, Store, Bike, ClipboardList } from "lucide-react";
import Link from "next/link";

export default async function AdminHub() {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_session")) redirect("/admin/login");

  // Fetch REAL counts from DB
  const [orderCount] = await db.select({ value: count() }).from(orders);
  const [productCount] = await db.select({ value: count() }).from(products);
  const [vendorCount] = await db.select({ value: count() }).from(vendors);

  const stats = [
    { label: "Total Orders", value: orderCount.value, icon: Zap, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Live Products", value: productCount.value, icon: ShoppingBag, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/10" },
  ];

  return (
    <div className="p-6 bg-black min-h-screen text-white pb-32">
      <header className="mb-10">
        <h1 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">Operations</h1>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter italic">Command <span className="text-[#D4AF37]">Center</span></h2>
      </header>

      {/* REAL STAT CARDS */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2.5rem]">
            <s.icon className={`${s.color} w-5 h-5 mb-4`} />
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">{s.label}</p>
            <p className="text-3xl font-black italic mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      {/* NAVIGATION PANEL */}
      <div className="flex flex-col gap-3">
        <Link href="/admin/vendors" className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] flex items-center justify-between group">
          <div className="flex items-center gap-5">
            <div className="bg-white/5 p-4 rounded-3xl group-hover:bg-[#D4AF37]/20 transition-colors">
              <Store className="text-[#D4AF37] w-6 h-6" />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Master Inventory</h3>
          </div>
          <ArrowRight className="text-zinc-700 w-5 h-5" />
        </Link>

        <Link href="/admin/compliance" className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] flex items-center justify-between group">
          <div className="flex items-center gap-5">
            <div className="bg-white/5 p-4 rounded-3xl group-hover:bg-blue-500/20 transition-colors">
              <Bike className="text-blue-500 w-6 h-6" />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Rider Logistics</h3>
          </div>
          <ArrowRight className="text-zinc-700 w-5 h-5" />
        </Link>

        <Link href="/admin/orders" className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] flex items-center justify-between group">
          <div className="flex items-center gap-5">
            <div className="bg-white/5 p-4 rounded-3xl group-hover:bg-orange-500/20 transition-colors">
              <ClipboardList className="text-orange-500 w-6 h-6" />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Real-Time Orders</h3>
          </div>
          <ArrowRight className="text-zinc-700 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
