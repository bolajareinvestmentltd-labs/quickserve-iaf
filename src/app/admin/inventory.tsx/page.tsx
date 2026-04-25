import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";
import { PackageSearch, ShieldAlert } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminInventoryMonitor() {
  const allProducts = await db.query.products.findMany({
    with: { vendor: true },
    orderBy: [desc(products.createdAt)]
  });

  return (
    <div className="p-6 flex flex-col gap-8 bg-black min-h-screen pb-32">
      <header>
        <h1 className="text-3xl font-black text-white italic">MASTER <span className="text-orange-500">INVENTORY</span></h1>
        <p className="text-zinc-500 text-sm">Monitoring all live products across the festival bowl.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allProducts.map((product) => (
          <div key={product.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
               <img src={product.imageUrl || ''} className="w-12 h-12 rounded-xl bg-black object-cover" />
               <div>
                  <h4 className="text-white font-bold text-sm">{product.name}</h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">Sold by: {product.vendor.businessName}</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-orange-500 font-black text-sm">₦{product.price.toLocaleString()}</p>
               <span className="text-[9px] text-green-500 font-bold uppercase">Live</span>
            </div>
          </div>
        ))}
      </div>

      {allProducts.length === 0 && (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-[3rem]">
           <PackageSearch className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
           <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">No products live yet</p>
        </div>
      )}
    </div>
  );
}