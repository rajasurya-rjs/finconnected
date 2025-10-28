import {
  users,
  transactions,
  budgets,
  savingsGoals,
  financialTips,
  type User,
  type UpsertUser,
  type Transaction,
  type InsertTransaction,
  type Budget,
  type InsertBudget,
  type SavingsGoal,
  type InsertSavingsGoal,
  type FinancialTip,
  type InsertFinancialTip,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations - Required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Transaction operations
  getTransactions(userId: string): Promise<Transaction[]>;
  getTransaction(id: string, userId: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction, userId: string): Promise<Transaction>;
  updateTransaction(id: string, transaction: Partial<InsertTransaction>, userId: string): Promise<Transaction | undefined>;
  deleteTransaction(id: string, userId: string): Promise<boolean>;

  // Budget operations
  getBudgets(userId: string, month: string): Promise<Budget[]>;
  getBudget(id: string, userId: string): Promise<Budget | undefined>;
  createBudget(budget: InsertBudget, userId: string): Promise<Budget>;
  updateBudget(id: string, budget: Partial<InsertBudget>, userId: string): Promise<Budget | undefined>;
  deleteBudget(id: string, userId: string): Promise<boolean>;

  // Savings goal operations
  getSavingsGoals(userId: string): Promise<SavingsGoal[]>;
  getSavingsGoal(id: string, userId: string): Promise<SavingsGoal | undefined>;
  createSavingsGoal(goal: InsertSavingsGoal, userId: string): Promise<SavingsGoal>;
  updateSavingsGoal(id: string, goal: Partial<InsertSavingsGoal>, userId: string): Promise<SavingsGoal | undefined>;
  deleteSavingsGoal(id: string, userId: string): Promise<boolean>;

  // Financial tips operations
  getFinancialTips(): Promise<FinancialTip[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations - Required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Transaction operations
  async getTransactions(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date), desc(transactions.createdAt));
  }

  async getTransaction(id: string, userId: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
    return transaction;
  }

  async createTransaction(transactionData: InsertTransaction, userId: string): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values({
        ...transactionData,
        userId,
      })
      .returning();
    return transaction;
  }

  async updateTransaction(id: string, transactionData: Partial<InsertTransaction>, userId: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .update(transactions)
      .set(transactionData)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .returning();
    return transaction;
  }

  async deleteTransaction(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Budget operations
  async getBudgets(userId: string, month: string): Promise<Budget[]> {
    return await db
      .select()
      .from(budgets)
      .where(and(eq(budgets.userId, userId), eq(budgets.month, month)));
  }

  async getBudget(id: string, userId: string): Promise<Budget | undefined> {
    const [budget] = await db
      .select()
      .from(budgets)
      .where(and(eq(budgets.id, id), eq(budgets.userId, userId)));
    return budget;
  }

  async createBudget(budgetData: InsertBudget, userId: string): Promise<Budget> {
    const [budget] = await db
      .insert(budgets)
      .values({
        ...budgetData,
        userId,
      })
      .returning();
    return budget;
  }

  async updateBudget(id: string, budgetData: Partial<InsertBudget>, userId: string): Promise<Budget | undefined> {
    const [budget] = await db
      .update(budgets)
      .set({
        ...budgetData,
        updatedAt: new Date(),
      })
      .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
      .returning();
    return budget;
  }

  async deleteBudget(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(budgets)
      .where(and(eq(budgets.id, id), eq(budgets.userId, userId)));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Savings goal operations
  async getSavingsGoals(userId: string): Promise<SavingsGoal[]> {
    return await db
      .select()
      .from(savingsGoals)
      .where(eq(savingsGoals.userId, userId))
      .orderBy(desc(savingsGoals.createdAt));
  }

  async getSavingsGoal(id: string, userId: string): Promise<SavingsGoal | undefined> {
    const [goal] = await db
      .select()
      .from(savingsGoals)
      .where(and(eq(savingsGoals.id, id), eq(savingsGoals.userId, userId)));
    return goal;
  }

  async createSavingsGoal(goalData: InsertSavingsGoal, userId: string): Promise<SavingsGoal> {
    const [goal] = await db
      .insert(savingsGoals)
      .values({
        ...goalData,
        userId,
      })
      .returning();
    return goal;
  }

  async updateSavingsGoal(id: string, goalData: Partial<InsertSavingsGoal>, userId: string): Promise<SavingsGoal | undefined> {
    const [goal] = await db
      .update(savingsGoals)
      .set({
        ...goalData,
        updatedAt: new Date(),
      })
      .where(and(eq(savingsGoals.id, id), eq(savingsGoals.userId, userId)))
      .returning();
    return goal;
  }

  async deleteSavingsGoal(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(savingsGoals)
      .where(and(eq(savingsGoals.id, id), eq(savingsGoals.userId, userId)));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Financial tips operations
  async getFinancialTips(): Promise<FinancialTip[]> {
    return await db
      .select()
      .from(financialTips)
      .orderBy(desc(financialTips.createdAt));
  }
}

export const storage = new DatabaseStorage();
