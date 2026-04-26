import { db } from "@/db";
import { vendors } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function AdminVendors() {
  const allVendors = await db.query.vendors.findMany({ orderBy: [desc(vendors.createdAt)] });
  async function quickAdd(formData: FormData) {
    "use server";
    await db.insert(vendors).values({
      businessName: String(formData.get("name")),
      contactPerson: "N/A",
      email: `vendor_${Date.now()}@iaf.com`,
      phone: "0000000000",
    });
    revalidatePath("/admin/vendors");
  }
  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <form action={quickAdd} className="mb-8 flex gap-2"><input name="name" required placeholder="Quick Add Kitchen" className="text-black p-4 rounded-xl flex-1"/><button type="submit" className="bg-orange-600 p-4 rounded-xl font-bold">Add</button></form>
      <div className="grid gap-2">{allVendors.map(v => <div key={v.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">{v.businessName}</div>)}</div>
    </div>
  );
}
