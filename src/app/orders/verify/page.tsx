"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOrder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  useEffect(() => {
    if (reference) {
      // 1. Grab the payment reference from the URL
      // 2. Send it to our API to split the money and create the tickets
      // 3. The API will automatically redirect them to the final /orders page
      window.location.href = `/api/paystack/callback?reference=${reference}`;
    } else {
      router.push("/orders");
    }
  }, [reference, router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-600/20 rounded-full blur-[80px]"></div>
      
      {/* Cool Spinner */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-zinc-800 border-t-orange-500 rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-black italic tracking-tighter animate-pulse uppercase">Verifying Payment...</h2>
        <p className="text-zinc-400 font-bold text-sm mt-2 tracking-widest uppercase">Securing your escrow tickets</p>
      </div>
    </div>
  );
}
