import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Calculator, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

export default function Calculators() {
  // Loan Calculator State
  const [loanPrincipal, setLoanPrincipal] = useState("10000");
  const [loanRate, setLoanRate] = useState("5");
  const [loanTerm, setLoanTerm] = useState("36");
  const [loanResults, setLoanResults] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    schedule: Array<{ month: number; principal: number; interest: number; balance: number }>;
  } | null>(null);

  // Investment Calculator State
  const [investInitial, setInvestInitial] = useState("5000");
  const [investMonthly, setInvestMonthly] = useState("200");
  const [investRate, setInvestRate] = useState("7");
  const [investYears, setInvestYears] = useState("10");
  const [investResults, setInvestResults] = useState<{
    finalValue: number;
    totalContributed: number;
    totalEarnings: number;
    yearlyData: Array<{ year: number; value: number; contributed: number }>;
  } | null>(null);

  const calculateLoan = () => {
    const principal = parseFloat(loanPrincipal);
    const annualRate = parseFloat(loanRate) / 100;
    const monthlyRate = annualRate / 12;
    const months = parseInt(loanTerm);

    if (principal <= 0 || annualRate < 0 || months <= 0) return;

    // Calculate monthly payment
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;

    // Generate amortization schedule (first 12 months for chart)
    const schedule = [];
    let balance = principal;
    for (let i = 1; i <= Math.min(12, months); i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      schedule.push({
        month: i,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(balance, 0),
      });
    }

    setLoanResults({
      monthlyPayment,
      totalPayment,
      totalInterest,
      schedule,
    });
  };

  const calculateInvestment = () => {
    const initial = parseFloat(investInitial);
    const monthly = parseFloat(investMonthly);
    const annualRate = parseFloat(investRate) / 100;
    const years = parseInt(investYears);

    if (initial < 0 || monthly < 0 || annualRate < 0 || years <= 0) return;

    const monthlyRate = annualRate / 12;
    const months = years * 12;

    // Calculate future value
    let balance = initial;
    const yearlyData = [];
    let totalContributed = initial;

    for (let year = 1; year <= years; year++) {
      for (let month = 1; month <= 12; month++) {
        balance = balance * (1 + monthlyRate) + monthly;
        totalContributed += monthly;
      }
      yearlyData.push({
        year,
        value: balance,
        contributed: totalContributed,
      });
    }

    const finalValue = balance;
    const totalEarnings = finalValue - totalContributed;

    setInvestResults({
      finalValue,
      totalContributed,
      totalEarnings,
      yearlyData,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold" data-testid="text-page-title">
          Financial Calculators
        </h1>
        <p className="text-muted-foreground mt-1">
          Plan your loans and investments
        </p>
      </div>

      <Tabs defaultValue="loan">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="loan" data-testid="tab-loan">
            Loan Calculator
          </TabsTrigger>
          <TabsTrigger value="investment" data-testid="tab-investment">
            Investment Calculator
          </TabsTrigger>
        </TabsList>

        {/* Loan Calculator */}
        <TabsContent value="loan" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Loan Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loan-principal">Loan Amount ($)</Label>
                  <Input
                    id="loan-principal"
                    type="number"
                    value={loanPrincipal}
                    onChange={(e) => setLoanPrincipal(e.target.value)}
                    data-testid="input-loan-principal"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loan-rate">Annual Interest Rate (%)</Label>
                  <Input
                    id="loan-rate"
                    type="number"
                    step="0.1"
                    value={loanRate}
                    onChange={(e) => setLoanRate(e.target.value)}
                    data-testid="input-loan-rate"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loan-term">Loan Term (months)</Label>
                  <Input
                    id="loan-term"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    data-testid="input-loan-term"
                  />
                </div>

                <Button
                  onClick={calculateLoan}
                  className="w-full"
                  data-testid="button-calculate-loan"
                >
                  Calculate
                </Button>
              </CardContent>
            </Card>

            {loanResults && (
              <Card className="border-card-border">
                <CardHeader>
                  <CardTitle>Loan Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-sm text-muted-foreground mb-1">
                        Monthly Payment
                      </p>
                      <p className="text-3xl font-bold tabular-nums" data-testid="text-monthly-payment">
                        {formatCurrency(loanResults.monthlyPayment)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Total Payment
                        </p>
                        <p className="text-xl font-bold tabular-nums">
                          {formatCurrency(loanResults.totalPayment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Total Interest
                        </p>
                        <p className="text-xl font-bold tabular-nums text-destructive">
                          {formatCurrency(loanResults.totalInterest)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Payment Breakdown (First Year)
                    </p>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={loanResults.schedule}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="month"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
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
                        <Bar dataKey="principal" stackId="a" fill="hsl(var(--primary))" name="Principal" />
                        <Bar dataKey="interest" stackId="a" fill="hsl(var(--destructive))" name="Interest" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Investment Calculator */}
        <TabsContent value="investment" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Investment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invest-initial">Initial Investment ($)</Label>
                  <Input
                    id="invest-initial"
                    type="number"
                    value={investInitial}
                    onChange={(e) => setInvestInitial(e.target.value)}
                    data-testid="input-invest-initial"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invest-monthly">Monthly Contribution ($)</Label>
                  <Input
                    id="invest-monthly"
                    type="number"
                    value={investMonthly}
                    onChange={(e) => setInvestMonthly(e.target.value)}
                    data-testid="input-invest-monthly"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invest-rate">Expected Annual Return (%)</Label>
                  <Input
                    id="invest-rate"
                    type="number"
                    step="0.1"
                    value={investRate}
                    onChange={(e) => setInvestRate(e.target.value)}
                    data-testid="input-invest-rate"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invest-years">Investment Period (years)</Label>
                  <Input
                    id="invest-years"
                    type="number"
                    value={investYears}
                    onChange={(e) => setInvestYears(e.target.value)}
                    data-testid="input-invest-years"
                  />
                </div>

                <Button
                  onClick={calculateInvestment}
                  className="w-full"
                  data-testid="button-calculate-investment"
                >
                  Calculate
                </Button>
              </CardContent>
            </Card>

            {investResults && (
              <Card className="border-card-border">
                <CardHeader>
                  <CardTitle>Investment Projection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-chart-2/5 border border-chart-2/10">
                      <p className="text-sm text-muted-foreground mb-1">
                        Final Value
                      </p>
                      <p className="text-3xl font-bold tabular-nums" data-testid="text-final-value">
                        {formatCurrency(investResults.finalValue)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Total Contributed
                        </p>
                        <p className="text-xl font-bold tabular-nums">
                          {formatCurrency(investResults.totalContributed)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Total Earnings
                        </p>
                        <p className="text-xl font-bold tabular-nums text-chart-2">
                          {formatCurrency(investResults.totalEarnings)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Growth Over Time</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={investResults.yearlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="year"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => formatCurrency(value)}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                          name="Total Value"
                        />
                        <Line
                          type="monotone"
                          dataKey="contributed"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Contributed"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
