import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CheckCircle2, Gift, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ reference: string }> }) {
  const { reference } = await searchParams;
  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
  });
  const data = await res.json();

  if (data.data.status === "success") {
    const [order] = await db.update(orders)
      .set({ status: "paid" })
      .where(eq(orders.status, "pending")) 
      .returning();

    const cashbackPossible = order.totalAmount * 0.05;

    return (
      <div className="p-6 bg-black min-h-screen flex flex-col items-center justify-center text-white text-center">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Order <span className="text-green-500">Paid!</span></h1>
        
        {/* THE GUEST UPSELL */}
        {!order.userId && (
          <div className="my-8 p-6 bg-zinc-900 rounded-[2.5rem] border border-orange-500/30 flex flex-col items-center">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <Gift className="text-white w-6 h-6" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Don't lose your bonus!</p>
            <h3 className="text-xl font-black italic mt-1">SAVE ₦{cashbackPossible.toLocaleString()}</h3>
            <p className="text-[10px] text-zinc-500 mt-2 max-w-[200px]">Create an account in 30 seconds to claim the cashback from this order.</p>
            <Link href="/auth" className="mt-6 bg-orange-600 px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest">Claim My Money</Link>
          </div>
        )}

        <Link href={`/orders/${order.id}/track`} className="flex items-center gap-2 text-zinc-500 font-bold uppercase text-[10px] tracking-widest hover:text-white">
          Skip and Track Order <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }
}
