import {
  Wallet,
  Briefcase,
  TrendingUp,
  PlusCircle,
  UtensilsCrossed,
  Car,
  Home,
  Zap,
  Film,
  ShoppingBag,
  Heart,
  GraduationCap,
  PiggyBank,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import type { TransactionCategory } from "@shared/schema";

export interface CategoryConfig {
  value: TransactionCategory;
  label: string;
  icon: LucideIcon;
  type: 'income' | 'expense';
  color: string;
}

export const categoryConfig: Record<TransactionCategory, CategoryConfig> = {
  'salary': {
    value: 'salary',
    label: 'Salary',
    icon: Wallet,
    type: 'income',
    color: 'hsl(var(--chart-1))',
  },
  'freelance': {
    value: 'freelance',
    label: 'Freelance',
    icon: Briefcase,
    type: 'income',
    color: 'hsl(var(--chart-2))',
  },
  'investment': {
    value: 'investment',
    label: 'Investment',
    icon: TrendingUp,
    type: 'income',
    color: 'hsl(var(--chart-3))',
  },
  'other-income': {
    value: 'other-income',
    label: 'Other Income',
    icon: PlusCircle,
    type: 'income',
    color: 'hsl(var(--chart-4))',
  },
  'food': {
    value: 'food',
    label: 'Food & Dining',
    icon: UtensilsCrossed,
    type: 'expense',
    color: 'hsl(var(--chart-1))',
  },
  'transportation': {
    value: 'transportation',
    label: 'Transportation',
    icon: Car,
    type: 'expense',
    color: 'hsl(var(--chart-2))',
  },
  'housing': {
    value: 'housing',
    label: 'Housing',
    icon: Home,
    type: 'expense',
    color: 'hsl(var(--chart-3))',
  },
  'utilities': {
    value: 'utilities',
    label: 'Utilities',
    icon: Zap,
    type: 'expense',
    color: 'hsl(var(--chart-4))',
  },
  'entertainment': {
    value: 'entertainment',
    label: 'Entertainment',
    icon: Film,
    type: 'expense',
    color: 'hsl(var(--chart-5))',
  },
  'shopping': {
    value: 'shopping',
    label: 'Shopping',
    icon: ShoppingBag,
    type: 'expense',
    color: 'hsl(var(--chart-1))',
  },
  'healthcare': {
    value: 'healthcare',
    label: 'Healthcare',
    icon: Heart,
    type: 'expense',
    color: 'hsl(var(--chart-2))',
  },
  'education': {
    value: 'education',
    label: 'Education',
    icon: GraduationCap,
    type: 'expense',
    color: 'hsl(var(--chart-3))',
  },
  'savings': {
    value: 'savings',
    label: 'Savings',
    icon: PiggyBank,
    type: 'expense',
    color: 'hsl(var(--chart-4))',
  },
  'other-expense': {
    value: 'other-expense',
    label: 'Other',
    icon: MoreHorizontal,
    type: 'expense',
    color: 'hsl(var(--chart-5))',
  },
};

export const incomeCategories = Object.values(categoryConfig).filter(c => c.type === 'income');
export const expenseCategories = Object.values(categoryConfig).filter(c => c.type === 'expense');
