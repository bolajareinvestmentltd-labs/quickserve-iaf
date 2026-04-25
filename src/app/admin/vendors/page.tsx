import { db } from "@/db";
import { vendors } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Plus, Store, ChevronRight, Settings } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function VendorsManager() {
  const allVendors = await db.query.vendors.findMany({
    orderBy: [desc(vendors.createdAt)],
    with: { products: true }
  });

  return (
    <div className="p-5">
      <header className="flex justify-between items-center mb-6 mt-4">
        <div>
          <h1 className="text-3xl font-black text-white">Vendors</h1>
          <p className="text-neutral-400 text-sm mt-1">Manage festival merchants</p>
        </div>
        <Link 
          href="/admin/vendors/new"
          className="bg-orange-600 hover:bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center active:scale-95 shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </header>

      {allVendors.length === 0 ? (
        <div className="text-center p-10 bg-neutral-900 border border-neutral-800 border-dashed rounded-3xl mt-10">
          <Store className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <p className="text-neutral-400">No vendors onboarded yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {allVendors.map((vendor) => (
            <div key={vendor.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-3xl flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{vendor.businessName}</h3>
                  <p className="text-neutral-400 text-xs">{vendor.contactPerson} • {vendor.phone}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${vendor.isSlotActive ? 'bg-green-500/10 text-green-500' : 'bg-neutral-800 text-neutral-500'}`}>
                  {vendor.isSlotActive ? 'ACTIVE' : 'OFFLINE'}
                </div>
              </div>
              
              <div className="flex gap-2 mt-2 pt-4 border-t border-neutral-800">
                {/* Button to go to the Product/Promo manager for this vendor */}
                <Link 
                  href={`/admin/vendors/${vendor.id}/products`}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold active:scale-95"
                >
                  <Settings className="w-4 h-4" /> Manage Menu ({vendor.products.length})
                </Link>
                
                {/* Button to view their public store */}
                <Link 
                  href={`/vendor/${vendor.id}`}
                  className="bg-orange-600/10 text-orange-500 w-12 rounded-xl flex items-center justify-center active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
