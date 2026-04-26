import { db } from "@/db";
import { vendors, orders, runners } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { Activity, TrendingUp, Users, Bike, ShoppingBag, Store } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  return (
    <div className="p-6 flex flex-col gap-8 bg-black min-h-screen pb-32">
      <header>
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Command <span className="text-orange-500">Center</span></h1>
      </header>
      <div className="grid gap-3">
        <Link href="/admin/vendors" className="bg-zinc-900 p-6 rounded-[2rem] border border-zinc-800 flex justify-between items-center group"><div className="flex items-center gap-4"><Store className="text-orange-500" /><span className="text-white font-bold uppercase italic">Manage Kitchens</span></div></Link>
        <Link href="/admin/runners" className="bg-zinc-900 p-6 rounded-[2rem] border border-zinc-800 flex justify-between items-center group"><div className="flex items-center gap-4"><Bike className="text-orange-500" /><span className="text-white font-bold uppercase italic">Logistics Team</span></div></Link>
        <Link href="/admin/orders" className="bg-zinc-900 p-6 rounded-[2rem] border border-zinc-800 flex justify-between items-center group"><div className="flex items-center gap-4"><ShoppingBag className="text-orange-500" /><span className="text-white font-bold uppercase italic">All Orders</span></div></Link>
      </div>
    </div>
  );
}
