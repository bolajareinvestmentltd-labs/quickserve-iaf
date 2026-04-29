import { db } from "@/db";
import VendorLoginClient from "./VendorLoginClient";

export const dynamic = "force-dynamic";

export default async function VendorLogin() {
  const allVendors = await db.query.vendors.findMany({
    columns: { id: true, businessName: true }
  });
  
  return <VendorLoginClient vendors={allVendors} />;
}
