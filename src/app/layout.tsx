import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auto Fest | QuickServe",
  description: "Order food and drinks instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
        <Toaster position="top-center" toastOptions={{ style: { background: "#18181b", color: "#fff", border: "1px solid #27272a" } }} />
        <BottomNav />
      </body>
    </html>
  );
}
