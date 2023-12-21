import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import { exit } from 'process';
import * as schema from '../drizzle/schema';
import * as dotenv from 'dotenv';
dotenv.config();
const connection = postgres(process.env.DB_URL);
console.log('connection complete');
const db = drizzle(connection, { schema });
const main = async () => {
  await db.execute(sql`
  CREATE OR REPLACE FUNCTION update_stock()
  RETURNS TRIGGER AS $$
  BEGIN
      IF NEW.quantity > (SELECT stock FROM products WHERE id = NEW.item_id) THEN
          RAISE EXCEPTION 'Insufficient stock';
      ELSE
          UPDATE products
          SET stock = stock - NEW.quantity
          WHERE id = NEW.item_id;
      END IF;
      RETURN NEW;
  END;
  $$
   LANGUAGE plpgsql;
  

CREATE OR REPLACE TRIGGER update_stock_trigger
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION update_stock();
`);
  await db.execute(sql`
CREATE OR REPLACE FUNCTION update_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET rating = (SELECT AVG(rating) FROM ratings WHERE item_id = NEW.item_id)
  WHERE id = NEW.item_id;
  RETURN NEW;
END;
$$
 LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_stock_trigger
AFTER INSERT OR UPDATE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_rating();
`);
  connection.end();
  console.log('prepared db successfully');
  exit();
};
main();
