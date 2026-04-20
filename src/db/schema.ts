import { pgTable, serial, text, integer, decimal, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const categoryEnum = pgEnum('category', ['food', 'drink', 'eatable']);
export const orderStatusEnum = pgEnum('status', ['pending', 'cooking', 'delivering', 'completed']);

export const vendors = pgTable('vendors', {
  id: serial('id').primaryKey(),
  businessName: text('business_name').notNull(),
  boothLocation: text('booth_location').notNull(),
  phone: text('phone').notNull(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  vendorId: integer('vendor_id').references(() => vendors.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: categoryEnum('category').notNull(),
  imageUrl: text('image_url'),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  deliveryZone: text('delivery_zone').notNull(),
  ticketId: text('ticket_id'), // NEW: Optional Ticket ID
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
});
