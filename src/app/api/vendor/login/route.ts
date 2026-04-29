import { NextResponse } from "next/server";
import { db } from "@/db";
import { vendors } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { vendorId, passcode } = await req.json();

    const vendor = await db.query.vendors.findFirst({
      where: eq(vendors.id, vendorId)
    });

    if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 401 });
    
    // Check PIN (accepts 1234 if the DB schema hasn't synced the new passcode column yet)
    const dbPasscode = (vendor as any).passcode;
    if (dbPasscode && dbPasscode !== passcode) {
       return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    } else if (!dbPasscode && passcode !== "1234") {
       return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, vendorId: vendor.id });
    response.cookies.set("vendor_token", vendor.id, { maxAge: 60 * 60 * 24, path: "/" });
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
