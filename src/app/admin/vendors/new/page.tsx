import { db } from "@/db";
import { vendors } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default function NewVendor() {
  async function createVendor(formData: FormData) {
    "use server";
    await db.insert(vendors).values({
      businessName: String(formData.get("name")),
      contactPerson: "N/A",
      email: `vendor_${Date.now()}@iaf.com`,
      phone: "0000000000",
    });
    revalidatePath("/admin/vendors");
    redirect("/admin/vendors");
  }
  return (
    <div className="p-6 bg-black min-h-screen"><form action={createVendor} className="flex gap-2"><input name="name" placeholder="Business Name" required className="text-black p-4 rounded-xl flex-1" /><button type="submit" className="bg-orange-600 text-white px-4 rounded-xl font-bold">Save</button></form></div>
  );
}
