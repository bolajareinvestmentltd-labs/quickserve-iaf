import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
  console.log('⏳ Seeding database...');

  try {
    // Clear existing data to prevent duplicates during testing
    await db.delete(schema.orderItems);
    await db.delete(schema.orders);
    await db.delete(schema.products);
    await db.delete(schema.vendors);

    // Insert Dummy Vendors
    const insertedVendors = await db.insert(schema.vendors).values([
      { businessName: 'Iya Basira', boothLocation: 'Food Zone A', phone: '08012345678' },
      { businessName: 'Grill House', boothLocation: 'Food Zone B', phone: '08087654321' },
      { businessName: 'Drinks Hub', boothLocation: 'Bar Section', phone: '08011223344' },
      { businessName: 'Crunchy Bites', boothLocation: 'Snack Tent', phone: '08099887766' },
    ]).returning();

    console.log(`✅ Created ${insertedVendors.length} vendors`);

    // Insert Dummy Products tied to those vendors
    const insertedProducts = await db.insert(schema.products).values([
      { vendorId: insertedVendors[0].id, name: 'Spicy Party Jollof', price: '2500.00', category: 'food', imageUrl: '🍛' },
      { vendorId: insertedVendors[0].id, name: 'Amala & Ewedu', price: '3000.00', category: 'food', imageUrl: '🍲' },
      { vendorId: insertedVendors[1].id, name: 'Grilled Chicken & Chips', price: '4000.00', category: 'food', imageUrl: '🍗' },
      { vendorId: insertedVendors[1].id, name: 'Beef Suya Portion', price: '2000.00', category: 'food', imageUrl: '🥩' },
      { vendorId: insertedVendors[2].id, name: 'Chilled Coca-Cola', price: '500.00', category: 'drink', imageUrl: '🥤' },
      { vendorId: insertedVendors[2].id, name: 'Bottled Water', price: '300.00', category: 'drink', imageUrl: '💧' },
      { vendorId: insertedVendors[2].id, name: 'Energy Drink', price: '1200.00', category: 'drink', imageUrl: '⚡' },
      { vendorId: insertedVendors[3].id, name: 'Meat Pie', price: '1000.00', category: 'eatable', imageUrl: '🥧' },
      { vendorId: insertedVendors[3].id, name: 'Sausage Roll', price: '800.00', category: 'eatable', imageUrl: '🥐' },
    ]).returning();

    console.log(`✅ Created ${insertedProducts.length} products`);
    console.log('🎉 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

main();
