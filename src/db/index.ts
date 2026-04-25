import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// This ensures Next.js connects cleanly to Neon without WebSocket timeouts
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
