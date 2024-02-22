import { relations } from 'drizzle-orm';
import {
  date,
  integer,
  pgTable,
  real,
  serial,
  text,
  unique,
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
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  description: text('description').notNull(),
  name: varchar('name', { length: 256 }).notNull().unique(),
  price: integer('price').notNull(),
  stock: integer('stock').notNull(),
  image: text('image').notNull(),
  rating: real('rating').notNull().default(0.0),
  category_id: serial('category_id')
    .notNull()
    .references(() => categories.id),
});
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customer_id: serial('customer_id')
    .notNull()
    .references(() => users.id),
  item_id: serial('item_id')
    .notNull()
    .references(() => products.id),
  quantity: integer('quantity').notNull(),
  group_id: uuid('group_id')
    .notNull()
    .references(() => orderComments.group_id),
  createdAt: date('createAt').defaultNow().notNull(),
  updatedAt: date('updatedAt').defaultNow().notNull(),
});
export const ratings = pgTable(
  'ratings',
  {
    id: serial('id').primaryKey(),
    customer_id: serial('customer_id')
      .notNull()
      .references(() => users.id),
    item_id: serial('item_id')
      .notNull()
      .references(() => products.id),
    rating: real('rating').notNull(),
    opinion: text('opinion'),
    createdAt: date('createAt').defaultNow().notNull(),
    updatedAt: date('updatedAt').defaultNow().notNull(),
  },
  (t) => ({
    customerUniqueProduct: unique('customerUniqueProduct').on(
      t.customer_id,
      t.item_id,
    ),
  }),
);
export const orderComments = pgTable('order_comments', {
  id: serial('id').primaryKey(),
  comment: text('comment').notNull(),
  createdAt: date('createAt').defaultNow().notNull(),
  updatedAt: date('updatedAt').defaultNow().notNull(),
  group_id: uuid('group_id').notNull().unique(),
});
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull().unique(),
});
export const userRelation = relations(users, ({ many }) => ({
  order: many(orders),
  rating: many(ratings),
}));

// export const tokenRelation = relations(tokens, ({ one }) => ({
//   user: one(users, {
//     fields: [tokens.user_id],
//     references: [users.id],
//   }),
// }));
export const productRelation = relations(products, ({ many, one }) => ({
  order: many(orders),
  rating: many(ratings),
  category: one(categories, {
    fields: [products.category_id],
    references: [categories.id],
  }),
}));

export const orderRelation = relations(orders, ({ one }) => ({
  customer: one(users, {
    fields: [orders.customer_id],
    references: [users.id],
  }),
  item: one(products, {
    fields: [orders.item_id],
    references: [products.id],
  }),
  order_comment: one(orderComments, {
    fields: [orders.group_id],
    references: [orderComments.group_id],
  }),
}));
export const orderCommentRelation = relations(orderComments, ({ many }) => ({
  orders: many(orders),
}));

export const ratingRelation = relations(ratings, ({ one }) => ({
  customer: one(users, {
    fields: [ratings.customer_id],
    references: [users.id],
  }),
  item: one(products, {
    fields: [ratings.customer_id],
    references: [products.id],
  }),
}));
export const categoryRelation = relations(categories, ({ many }) => ({
  products: many(products),
}));
