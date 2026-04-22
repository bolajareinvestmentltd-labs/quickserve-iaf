"use client";
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer } from 'lucide-react';
import Link from 'next/link';

export default function QRCodeGenerator() {
  // Replace this with your actual Vercel live domain once you know it
  const LIVE_URL = "https://quickserve-iaf.vercel.app";

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl flex justify-between items-center mb-8">
        <Link href="/admin" className="text-gray-500 font-bold hover:text-black transition">
          ← Back to Dispatch
        </Link>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl font-bold hover:bg-gray-800 transition"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* The Printable QR Card */}
      <div id="qr-print-area" className="bg-white p-12 rounded-3xl shadow-xl flex flex-col items-center text-center border-4 border-orange-500 max-w-sm w-full">
        <div className="mb-6">
          <h1 className="text-4xl font-black italic tracking-tighter text-black">
            QUICK<span className="text-orange-500">SERVE</span>
          </h1>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">
            Skip the line.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-inner border border-gray-100 mb-6">
          <QRCodeSVG 
            value={LIVE_URL} 
            size={200}
            level="H"
            includeMargin={false}
            fgColor="#000000"
            bgColor="#ffffff"
          />
        </div>

        <h2 className="text-2xl font-black text-black mb-2">Scan to Order Food</h2>
        <p className="text-gray-500 font-medium">
          Point your phone camera here to order, and a runner will bring it to your zone.
        </p>
      </div>

      {/* Print-specific CSS to hide everything else on the page when printing */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
            background-color: white !important;
          }
          #qr-print-area, #qr-print-area * {
            visibility: visible;
          }
          #qr-print-area {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            box-shadow: none;
            border: 8px solid #f97316; /* Orange border */
          }
        }
      `}} />
    </main>
  );
}
