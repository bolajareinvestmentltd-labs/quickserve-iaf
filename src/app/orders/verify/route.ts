import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  
  let baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://quickserve-iaf.vercel.app";
  baseUrl = baseUrl.replace(/\/$/, "");

  if (reference) {
    // Pure server-to-server bounce. React never loads.
    return NextResponse.redirect(`${baseUrl}/api/paystack/callback?reference=${reference}`);
  }
  
  return NextResponse.redirect(`${baseUrl}/orders`);
}
