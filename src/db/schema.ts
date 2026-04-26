import { pgTable, text, varchar, integer, boolean, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const orderStatusEnum = pgEnum("order_status", ["pending", "paid", "accepted", "preparing", "out_for_delivery", "delivered", "cancelled"]);
export const kycStatusEnum = pgEnum("kyc_status", ["unverified", "pending", "verified", "rejected"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: text("full_name"),
  email: text("email").unique().notNull(),
  phone: varchar("phone", { length: 20 }),
  isVerified: boolean("is_verified").default(false),
  walletBalance: integer("wallet_balance").default(0).notNull(),
  cashbackBalance: integer("cashback_balance").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vendors = pgTable("vendors", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessName: text("business_name").notNull(),
  stallNumber: varchar("stall_number", { length: 10 }),
  contactPerson: text("contact_person").notNull(),
  email: text("email").unique().notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  pin: varchar("pin", { length: 4 }).default("0000"),
  kycStatus: kycStatusEnum("kyc_status").default("unverified"),
  governmentIdUrl: text("gov_id_url"),
  bankName: text("bank_name"),
  accountNumber: varchar("account_number", { length: 10 }),
  isSlotActive: boolean("is_slot_active").default(false).notNull(),
  walletBalance: integer("wallet_balance").default(0).notNull(),
  lastSeen: timestamp("last_seen").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  vendorId: uuid("vendor_id").references(() => vendors.id).notNull(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  category: varchar("category", { length: 50 }).default("meals"),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const runners = pgTable("runners", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  pin: varchar("pin", { length: 4 }).default("0000"),
  vehicleType: varchar("vehicle_type", { length: 20 }),
  kycStatus: kycStatusEnum("kyc_status").default("unverified"),
  licenseUrl: text("license_url"), 
  ninNumber: varchar("nin_number", { length: 11 }),
  walletBalance: integer("wallet_balance").default(0).notNull(),
  totalDeliveries: integer("total_deliveries").default(0).notNull(),
  isOnline: boolean("is_online").default(false).notNull(),
  lastSeen: timestamp("last_seen").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
  userId: uuid("user_id").references(() => users.id),
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

export const settings = pgTable("settings", {
  id: integer("id").primaryKey().default(1),
  isWithdrawalEnabled: boolean("is_withdrawal_enabled").default(false).notNull(),
  eventDate: timestamp("event_date").defaultNow(),
});

// RELATIONS
export const userRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const vendorRelations = relations(vendors, ({ many }) => ({
  products: many(products),
  orderItems: many(orderItems),
}));

export const productRelations = relations(products, ({ one }) => ({
  vendor: one(vendors, { fields: [products.vendorId], references: [vendors.id] }),
}));

export const orderRelations = relations(orders, ({ many, one }) => ({
  items: many(orderItems),
  runner: one(runners, { fields: [orders.runnerId], references: [runners.id] }),
  user: one(users, { fields: [orders.userId], references: [users.id] }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  vendor: one(vendors, { fields: [orderItems.vendorId], references: [vendors.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));
