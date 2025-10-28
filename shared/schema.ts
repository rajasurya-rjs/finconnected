import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
  integer,
  date,
} from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - Required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Transaction categories
export const transactionCategories = [
  'salary',
  'freelance',
  'investment',
  'other-income',
  'food',
  'transportation',
  'housing',
  'utilities',
  'entertainment',
  'shopping',
  'healthcare',
  'education',
  'savings',
  'other-expense'
] as const;

export type TransactionCategory = typeof transactionCategories[number];

// Transactions table
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar("type", { length: 10 }).notNull(), // 'income' or 'expense'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  description: text("description"),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// Budget categories table
export const budgets = pgTable("budgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  category: varchar("category", { length: 50 }).notNull(),
  monthlyLimit: decimal("monthly_limit", { precision: 10, scale: 2 }).notNull(),
  month: varchar("month", { length: 7 }).notNull(), // Format: YYYY-MM
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const budgetsRelations = relations(budgets, ({ one }) => ({
  user: one(users, {
    fields: [budgets.userId],
    references: [users.id],
  }),
}));

export const insertBudgetSchema = createInsertSchema(budgets).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type Budget = typeof budgets.$inferSelect;

// Savings goals table
export const savingsGoals = pgTable("savings_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar("title", { length: 255 }).notNull(),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  targetDate: date("target_date"),
  icon: varchar("icon", { length: 50 }).default('piggy-bank'), // Icon name for display
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const savingsGoalsRelations = relations(savingsGoals, ({ one }) => ({
  user: one(users, {
    fields: [savingsGoals.userId],
    references: [users.id],
  }),
}));

export const insertSavingsGoalSchema = createInsertSchema(savingsGoals).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSavingsGoal = z.infer<typeof insertSavingsGoalSchema>;
export type SavingsGoal = typeof savingsGoals.$inferSelect;

// Financial tips table
export const financialTips = pgTable("financial_tips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // 'budgeting', 'saving', 'investing', 'debt'
  difficulty: varchar("difficulty", { length: 20 }).notNull(), // 'beginner', 'intermediate', 'advanced'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFinancialTipSchema = createInsertSchema(financialTips).omit({
  id: true,
  createdAt: true,
});

export type InsertFinancialTip = z.infer<typeof insertFinancialTipSchema>;
export type FinancialTip = typeof financialTips.$inferSelect;
