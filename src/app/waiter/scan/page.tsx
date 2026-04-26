"use client";
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { CheckCircle, XCircle, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WaiterScanner() {
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
    scanner.render(
      async (decodedText) => {
        setScanResult(decodedText);
        try { await fetch(`/api/orders/${decodedText}/deliver`, { method: 'POST' }); } catch (err) {}
        scanner.clear().catch(() => {});
      },
      () => {}
    );
    return () => { scanner.clear().catch(() => {}); };
  }, []);

  return (
    <div className="min-h-screen bg-black p-6 flex flex-col items-center gap-8 text-white">
      <header className="w-full flex items-center justify-between"><Link href="/"><ArrowLeft /></Link><h1>Scan</h1></header>
      <div id="reader" className="w-full max-w-sm bg-white text-black"></div>
      {scanResult && <p className="text-xl text-green-500 font-bold">{scanResult}</p>}
    </div>
  );
}
