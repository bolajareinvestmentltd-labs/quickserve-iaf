import { db } from "@/db";
import { vendors, orders, rides } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { Activity, TrendingUp, Users, Car as CarIcon, ClipboardList } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminHub() {
  const [vendorsCount, activeOrders, totalRevenue, totalRides] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(vendors),
    db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, "pending")),
    db.select({ sum: sql<number>`sum(${orders.totalAmount})` }).from(orders),
    db.select({ count: sql<number>`count(*)` }).from(rides).where(eq(rides.isFull, false)),
  ]);

  const revenue = totalRevenue[0]?.sum || 0;

  return (
    <div className="p-5">
      <header className="mb-8 mt-4">
        <h1 className="text-3xl font-black text-white">Command Center</h1>
        <p className="text-neutral-400 text-sm mt-1 flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-500 animate-pulse" /> Live Festival Data
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl">
          <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Gross Value</p>
          <p className="text-white text-xl font-black mt-1">₦{revenue.toLocaleString()}</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl">
          <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center mb-3">
            <ClipboardList className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Live Orders</p>
          <p className="text-white text-xl font-black mt-1">{activeOrders[0]?.count || 0}</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl">
          <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Vendors</p>
          <p className="text-white text-xl font-black mt-1">{vendorsCount[0]?.count || 0}</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl">
          <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center mb-3">
            <CarIcon className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Active Rides</p>
          <p className="text-white text-xl font-black mt-1">{totalRides[0]?.count || 0}</p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl flex items-center gap-4">
        <div className="flex-1">
          <h3 className="text-white font-bold">Need to onboard a vendor?</h3>
          <p className="text-neutral-400 text-xs mt-1">Use the Vendors tab to create their profile and generate their unique URL.</p>
        </div>
      </div>
    </div>
  );
}
