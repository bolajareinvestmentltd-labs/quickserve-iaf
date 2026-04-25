import { pgTable, text, varchar, integer, boolean, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const orderStatusEnum = pgEnum("order_status", ["pending", "paid", "accepted", "preparing", "out_for_delivery", "delivered", "cancelled"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "successful", "failed"]);

export const vendors = pgTable("vendors", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessName: text("business_name").notNull(),
  stallNumber: varchar("stall_number", { length: 10 }), // Added Stall Number
  contactPerson: text("contact_person").notNull(),
  email: text("email").unique().notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  isSlotActive: boolean("is_slot_active").default(false).notNull(),
  walletBalance: integer("wallet_balance").default(0).notNull(),
  lastSeen: timestamp("last_seen").defaultNow(), // For Online Status
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const runners = pgTable("runners", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  walletBalance: integer("wallet_balance").default(0).notNull(),
  totalDeliveries: integer("total_deliveries").default(0).notNull(),
  lastSeen: timestamp("last_seen").defaultNow(), // For Online Status
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  customerZone: text("customer_zone").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: orderStatusEnum("status").default("pending").notNull(),
  deliveryCode: varchar("delivery_code", { length: 10 }),
  runnerId: uuid("runner_id").references(() => runners.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const vendorsRelations = relations(vendors, ({ many }) => ({ products: many(products), orderItems: many(orderItems) }));
export const runnersRelations = relations(runners, ({ many }) => ({ orders: many(orders) }));
export const ordersRelations = relations(orders, ({ one, many }) => ({ items: many(orderItems), runner: one(runners, { fields: [orders.runnerId], references: [runners.id] }) }));
export const orderItemsRelations = relations(orderItems, ({ one }) => ({ order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }), product: one(products, { fields: [orderItems.productId], references: [products.id] }), vendor: one(vendors, { fields: [orderItems.vendorId], references: [vendors.id] }) }));
