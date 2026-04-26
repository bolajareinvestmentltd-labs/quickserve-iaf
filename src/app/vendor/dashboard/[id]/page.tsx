import { db } from "@/db";
import { vendors, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Plus, Utensils, Zap, Image as ImageIcon, Store } from "lucide-react";

export default async function VendorDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.id, id),
    with: { products: true }
  });

  async function addProduct(formData: FormData) {
    "use server";
    await db.insert(products).values({
      vendorId: id,
      name: String(formData.get("name")),
      price: Number(formData.get("price")),
      category: String(formData.get("category")),
      imageUrl: String(formData.get("imageUrl")),
    });
    revalidatePath(`/vendor/dashboard/${id}`);
    revalidatePath("/");
  }

  return (
    <div className="p-6 bg-black min-h-screen pb-32 text-white">
      <header className="mb-8">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">
          {vendor?.businessName} <span className="text-orange-500">Hub</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Stall: {vendor?.vendorDisplayId}</p>
      </header>

      {/* ➕ ADD PRODUCT FORM */}
      <form action={addProduct} className="bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-800 flex flex-col gap-4 mb-8">
        <h3 className="text-xs font-black uppercase text-zinc-400 mb-2">Upload New Item</h3>
        <input name="name" placeholder="Item Name" required className="bg-black border border-zinc-800 p-4 rounded-2xl outline-none focus:border-orange-500" />
        <div className="grid grid-cols-2 gap-3">
          <input name="price" type="number" placeholder="Price (₦)" required className="bg-black border border-zinc-800 p-4 rounded-2xl outline-none focus:border-orange-500" />
          <select name="category" className="bg-black border border-zinc-800 p-4 rounded-2xl outline-none text-zinc-400">
            <option value="meals">Meal</option>
            <option value="drinks">Drink</option>
          </select>
        </div>
        <input name="imageUrl" placeholder="Cloudinary Image URL" className="bg-black border border-zinc-800 p-4 rounded-2xl outline-none" />
        <button className="bg-orange-600 font-black py-4 rounded-2xl uppercase shadow-lg active:scale-95 transition-all">Add to Menu</button>
      </form>

      {/* 🍱 CURRENT MENU */}
      <div className="grid gap-3">
        {vendor?.products.map(p => (
          <div key={p.id} className="bg-zinc-900 p-4 rounded-3xl border border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {p.category === 'meals' ? <Utensils className="w-4 h-4 text-orange-500" /> : <Zap className="w-4 h-4 text-blue-400" />}
              <p className="font-bold uppercase italic text-sm">{p.name}</p>
            </div>
            <p className="font-black text-orange-500 text-sm">₦{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
