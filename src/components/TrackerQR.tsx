"use client";
import dynamic from 'next/dynamic';

// Safely disable SSR only inside this client boundary
const QRCode = dynamic(() => import('react-qr-code'), { ssr: false });

export default function TrackerQR({ url }: { url: string }) {
  return (
    <div className="bg-white p-3 rounded-2xl shadow-xl shadow-orange-950/30">
      <QRCode value={url} size={150} />
    </div>
  );
}
