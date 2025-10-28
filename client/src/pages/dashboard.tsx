import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from "lucide-react";
import { formatCurrency, formatDate, formatPercentage } from "@/lib/formatters";
import { categoryConfig } from "@/lib/categoryConfig";
import type { Transaction, SavingsGoal } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: savingsGoals, isLoading: goalsLoading } = useQuery<SavingsGoal[]>({
    queryKey: ["/api/savings-goals"],
  });

  // Calculate summary statistics
  const currentMonth = new Date().toISOString().slice(0, 7);
  const thisMonthTransactions = transactions?.filter(t => 
    t.date.startsWith(currentMonth)
  ) || [];

  const totalIncome = thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;

  // Calculate total savings across all goals
  const totalSavings = savingsGoals?.reduce(
    (sum, goal) => sum + parseFloat(goal.currentAmount),
    0
  ) || 0;

  // Get spending by category for pie chart
  const spendingByCategory = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const category = t.category;
      acc[category] = (acc[category] || 0) + parseFloat(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const categoryData = Object.entries(spendingByCategory).map(([category, amount]) => ({
    name: categoryConfig[category as keyof typeof categoryConfig]?.label || category,
    value: amount,
    color: categoryConfig[category as keyof typeof categoryConfig]?.color || 'hsl(var(--chart-1))',
  }));

  // Get spending trends for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const trendData = last7Days.map(date => {
    const dayTransactions = transactions?.filter(t => t.date === date) || [];
    const income = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expense = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      income,
      expense,
      net: income - expense,
    };
  });

  const isLoading = transactionsLoading || goalsLoading;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold" data-testid="text-page-title">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's your financial overview.
          </p>
        </div>
        <Button asChild data-testid="button-add-transaction">
          <Link href="/transactions">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-card-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month Income
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-bold tabular-nums" data-testid="text-total-income">
                  {formatCurrency(totalIncome)}
                </div>
                <p className="text-xs text-muted-foreground">
                  From {thisMonthTransactions.filter(t => t.type === 'income').length} transactions
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-card-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month Spending
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-bold tabular-nums" data-testid="text-total-expenses">
                  {formatCurrency(totalExpenses)}
                </div>
                <p className="text-xs text-muted-foreground">
                  From {thisMonthTransactions.filter(t => t.type === 'expense').length} transactions
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-card-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Savings Rate
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-bold tabular-nums" data-testid="text-savings-rate">
                  {formatPercentage(savingsRate)}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {netIncome >= 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3 text-chart-2 mr-1" />
                      <span className="text-chart-2">{formatCurrency(netIncome)} saved</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3 text-destructive mr-1" />
                      <span className="text-destructive">{formatCurrency(Math.abs(netIncome))} deficit</span>
                    </>
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-card-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Savings
            </CardTitle>
            <Target className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-bold tabular-nums" data-testid="text-total-savings">
                  {formatCurrency(totalSavings)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across {savingsGoals?.length || 0} goals
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Spending Trends */}
        <Card className="border-card-border">
          <CardHeader>
            <CardTitle>Spending Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stackId="1"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.6}
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stackId="2"
                    stroke="hsl(var(--destructive))"
                    fill="hsl(var(--destructive))"
                    fillOpacity={0.6}
                    name="Expenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="border-card-border">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : categoryData.length === 0 ? (
              <div className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">No expenses this month</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-card-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Button variant="ghost" size="sm" asChild data-testid="button-view-all-transactions">
            <Link href="/transactions">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => {
                const config = categoryConfig[transaction.category as keyof typeof categoryConfig];
                const Icon = config?.icon;
                
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                    data-testid={`transaction-item-${transaction.id}`}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && (
                        <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center border border-card-border">
                          <Icon className="h-5 w-5" style={{ color: config.color }} />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{config?.label || transaction.category}</p>
                        {transaction.description && (
                          <p className="text-sm text-muted-foreground">
                            {transaction.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-lg font-bold tabular-nums ${
                        transaction.type === 'income' ? 'text-chart-2' : 'text-foreground'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(parseFloat(transaction.amount))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No transactions yet</p>
              <Button asChild>
                <Link href="/transactions">Add Your First Transaction</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Savings Goals Preview */}
      {savingsGoals && savingsGoals.length > 0 && (
        <Card className="border-card-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Savings Goals</CardTitle>
            <Button variant="ghost" size="sm" asChild data-testid="button-view-all-goals">
              <Link href="/savings">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savingsGoals.slice(0, 3).map((goal) => {
                const progress = (parseFloat(goal.currentAmount) / parseFloat(goal.targetAmount)) * 100;
                
                return (
                  <Card key={goal.id} className="border-card-border">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold">{goal.title}</h3>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{formatPercentage(progress)}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium tabular-nums">
                              {formatCurrency(parseFloat(goal.currentAmount))}
                            </span>
                            <span className="text-muted-foreground tabular-nums">
                              {formatCurrency(parseFloat(goal.targetAmount))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
