import { db } from "./db";
import { financialTips } from "@shared/schema";

const tips = [
  // Beginner tips
  {
    title: "Start with a Simple Budget",
    content: "Create a basic budget by tracking all your income and expenses for a month. Write down everything you spend, from coffee to rent. This awareness is the first step to taking control of your finances. Use categories like housing, food, transportation, and entertainment to organize your spending.",
    category: "budgeting",
    difficulty: "beginner",
  },
  {
    title: "Build an Emergency Fund",
    content: "Start by saving $1,000 for unexpected expenses like car repairs or medical bills. Keep this money in a separate savings account that's easy to access but not too easy to spend. Once you have $1,000, work towards 3-6 months of living expenses. This fund provides peace of mind and prevents you from going into debt when emergencies happen.",
    category: "saving",
    difficulty: "beginner",
  },
  {
    title: "Pay Yourself First",
    content: "Set up automatic transfers to your savings account on payday. Even if it's just $25 or $50, make saving a priority before you spend on anything else. This simple habit ensures you're consistently building wealth. Over time, try to increase the amount as your income grows.",
    category: "saving",
    difficulty: "beginner",
  },
  {
    title: "Understand Needs vs. Wants",
    content: "Before making a purchase, ask yourself: 'Do I need this or do I want this?' Needs are essentials like food, shelter, and basic clothing. Wants are nice-to-haves like the latest phone or eating out. Being honest about this distinction helps you make better spending decisions and avoid impulse purchases.",
    category: "budgeting",
    difficulty: "beginner",
  },
  {
    title: "Start Small with Debt Repayment",
    content: "If you have multiple debts, list them all with their balances and interest rates. Start by paying minimum payments on everything, then put extra money toward either the smallest debt (for quick wins) or the highest interest debt (to save money). Celebrate each debt you eliminate to stay motivated.",
    category: "debt",
    difficulty: "beginner",
  },

  // Intermediate tips
  {
    title: "Master the 50/30/20 Rule",
    content: "Allocate 50% of your after-tax income to needs (housing, food, utilities, insurance), 30% to wants (dining out, hobbies, streaming services), and 20% to savings and debt repayment. This framework provides balance while ensuring you're building wealth. Adjust the percentages based on your situation—if you have high-interest debt, consider shifting more to the 20% category.",
    category: "budgeting",
    difficulty: "intermediate",
  },
  {
    title: "Invest in Your Future",
    content: "Once you have an emergency fund and manageable debt, start investing for retirement. If your employer offers a 401(k) match, contribute at least enough to get the full match—it's free money. Consider opening a Roth IRA for tax-free growth. Start with low-cost index funds that track the market. The power of compound interest means starting early, even with small amounts, can lead to significant wealth over decades.",
    category: "investing",
    difficulty: "intermediate",
  },
  {
    title: "Optimize Your Credit Score",
    content: "Your credit score affects loan interest rates, insurance premiums, and even job prospects. Pay all bills on time (35% of score), keep credit utilization below 30% (30% of score), maintain old credit accounts (15% of score), limit new credit applications, and diversify your credit mix. Check your credit report annually for errors and dispute any inaccuracies.",
    category: "debt",
    difficulty: "intermediate",
  },
  {
    title: "Automate Your Finances",
    content: "Set up automatic bill payments, savings transfers, and investment contributions. Automation removes the mental burden of remembering to pay bills and ensures you're consistently working toward your goals. Just make sure you have enough in your checking account to cover all automatic withdrawals, and review your accounts monthly to catch any errors.",
    category: "budgeting",
    difficulty: "intermediate",
  },
  {
    title: "Review and Adjust Regularly",
    content: "Schedule a monthly 'money date' with yourself to review your budget, track progress toward goals, and adjust as needed. Life changes—income increases, rent goes up, new expenses arise. Your budget should evolve with you. Use this time to celebrate wins (paid off a debt!) and recommit to your financial goals.",
    category: "budgeting",
    difficulty: "intermediate",
  },

  // Advanced tips
  {
    title: "Tax-Advantaged Investing Strategies",
    content: "Maximize tax-advantaged accounts: contribute to 401(k) up to employer match, max out Roth IRA ($6,500/year in 2024), then increase 401(k) contributions up to the limit ($22,500/year in 2024). Consider HSAs for triple tax benefits if you have a high-deductible health plan. Understand the difference between traditional (tax-deferred) and Roth (tax-free growth) accounts to optimize your tax situation now and in retirement.",
    category: "investing",
    difficulty: "advanced",
  },
  {
    title: "Asset Allocation and Rebalancing",
    content: "Diversify your investments across stocks, bonds, and other assets based on your age, risk tolerance, and timeline. A common rule is to hold (120 minus your age)% in stocks. Rebalance annually by selling overweighted assets and buying underweighted ones to maintain your target allocation. This disciplined approach forces you to 'buy low, sell high' while managing risk.",
    category: "investing",
    difficulty: "advanced",
  },
  {
    title: "Optimize Debt Strategically",
    content: "Not all debt is bad. Low-interest debt (like a mortgage at 3%) can be beneficial if you can earn higher returns investing. Focus on eliminating high-interest debt (credit cards above 15%) aggressively. For student loans, compare the interest rate to potential investment returns and consider refinancing if rates have dropped. Calculate the true cost of debt including tax deductions before deciding to pay extra vs. invest.",
    category: "debt",
    difficulty: "advanced",
  },
  {
    title: "Build Multiple Income Streams",
    content: "Diversify your income sources to increase financial security and accelerate wealth building. This could include side businesses, freelancing, rental income, dividend-paying investments, or digital products. Each additional income stream reduces your dependence on a single source and provides opportunities for higher savings rates. Start with one additional stream and grow from there.",
    category: "investing",
    difficulty: "advanced",
  },
  {
    title: "Plan for Major Life Events",
    content: "Factor in large future expenses: buying a home (20% down payment), having children ($300k+ to raise), weddings, education costs. Create dedicated savings accounts for each goal with specific timelines. For goals within 5 years, use conservative investments like high-yield savings or bonds. For longer-term goals, you can afford more risk with stock-heavy portfolios. Review and adjust these plans annually as circumstances change.",
    category: "saving",
    difficulty: "advanced",
  },
];

async function seed() {
  try {
    console.log("Seeding financial tips...");
    
    await db.insert(financialTips).values(tips);
    
    console.log("✅ Successfully seeded financial tips!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
