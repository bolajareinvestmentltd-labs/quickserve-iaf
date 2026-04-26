import { db } from "@/db";
import { products, vendors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ArrowLeft, Utensils, Zap } from "lucide-react";
import Link from "next/link";

export default async function VendorMenuPage({ params }: { params: Promise<{ id: string }> }) {
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
    revalidatePath(`/vendor/dashboard/${id}/menu`);
  }

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <header className="flex items-center gap-3 mb-8">
        <Link href={`/vendor/dashboard/${id}`} className="p-2 bg-zinc-900 rounded-full text-zinc-500"><ArrowLeft className="w-4 h-4" /></Link>
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">Kitchen <span className="text-orange-500">Menu</span></h1>
      </header>

      <form action={addProduct} className="bg-zinc-900 p-6 rounded-[2rem] border border-zinc-800 flex flex-col gap-3 mb-8">
        <input name="name" placeholder="Item Name" required className="bg-black border border-zinc-800 p-4 rounded-xl outline-none" />
        <div className="grid grid-cols-2 gap-2">
          <input name="price" type="number" placeholder="Price" required className="bg-black border border-zinc-800 p-4 rounded-xl outline-none" />
          <select name="category" className="bg-black border border-zinc-800 p-4 rounded-xl outline-none text-zinc-500">
            <option value="meals">Meal</option>
            <option value="drinks">Drink</option>
          </select>
        </div>
        <input name="imageUrl" placeholder="Image URL" className="bg-black border border-zinc-800 p-4 rounded-xl outline-none" />
        <button className="bg-orange-600 font-black py-4 rounded-xl uppercase">Update Menu</button>
      </form>

      <div className="grid gap-3">
        {vendor?.products.map(p => (
          <div key={p.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-3xl flex justify-between items-center">
            <div className="flex items-center gap-3">
               {p.category === 'meals' ? <Utensils className="text-orange-500 w-4 h-4" /> : <Zap className="text-blue-400 w-4 h-4" />}
               <span className="font-bold uppercase italic text-sm">{p.name}</span>
            </div>
            <span className="text-orange-500 font-black">₦{p.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
