import { 
  pgTable, 
  text, 
  varchar, 
  integer, 
  boolean, 
  timestamp, 
  uuid, 
  pgEnum 
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const orderStatusEnum = pgEnum("order_status", ["pending", "completed", "cancelled"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "successful", "failed"]);

export const vendors = pgTable("vendors", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessName: text("business_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").unique().notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default("pending").notNull(),
  isSlotActive: boolean("is_slot_active").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true).notNull(),
  // 🚀 THE NEW PROMO BADGE FIELD
  promoBadge: varchar("promo_badge", { length: 50 }), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  customerZone: text("customer_zone").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: orderStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const rides = pgTable("rides", {
  id: uuid("id").defaultRandom().primaryKey(),
  driverName: text("driver_name").notNull(),
  whatsappNumber: varchar("whatsapp_number", { length: 20 }).notNull(),
  carModel: text("car_model").notNull(),
  totalSeats: integer("total_seats").notNull(),
  availableSeats: integer("available_seats").notNull(),
  isFull: boolean("is_full").default(false).notNull(),
  departureTime: timestamp("departure_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vendorsRelations = relations(vendors, ({ many }) => ({
  products: many(products),
  orderItems: many(orderItems),
}));

export const productsRelations = relations(products, ({ one }) => ({
  vendor: one(vendors, { fields: [products.vendorId], references: [vendors.id] }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
  vendor: one(vendors, { fields: [orderItems.vendorId], references: [vendors.id] }),
}));
