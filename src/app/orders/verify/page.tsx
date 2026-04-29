import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function VerifyOrder({ searchParams }: any) {
  // Await the params to satisfy the latest Next.js requirements
  const params = await searchParams;
  const reference = params?.reference || params?.trxref;

  if (reference) {
    // Instantly intercept and bounce them to the Escrow API
    redirect(`/api/paystack/callback?reference=${reference}`);
  } else {
    // Fallback if there is no reference
    redirect("/orders");
  }
}
