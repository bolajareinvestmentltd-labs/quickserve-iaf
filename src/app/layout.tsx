import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FloatingCart from "@/components/FloatingCart";

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
  description: "Order food and find rides instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <main className="mx-auto max-w-md min-h-screen bg-neutral-950 relative shadow-2xl">
          {children}
          {/* The cart is injected here so it overlays all pages seamlessly */}
          <FloatingCart />
        </main>
      </body>
    </html>
  );
}
