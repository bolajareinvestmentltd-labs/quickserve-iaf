"use client";
import { useEffect } from "react";
import { pingStatus } from "@/app/actions/status";

export default function StatusPing({ id, type }: { id: string, type: "vendor" | "runner" }) {
  useEffect(() => {
    pingStatus(id, type); // Initial ping
    const interval = setInterval(() => pingStatus(id, type), 30000);
    return () => clearInterval(interval);
  }, [id, type]);
  return null;
}
