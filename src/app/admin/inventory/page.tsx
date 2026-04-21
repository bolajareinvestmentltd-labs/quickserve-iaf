import { db } from '@/db';
import * as schema from '@/db/schema';
import { desc } from 'drizzle-orm';
import { PlusCircle, Package } from 'lucide-react';
import Link from 'next/link';
import AddProductForm from './AddProductForm';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  // Fetch all vendors so we can assign products to them
  const vendors = await db.query.vendors.findMany();
  
  // Fetch all current products
  const products = await db.query.products.findMany({
    orderBy: [desc(schema.products.id)],
    with: { vendor: true }
  });

  return (
    <main className="min-h-screen bg-[#0A0C10] text-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black italic text-white uppercase">Inventory Hub</h1>
            <p className="text-gray-400 text-sm mt-1">Manage all vendor menus in real-time</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin" className="px-5 py-2.5 bg-[#14171F] border border-white/10 rounded-xl text-sm font-bold hover:bg-[#1A1D24] transition">
              Dispatch Board
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Section (Client Component injected here) */}
          <div className="lg:col-span-1">
            <div className="bg-[#14171F] p-6 rounded-3xl border border-white/5 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <PlusCircle className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-bold text-white">Add Item</h2>
              </div>
              <AddProductForm vendors={vendors} />
            </div>
          </div>

          {/* Product List Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-bold text-gray-300">Live Menu Items ({products.length})</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((item) => (
                <div key={item.id} className="bg-[#14171F] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#0A0C10] rounded-xl flex items-center justify-center text-2xl border border-white/5">
                    {item.imageUrl}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.vendor.businessName} • {item.category}</p>
                    <p className="font-black text-orange-500 mt-1">₦{Number(item.price).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </main>
  );
}
