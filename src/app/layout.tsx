import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FloatingCart from "@/components/FloatingCart";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Quickserve | Ilorin Automotive Festival",
  description: "The official IAF food & logistics hub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {/* Main App Container: Max width for mobile feel on all devices */}
        <main className="mx-auto max-w-md min-h-screen bg-black relative shadow-2xl pb-24">
          {children}
          
          {/* Persistent App UI */}
          <FloatingCart />
          <BottomNav />
        </main>
      </body>
    </html>
  );
}
