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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Filter } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { categoryConfig, incomeCategories, expenseCategories } from "@/lib/categoryConfig";
import { insertTransactionSchema, type Transaction } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

const formSchema = insertTransactionSchema.extend({
  amount: z.string().min(1, "Amount is required"),
});

export default function Transactions() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
    },
  });

  const transactionType = form.watch("type");

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return await apiRequest("POST", "/api/transactions", {
        ...data,
        amount: parseFloat(data.amount).toFixed(2),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Success",
        description: "Transaction added successfully",
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
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createMutation.mutate(data);
  };

  const filteredTransactions = transactions?.filter(t => 
    filterType === 'all' ? true : t.type === filterType
  ) || [];

  const categories = transactionType === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold" data-testid="text-page-title">
            Transactions
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your income and expenses
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-transaction">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
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
                          {categories.map((cat) => {
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add a note..."
                          className="resize-none"
                          data-testid="input-description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" data-testid="input-date" {...field} />
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
                    {createMutation.isPending ? "Adding..." : "Add Transaction"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)}>
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
          <TabsTrigger value="income" data-testid="tab-income">Income</TabsTrigger>
          <TabsTrigger value="expense" data-testid="tab-expense">Expenses</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Transactions List */}
      <Card className="border-card-border">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No transactions found
              </p>
              <Button onClick={() => setOpen(true)}>
                Add Your First Transaction
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => {
                const config = categoryConfig[transaction.category as keyof typeof categoryConfig];
                const Icon = config?.icon;

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-card-border hover-elevate"
                    data-testid={`transaction-${transaction.id}`}
                  >
                    <div className="flex items-center gap-4">
                      {Icon && (
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${config.color}15` }}
                        >
                          <Icon className="h-6 w-6" style={{ color: config.color }} />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{config?.label || transaction.category}</p>
                        {transaction.description && (
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {transaction.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-xl font-bold tabular-nums ${
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
