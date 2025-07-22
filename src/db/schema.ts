// import { relations } from "drizzle-orm";
import { integer, text, pgTable, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  firstname: text("first_name").notNull(),
  lastname: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const todoTask = pgTable("todotask", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  completed: integer("completed").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
