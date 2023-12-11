import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';
dotenv.config();
export default {
  schema: './src/drizzle/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DB_URL,
  }
} satisfies Config;
