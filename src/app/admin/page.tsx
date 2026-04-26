import { db } from "@/db";
import { vendors, orders, runners } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { Activity, TrendingUp, Users, Bike, ShoppingBag, Store } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const stats = await db.select({
    totalRevenue: sql<number>`sum(${orders.totalAmount})`,
    orderCount: sql<number>`count(${orders.id})`,
  }).from(orders).where(eq(orders.status, 'delivered'));

  const activeVendors = await db.select({ count: sql<number>`count(${vendors.id})` }).from(vendors);
  const activeRunners = await db.select({ count: sql<number>`count(${runners.id})` }).from(runners);

  const cards = [
    { label: "Total Revenue", value: `₦${(stats[0]?.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: "text-green-500" },
    { label: "Delivered", value: stats[0]?.orderCount || 0, icon: ShoppingBag, color: "text-orange-500" },
    { label: "Kitchens", value: activeVendors[0]?.count || 0, icon: Store, color: "text-blue-500" },
    { label: "Runners", value: activeRunners[0]?.count || 0, icon: Bike, color: "text-purple-500" },
  ];

  return (
    <div className="p-6 flex flex-col gap-8 bg-black min-h-screen pb-32">
      <header>
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Command <span className="text-orange-500">Center</span></h1>
        <p className="text-zinc-500 text-sm font-bold">Ilorin Auto Fest Logistics Overview</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-5 rounded-[2rem] flex flex-col gap-2">
            <card.icon className={`w-5 h-5 ${card.color}`} />
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{card.label}</p>
            <p className="text-xl font-black text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3">
        <Link href="/admin/vendors" className="bg-zinc-900 p-6 rounded-[2rem] border border-zinc-800 flex justify-between items-center group active:scale-95 transition-all">
          <div className="flex items-center gap-4">
            <Store className="text-orange-500" />
            <span className="text-white font-bold uppercase italic">Manage Kitchens</span>
          </div>
          <Activity className="text-zinc-700 group-hover:text-orange-500 transition-colors" />
        </Link>
        <Link href="/admin/runners" className="bg-zinc-900 p-6 rounded-[2rem] border border-zinc-800 flex justify-between items-center group active:scale-95 transition-all">
          <div className="flex items-center gap-4">
            <Bike className="text-orange-500" />
            <span className="text-white font-bold uppercase italic">Logistics Team</span>
          </div>
          <Activity className="text-zinc-700 group-hover:text-orange-500 transition-colors" />
        </Link>
      </div>
    </div>
  );
}
