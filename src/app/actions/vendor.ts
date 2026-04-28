"use server";
import { db } from "@/db";
import { vendors, products } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createVendor(data: any) {
  try {
    await db.insert(vendors).values({
      businessName: data.businessName,
      email: `${data.username.replace(/\s+/g, '').toLowerCase()}@vendor.quickserve.com`, // Auto-generated to satisfy DB
      username: data.username,
      password: data.password,
      logoUrl: data.logoUrl,
      vendorTag: data.vendorTag || "Prime",
      rating: data.rating || "4.8",
      prepTime: data.prepTime || "15-20 min",
      deliveryFee: Number(data.deliveryFee) || 200,
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Vendor creation failed:", error);
    return { success: false, error: "Failed to create vendor." };
  }
}

export async function createProduct(data: any) {
  try {
    await db.insert(products).values({
      vendorId: data.vendorId,
      name: data.name,
      price: Number(data.price),
      category: data.category || "Meals",
      description: data.description,
      imageUrl: data.imageUrl,
      isAvailable: true,
    });
    revalidatePath(`/vendor/dashboard/${data.vendorId}`);
    return { success: true };
  } catch (error) {
    console.error("Product creation failed:", error);
    return { success: false, error: "Failed to create product." };
  }
}
