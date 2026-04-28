import { db } from "@/db";
import { orders } from "@/db/schema";
import { inArray } from "drizzle-orm";
import RunnerDashboardClient from "@/components/RunnerDashboardClient";

export const dynamic = "force-dynamic";

export default async function RunnerDashboardPage() {
  // Fetch all orders that are waiting for a runner, OR already picked up by a runner
  const activeOrders = await db.query.orders.findMany({
    where: inArray(orders.status, ["preparing", "out_for_delivery"]),
  });

  return <RunnerDashboardClient allOrders={activeOrders} />;
}
