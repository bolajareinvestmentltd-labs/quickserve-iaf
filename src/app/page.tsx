import Header from '@/components/Header';
import VendorList from '@/components/VendorList';
import { db } from '@/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const allVendors = await db.query.vendors.findMany();

  return (
    <main className="min-h-screen bg-[#0A0C10]">
      <Header />
      <div className="container mx-auto px-4 pt-8">
        <div className="mb-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
            ILORIN AUTO <span className="text-orange-500">FEST.</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium">Official Food & Logistics Partner</p>
        </div>
        <VendorList vendors={allVendors} />
      </div>
    </main>
  );
}
