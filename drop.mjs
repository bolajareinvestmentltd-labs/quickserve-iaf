import { neon } from '@neondatabase/serverless';
import fs from 'fs';

// Read the database URL directly from your .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
let dbUrl = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('DATABASE_URL=')) {
    dbUrl = line.substring(line.indexOf('=') + 1).replace(/['"]/g, '').trim();
    break;
  }
}

const sql = neon(dbUrl);

async function wipeDatabase() {
  console.log("🧨 Dropping old tables to fix UUID conflicts...");
  // CASCADE ensures it wipes out all relationships simultaneously
  await sql`DROP TABLE IF EXISTS order_items, orders, products, vendors, rides CASCADE;`;
  await sql`DROP TYPE IF EXISTS order_status, payment_status CASCADE;`;
  console.log("✅ Database wiped clean! You are ready to push.");
}

wipeDatabase().catch(console.error);
