import { db } from "@/db";
import { products, vendors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function AdminVendorProducts({ params }: { params: Promise<{ id: string }> }) {
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
    revalidatePath(`/admin/vendors/${id}/products`);
  }

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <header className="flex items-center gap-3 mb-8">
        <Link href="/admin/vendors" className="p-2 bg-zinc-900 rounded-full text-zinc-500"><ArrowLeft className="w-4 h-4" /></Link>
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">Manage <span className="text-[#D4AF37]">Menu</span></h1>
      </header>

      <form action={addProduct} className="bg-zinc-900 p-6 rounded-[2rem] border border-zinc-800 flex flex-col gap-3 mb-8">
        <input name="name" placeholder="Product Name" required className="bg-black border border-zinc-800 p-4 rounded-xl outline-none" />
        <div className="grid grid-cols-2 gap-2">
          <input name="price" type="number" placeholder="Price" required className="bg-black border border-zinc-800 p-4 rounded-xl outline-none" />
          <select name="category" className="bg-black border border-zinc-800 p-4 rounded-xl outline-none text-zinc-500">
            <option value="meals">Meal</option>
            <option value="drinks">Drink</option>
          </select>
        </div>
        <input name="imageUrl" placeholder="Image URL" className="bg-black border border-zinc-800 p-4 rounded-xl outline-none" />
        <button className="bg-[#D4AF37] text-black font-black py-4 rounded-xl uppercase">Add Item</button>
      </form>

      <div className="grid gap-2">
        {vendor?.products.map(p => (
          <div key={p.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex justify-between items-center">
            <span className="font-bold uppercase italic">{p.name}</span>
            <span className="text-[#D4AF37] font-black">₦{p.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
