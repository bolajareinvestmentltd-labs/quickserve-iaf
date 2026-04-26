import { db } from "@/db";
import { vendors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function VendorDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.id, id),
    with: { orderItems: { with: { order: true } } }
  });
  if (!vendor) notFound();

  return (
    <div className="p-5 flex flex-col gap-6 bg-black min-h-screen pb-20">
      <h1 className="text-4xl font-black text-white italic">₦{vendor.walletBalance.toLocaleString()}</h1>
      <div className="flex flex-col gap-4">
        {vendor.orderItems?.map((item) => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl text-white">
            <p className="font-bold">{item.order.customerName}</p>
            <p className="text-orange-500 text-sm uppercase">{item.order.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
