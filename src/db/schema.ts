import { pgTable, text, varchar, integer, boolean, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const orderStatusEnum = pgEnum("order_status", ["pending", "paid", "accepted", "preparing", "out_for_delivery", "delivered", "cancelled"]);
export const inventoryStatusEnum = pgEnum("inventory_status", ["available", "out_of_stock", "sold_out"]);

export const vendors = pgTable("vendors", {
  id: uuid("id").defaultRandom().primaryKey(),
  vendorDisplayId: varchar("vendor_display_id", { length: 20 }).unique(),
  businessName: text("business_name").notNull(),
  cuisineType: text("cuisine_type"), 
  logoUrl: text("logo_url"),
  email: text("email").unique().notNull(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  isSlotActive: boolean("is_slot_active").default(false).notNull(),
  walletBalance: integer("wallet_balance").default(0).notNull(),
  totalDeliveries: integer("total_deliveries").default(0).notNull(),
  lastSeen: timestamp("last_seen").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  vendorId: uuid("vendor_id").references(() => vendors.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  category: varchar("category", { length: 50 }).default("meals"),
  promoBadge: varchar("promo_badge", { length: 50 }),
  unit: varchar("unit", { length: 20 }).default("piece"),
  imageUrl: text("image_url"),
  inventoryStatus: inventoryStatusEnum("inventory_status").default("available"),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ... Keep existing runners, orders, orderItems tables
export const runners = pgTable("runners", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  pin: varchar("pin", { length: 4 }).default("6675"),
  isOnline: boolean("is_online").default(false).notNull(),
  walletBalance: integer("wallet_balance").default(0).notNull(),
  totalDeliveries: integer("total_deliveries").default(0).notNull(),
  lastSeen: timestamp("last_seen").defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  customerZone: text("customer_zone").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: orderStatusEnum("status").default("pending"),
  deliveryCode: varchar("delivery_code", { length: 10 }),
  isSettled: boolean("is_settled").default(false),
  runnerId: uuid("runner_id").references(() => runners.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  vendorId: uuid("vendor_id").references(() => vendors.id).notNull(),
  quantity: integer("quantity").notNull(),
});

export const vendorRelations = relations(vendors, ({ many }) => ({
  products: many(products),
}));

export const productRelations = relations(products, ({ one }) => ({
  vendor: one(vendors, { fields: [products.vendorId], references: [vendors.id] }),
}));

export const orderRelations = relations(orders, ({ many, one }) => ({
  items: many(orderItems),
  runner: one(runners, { fields: [orders.runnerId], references: [runners.id] })
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
  vendor: one(vendors, { fields: [orderItems.vendorId], references: [vendors.id] })
}));
