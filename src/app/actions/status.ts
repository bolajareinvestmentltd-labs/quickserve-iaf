"use server";

import { db } from "@/db";
import { vendors, runners } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function pingStatus(id: string, type: "vendor" | "runner") {
  const table = type === "vendor" ? vendors : runners;
  await db.update(table).set({ lastSeen: new Date() }).where(eq(table.id, id));
}
