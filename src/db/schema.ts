import { pgTable, text, varchar, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";

// 1. STOREFRONTS
export const vendors = pgTable("vendors", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  logoUrl: text("logo_url"),
  vendorTag: varchar("vendor_tag", { length: 50 }).default("Prime"),
  rating: varchar("rating", { length: 10 }).default("4.8"),
  prepTime: varchar("prep_time", { length: 50 }).default("15-20 min"),
  deliveryFee: integer("delivery_fee").default(200),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. MENUS
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  vendorId: text("vendor_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  price: integer("price").notNull(),
  category: varchar("category", { length: 100 }).default("Meals"),
  description: text("description"),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// 3. FLEET MANAGEMENT
export const runners = pgTable("runners", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// 4. THE PARENT ORDER (Customer Facing)
export const orders = pgTable("orders", {
  id: varchar("id", { length: 255 }).primaryKey(), // Paystack Reference
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  customerZone: varchar("customer_zone", { length: 255 }),
  totalAmount: integer("total_amount").notNull(),
  deliveryFee: integer("delivery_fee").default(300), // Runner Cut
  customerServiceFee: integer("customer_service_fee").default(50), // Admin Cut
  runnerId: text("runner_id"),
  deliveryCode: varchar("delivery_code", { length: 10 }),
  status: varchar("status", { length: 50 }).default("pending"),
  items: text("items"), // Legacy raw cart backup
  createdAt: timestamp("created_at").defaultNow(),
});

// 5. THE CHILD TICKETS (Vendor Facing)
export const vendorTickets = pgTable("vendor_tickets", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: varchar("order_id", { length: 255 }).notNull(),
  vendorId: text("vendor_id").notNull(),
  items: text("items").notNull(), // Exact JSON string of items for this kitchen
  subtotal: integer("subtotal").notNull(),
  vendorFee: integer("vendor_fee").default(50), // Admin Cut
  payoutAmount: integer("payout_amount").notNull(), // True Vendor Wallet Value
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 6. CUSTOMER FEEDBACK
export const ratings = pgTable("ratings", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: varchar("order_id", { length: 255 }).notNull(),
  vendorId: text("vendor_id"),
  runnerId: text("runner_id"),
  rating: integer("rating").notNull(),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
});
