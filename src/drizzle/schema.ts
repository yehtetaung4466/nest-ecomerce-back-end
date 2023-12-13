import { relations } from 'drizzle-orm';
import {
  date,
  integer,
  pgTable,
  real,
  serial,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  password: varchar('password', { length: 256 }).notNull(),
  createdAt: date('createAt').defaultNow().notNull(),
  updatedAt: date('updatedAt').defaultNow().notNull(),
});

export const tokens = pgTable('token', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: serial('user_id')
    .references(() => users.id)
    .unique(),
  refresh_token: text('refresh_token'),
  expiresAt: date('expiresAt'),
  createdAt: date('createAt').defaultNow().notNull(),
  updatedAt: date('updatedAt').defaultNow().notNull(),
});

export const products = pgTable('product', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull().unique(),
  price: integer('price').notNull(),
  image: text('image').notNull(),
  rating: real('rating').notNull().default(0.0),
});

export const userRelation = relations(users, ({ many }) => ({
  token: many(tokens),
}));

export const tokenRelation = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.user_id],
    references: [users.id],
  }),
}));
