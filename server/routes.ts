import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { authenticateJWT, signJwt, loginOrCreateUserByEmail } from "./jwtAuth.js";
import {
  insertTransactionSchema,
  insertBudgetSchema,
  insertSavingsGoalSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // JWT auth routes
  // POST /api/auth/login
  // Body: { email, firstName?, lastName?, profileImageUrl? }
  app.post('/api/auth/login', async (req: any, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        res.status(401).json({ message: 'Account not found. Please sign up first.' });
        return;
      }

      const token = signJwt({ userId: user.id });

      // Set httpOnly cookie for secure, cookie-based auth fallback
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        // For cross-site cookies (frontend on a different domain), use 'none' in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
      };
      res.cookie('token', token, cookieOptions);

      res.json({ token, user });
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ message: 'Failed to login' });
    }
  });

  // POST /api/auth/signup - explicit signup route
  app.post('/api/auth/signup', async (req: any, res) => {
    try {
      const { email, firstName, lastName, profileImageUrl } = req.body;
      if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
      }

      // upsertUser will create or update. This keeps signup simple for this example.
      const user = await storage.upsertUser({ email, firstName, lastName, profileImageUrl });
      const token = signJwt({ userId: user.id });

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
      };
      res.cookie('token', token, cookieOptions);

      res.status(201).json({ token, user });
    } catch (error) {
      console.error('Error in signup:', error);
      res.status(500).json({ message: 'Failed to signup' });
    }
  });

  // GET /api/auth/me
  app.get('/api/auth/me', authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });

  // PATCH /api/auth/me - update current user profile
  app.patch('/api/auth/me', authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { firstName, lastName, profileImageUrl } = req.body;
      const updated = await storage.upsertUser({ id: userId, firstName, lastName, profileImageUrl });
      res.json(updated);
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  });

  // Redirect to client SPA login route so styles and layout apply
  app.get('/api/login', (_req, res) => {
    res.redirect('/login');
  });

  app.get('/api/logout', (req, res) => {
    // Clear cookie and instruct client to clear token from localStorage
    res.clearCookie('token', { path: '/' });
    const html = `<!doctype html><html><body><script>localStorage.removeItem('token');window.location='/'</script></body></html>`;
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });

  // Transaction routes
  app.get("/api/transactions", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const transactions = await storage.getTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
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

  app.patch("/api/transactions/:id", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
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

  app.delete("/api/transactions/:id", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
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
  app.get("/api/budgets", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const month = req.query.month as string || new Date().toISOString().slice(0, 7);
      const budgets = await storage.getBudgets(userId, month);
      res.json(budgets);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      res.status(500).json({ message: "Failed to fetch budgets" });
    }
  });

  app.post("/api/budgets", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
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

  app.patch("/api/budgets/:id", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
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

  app.delete("/api/budgets/:id", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
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
  app.get("/api/savings-goals", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const goals = await storage.getSavingsGoals(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching savings goals:", error);
      res.status(500).json({ message: "Failed to fetch savings goals" });
    }
  });

  app.post("/api/savings-goals", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
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

  app.patch("/api/savings-goals/:id", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
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

  app.delete("/api/savings-goals/:id", authenticateJWT, async (req: any, res) => {
    try {
      const userId = req.user.id;
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
