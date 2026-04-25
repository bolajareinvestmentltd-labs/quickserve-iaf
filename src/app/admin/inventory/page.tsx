import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";
import { PackageSearch, ShieldAlert, ArrowLeft, Store, ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminInventoryMonitor() {
  const allProducts = await db.query.products.findMany({
    with: { vendor: true },
    orderBy: [desc(products.createdAt)]
  });

  return (
    <div className="p-6 flex flex-col gap-8 bg-black min-h-screen pb-32">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-zinc-900 rounded-full text-zinc-500">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            Master <span className="text-orange-500">Inventory</span>
          </h1>
        </div>
        <p className="text-zinc-500 text-sm">Real-time oversight of all products live in the festival bowl.</p>
      </header>

      {/* 📊 SUMMARY MINI-CARDS */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl">
          <p className="text-[10px] font-black text-zinc-500 uppercase">Total Items</p>
          <p className="text-2xl font-black text-white">{allProducts.length}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl">
          <p className="text-[10px] font-black text-zinc-500 uppercase">Active Kitchens</p>
          <p className="text-2xl font-black text-white">
            {new Set(allProducts.map(p => p.vendorId)).size}
          </p>
        </div>
      </div>

      {/* 🍱 PRODUCT FEED */}
      <div className="flex flex-col gap-4">
        {allProducts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-[3rem] bg-zinc-900/20">
             <PackageSearch className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
             <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">No products uploaded yet</p>
          </div>
        ) : (
          allProducts.map((product) => (
            <div key={product.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-[2rem] flex items-center justify-between group">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-2xl bg-black border border-zinc-800 overflow-hidden relative">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-800 font-black">?</div>
                    )}
                    {product.promoBadge && (
                      <span className="absolute bottom-0 left-0 right-0 bg-orange-600 text-[8px] font-black text-white text-center py-0.5 uppercase">
                        {product.promoBadge}
                      </span>
                    )}
                 </div>
                 <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-tight">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Store className="w-3 h-3 text-zinc-600" />
                      <p className="text-[10px] text-zinc-500 font-bold uppercase truncate max-w-[120px]">
                        {product.vendor.businessName}
                      </p>
                    </div>
                 </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                 <p className="text-orange-500 font-black text-sm tracking-tighter">₦{product.price.toLocaleString()}</p>
                 <div className="flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[8px] text-green-500 font-black uppercase">Live</span>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
