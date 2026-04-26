import { config } from "dotenv";
config({ path: ".env.local" }); // Load the database URL
import { db } from "./src/db/index";
import { vendors, products } from "./src/db/schema";

async function onboard() {
  console.log("🚀 Environment Loaded. Starting Onboarding...");
  try {
    const [v1] = await db.insert(vendors).values({
      vendorDisplayId: "VND-5419", businessName: "Zaddys Creamery 🍨",
      cuisineType: "EATABLES", email: "zaddys@autofest.com",
      username: "Zaddys419", password: "Salman419*",
      logoUrl: "https://placehold.co/400x400/pink/white?text=ZC", isSlotActive: true
    }).returning();

    await db.insert(products).values({
      vendorId: v1.id, name: "Mini Scoop", price: 2000, category: "EATABLES",
      unit: "Scoop", promoBadge: "Everyone's Favorite",
      description: "Best ice cream in Northern Nigeria."
    });

    const [v2] = await db.insert(vendors).values({
      vendorDisplayId: "VND-5273", businessName: "Amuda Drinks",
      cuisineType: "DRINKS", email: "amuda@autofest.com",
      username: "Amudaekun001", password: "Ekun419*",
      logoUrl: "https://placehold.co/400x400/blue/white?text=AD", isSlotActive: true
    }).returning();

    await db.insert(products).values([
      { vendorId: v2.id, name: "Bottle Water (Single)", price: 300, category: "DRINKS", unit: "Piece", description: "Iced and chilled", promoBadge: "Fest Chill" },
      { vendorId: v2.id, name: "Bottle Water (Pack)", price: 3500, category: "DRINKS", unit: "Pack", description: "Chilled pack", promoBadge: "Bulk Value" }
    ]);

    const [v3] = await db.insert(vendors).values({
      vendorDisplayId: "VND-9144", businessName: "Jare's Choice Labs",
      cuisineType: "FOOD", email: "jares@autofest.com",
      username: "Olowojare3", password: "Ka$kaz@25/z@26",
      logoUrl: "https://placehold.co/400x400/yellow/black?text=JL", isSlotActive: true
    }).returning();

    await db.insert(products).values({
      vendorId: v3.id, name: "Chicken Pie", price: 1200, category: "FOOD",
      unit: "Piece", description: "Fresh and ready", promoBadge: "Autos Favorite"
    });

    console.log("✅ ONBOARDING COMPLETE.");
  } catch (e) { console.error("❌ ERROR:", e); }
  process.exit(0);
}
onboard();
