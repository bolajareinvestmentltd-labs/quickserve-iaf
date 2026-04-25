"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { CheckCircle, XCircle, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WaiterScanner() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      async (decodedText) => {
        setScanResult(decodedText);
        scanner.clear();
        handleDelivery(decodedText);
      },
      (error) => {
        // Silent error to keep the camera smooth
      }
    );

    return () => scanner.clear();
  }, []);

  async function handleDelivery(orderId: string) {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/deliver`, {
        method: 'POST',
      });
      if (response.ok) {
        setScanResult("SUCCESS");
      } else {
        setScanResult("FAILED");
      }
    } catch (err) {
      setScanResult("FAILED");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-black p-6 flex flex-col items-center gap-8">
      <header className="w-full flex items-center justify-between">
        <Link href="/vendor/dashboard" className="p-3 bg-zinc-900 rounded-2xl">
          <ArrowLeft className="w-5 h-5 text-zinc-400" />
        </Link>
        <h1 className="text-xl font-black text-white italic uppercase tracking-tighter">Runner <span className="text-orange-500">Scan</span></h1>
        <Zap className="w-6 h-6 text-orange-500 fill-current" />
      </header>

      {/* 📷 CAMERA VIEWFINDER */}
      <div className="w-full max-w-sm overflow-hidden rounded-[3rem] border-4 border-zinc-900 bg-zinc-900 shadow-2xl relative">
        <div id="reader" className="w-full h-[400px]"></div>
        
        {/* SUCCESS OVERLAY */}
        {scanResult === "SUCCESS" && (
          <div className="absolute inset-0 bg-green-600 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <CheckCircle className="w-20 h-20 text-white mb-4" />
            <h2 className="text-2xl font-black text-white uppercase italic">Delivered!</h2>
            <button onClick={() => window.location.reload()} className="mt-6 bg-white text-green-600 px-8 py-3 rounded-2xl font-black uppercase text-xs">Next Order</button>
          </div>
        )}

        {/* FAILED OVERLAY */}
        {scanResult === "FAILED" && (
          <div className="absolute inset-0 bg-red-600 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <XCircle className="w-20 h-20 text-white mb-4" />
            <h2 className="text-2xl font-black text-white uppercase italic">Invalid Code</h2>
            <button onClick={() => window.location.reload()} className="mt-6 bg-white text-red-600 px-8 py-3 rounded-2xl font-black uppercase text-xs">Try Again</button>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Instructions</p>
        <p className="text-white text-sm font-bold px-8">Point camera at the QR code on the customer's phone to confirm receipt.</p>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
