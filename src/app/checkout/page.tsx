import CheckoutForm from "@/components/CheckoutForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-black p-6 pb-32">
      <Link href="/" className="inline-flex mb-6 text-zinc-500 hover:text-white transition-colors">
        <ArrowLeft className="w-6 h-6" />
      </Link>
      <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-8">
        Final <span className="text-orange-500">Plate</span>
      </h1>
      <CheckoutForm />
    </div>
  );
}
