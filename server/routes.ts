import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertTransactionSchema,
  insertBudgetSchema,
  insertSavingsGoalSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData, userId);
      res.status(201).json(transaction);
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      if (error.name === 'ZodError') {
        res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create transaction" });
      }
    }
  });

  app.patch("/api/transactions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const validatedData = insertTransactionSchema.partial().parse(req.body);
      const transaction = await storage.updateTransaction(id, validatedData, userId);
      if (!transaction) {
        res.status(404).json({ message: "Transaction not found" });
        return;
      }
      res.json(transaction);
    } catch (error: any) {
      console.error("Error updating transaction:", error);
      if (error.name === 'ZodError') {
        res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update transaction" });
      }
    }
  });

  app.delete("/api/transactions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const deleted = await storage.deleteTransaction(id, userId);
      if (!deleted) {
        res.status(404).json({ message: "Transaction not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ message: "Failed to delete transaction" });
    }
  });

  // Budget routes
  app.get("/api/budgets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const month = req.query.month as string || new Date().toISOString().slice(0, 7);
      const budgets = await storage.getBudgets(userId, month);
      res.json(budgets);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      res.status(500).json({ message: "Failed to fetch budgets" });
    }
  });

  app.post("/api/budgets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertBudgetSchema.parse(req.body);
      const budget = await storage.createBudget(validatedData, userId);
      res.status(201).json(budget);
    } catch (error: any) {
      console.error("Error creating budget:", error);
      if (error.name === 'ZodError') {
        res.status(400).json({ message: "Invalid budget data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create budget" });
      }
    }
  });

  app.patch("/api/budgets/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const validatedData = insertBudgetSchema.partial().parse(req.body);
      const budget = await storage.updateBudget(id, validatedData, userId);
      if (!budget) {
        res.status(404).json({ message: "Budget not found" });
        return;
      }
      res.json(budget);
    } catch (error: any) {
      console.error("Error updating budget:", error);
      if (error.name === 'ZodError') {
        res.status(400).json({ message: "Invalid budget data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update budget" });
      }
    }
  });

  app.delete("/api/budgets/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const deleted = await storage.deleteBudget(id, userId);
      if (!deleted) {
        res.status(404).json({ message: "Budget not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting budget:", error);
      res.status(500).json({ message: "Failed to delete budget" });
    }
  });

  // Savings goal routes
  app.get("/api/savings-goals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goals = await storage.getSavingsGoals(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching savings goals:", error);
      res.status(500).json({ message: "Failed to fetch savings goals" });
    }
  });

  app.post("/api/savings-goals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertSavingsGoalSchema.parse(req.body);
      const goal = await storage.createSavingsGoal(validatedData, userId);
      res.status(201).json(goal);
    } catch (error: any) {
      console.error("Error creating savings goal:", error);
      if (error.name === 'ZodError') {
        res.status(400).json({ message: "Invalid savings goal data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create savings goal" });
      }
    }
  });

  app.patch("/api/savings-goals/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const validatedData = insertSavingsGoalSchema.partial().parse(req.body);
      const goal = await storage.updateSavingsGoal(id, validatedData, userId);
      if (!goal) {
        res.status(404).json({ message: "Savings goal not found" });
        return;
      }
      res.json(goal);
    } catch (error: any) {
      console.error("Error updating savings goal:", error);
      if (error.name === 'ZodError') {
        res.status(400).json({ message: "Invalid savings goal data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update savings goal" });
      }
    }
  });

  app.delete("/api/savings-goals/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const deleted = await storage.deleteSavingsGoal(id, userId);
      if (!deleted) {
        res.status(404).json({ message: "Savings goal not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting savings goal:", error);
      res.status(500).json({ message: "Failed to delete savings goal" });
    }
  });

  // Financial tips routes
  app.get("/api/financial-tips", async (req, res) => {
    try {
      const tips = await storage.getFinancialTips();
      res.json(tips);
    } catch (error) {
      console.error("Error fetching financial tips:", error);
      res.status(500).json({ message: "Failed to fetch financial tips" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
