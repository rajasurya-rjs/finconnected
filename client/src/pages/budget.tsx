import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, AlertTriangle, TrendingUp } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import { categoryConfig, expenseCategories } from "@/lib/categoryConfig";
import { insertBudgetSchema, type Budget, type Transaction } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

const formSchema = insertBudgetSchema.extend({
  monthlyLimit: z.string().min(1, "Budget amount is required"),
});

export default function BudgetPlanner() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const currentMonth = new Date().toISOString().slice(0, 7);

  const { data: budgets, isLoading: budgetsLoading } = useQuery<Budget[]>({
    queryKey: ["/api/budgets", currentMonth],
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      monthlyLimit: "",
      month: currentMonth,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return await apiRequest("POST", "/api/budgets", {
        ...data,
        monthlyLimit: parseFloat(data.monthlyLimit).toFixed(2),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets", currentMonth] });
      toast({
        title: "Success",
        description: "Budget created successfully",
      });
      setOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
        if (isUnauthorizedError(error)) {
          toast({
            title: "Unauthorized",
            description: "You are logged out. Logging in again...",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = "/login";
          }, 500);
          return;
        }
      toast({
        title: "Error",
        description: "Failed to create budget. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createMutation.mutate(data);
  };

  // Calculate spending for each budget category
  const thisMonthTransactions = transactions?.filter(t => 
    t.date.startsWith(currentMonth) && t.type === 'expense'
  ) || [];

  const budgetData = budgets?.map(budget => {
    const spent = thisMonthTransactions
      .filter(t => t.category === budget.category)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const limit = parseFloat(budget.monthlyLimit);
    const percentage = (spent / limit) * 100;
    const remaining = limit - spent;

    return {
      ...budget,
      spent,
      limit,
      percentage,
      remaining,
      isOverBudget: spent > limit,
      isWarning: percentage >= 80 && percentage < 100,
    };
  }) || [];

  const totalBudget = budgetData.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgetData.reduce((sum, b) => sum + b.spent, 0);
  const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const isLoading = budgetsLoading || transactionsLoading;

  const existingCategories = budgets?.map(b => b.category) || [];
  const availableCategories = expenseCategories.filter(
    cat => !existingCategories.includes(cat.value)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold" data-testid="text-page-title">
            Budget Planner
          </h1>
          <p className="text-muted-foreground mt-1">
            Set spending limits and track your progress
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={availableCategories.length === 0} data-testid="button-add-budget">
              <Plus className="h-4 w-4 mr-2" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Budget</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableCategories.map((cat) => {
                            const Icon = cat.icon;
                            return (
                              <SelectItem key={cat.value} value={cat.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  {cat.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthlyLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Budget</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-7"
                            data-testid="input-amount"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    data-testid="button-submit"
                  >
                    {createMutation.isPending ? "Creating..." : "Create Budget"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Card */}
      {!isLoading && budgetData.length > 0 && (
        <Card className="border-card-border bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Monthly Budget</p>
                  <p className="text-3xl font-bold tabular-nums mt-1">
                    {formatCurrency(totalBudget)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Spent This Month</p>
                  <p className="text-3xl font-bold tabular-nums mt-1">
                    {formatCurrency(totalSpent)}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">{formatPercentage(totalPercentage)}</span>
                </div>
                <Progress value={totalPercentage} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(totalBudget - totalSpent)} remaining
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budget Categories */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : budgetData.length === 0 ? (
        <Card className="border-card-border">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              No budgets created yet
            </p>
            <Button onClick={() => setOpen(true)}>
              Create Your First Budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {budgetData.map((budget) => {
            const config = categoryConfig[budget.category as keyof typeof categoryConfig];
            const Icon = config?.icon;

            return (
              <Card
                key={budget.id}
                className={`border-card-border ${
                  budget.isOverBudget
                    ? 'border-destructive'
                    : budget.isWarning
                    ? 'border-chart-4'
                    : ''
                }`}
                data-testid={`budget-card-${budget.category}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {Icon && (
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${config.color}15` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: config.color }} />
                        </div>
                      )}
                      <CardTitle className="text-lg">
                        {config?.label || budget.category}
                      </CardTitle>
                    </div>
                    {budget.isOverBudget && (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    )}
                    {budget.isWarning && !budget.isOverBudget && (
                      <AlertTriangle className="h-5 w-5 text-chart-4" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <p className="text-sm text-muted-foreground">Spent</p>
                      <p className="text-2xl font-bold tabular-nums">
                        {formatCurrency(budget.spent)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="text-xl font-semibold tabular-nums text-muted-foreground">
                        {formatCurrency(budget.limit)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{formatPercentage(budget.percentage)}</span>
                    </div>
                    <Progress
                      value={budget.percentage}
                      className={`h-2 ${
                        budget.isOverBudget
                          ? '[&>div]:bg-destructive'
                          : budget.isWarning
                          ? '[&>div]:bg-chart-4'
                          : ''
                      }`}
                    />
                  </div>

                  <div className="pt-2 border-t">
                    {budget.isOverBudget ? (
                      <p className="text-sm text-destructive font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Over budget by {formatCurrency(Math.abs(budget.remaining))}
                      </p>
                    ) : budget.isWarning ? (
                      <p className="text-sm text-chart-4 font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        {formatCurrency(budget.remaining)} remaining
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-chart-2" />
                        {formatCurrency(budget.remaining)} remaining
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
