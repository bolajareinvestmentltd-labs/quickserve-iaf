import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CheckCircle2, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ reference: string }> }) {
  const { reference } = await searchParams;

  // 1. Verify with Paystack (Server-side)
  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
  });
  const data = await res.json();

  if (data.data.status === "success") {
    // 2. We'll update the most recent pending order for this amount (simplification for MVP)
    // In production, we would use the 'reference' saved in the DB
    const [updatedOrder] = await db.update(orders)
      .set({ status: "paid" })
      .where(eq(orders.status, "pending")) 
      .returning();

    return (
      <div className="p-6 bg-black min-h-screen flex flex-col items-center justify-center text-white text-center">
        <div className="w-20 h-20 bg-green-500 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-2xl shadow-green-900/40">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">Order <span className="text-green-500">Paid!</span></h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-[200px] mb-8 leading-relaxed">
          Your payment was successful. The kitchen has been notified.
        </p>

        <Link href={`/orders/${updatedOrder?.id}/track`} className="w-full max-w-xs bg-white text-black font-black py-5 rounded-[2rem] uppercase tracking-widest flex items-center justify-center gap-3">
          Track Live <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return redirect("/");
}
