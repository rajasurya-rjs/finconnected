import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Target,
  Wallet,
  TrendingUp,
  Shield,
  GraduationCap,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground leading-tight">
              Take Control of Your
              <br />
              <span className="text-primary">Financial Future</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Empower yourself with smart budgeting tools, expense tracking, and
              personalized financial education designed for young professionals
              and students.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-12 px-8 text-base font-semibold"
              asChild
              data-testid="button-get-started"
            >
              <a href="/login">
                Start Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base font-semibold"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Join thousands of students and young professionals building better
            financial habits
          </p>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
            Common Financial Challenges
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-card-border">
              <CardContent className="p-6 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold">
                  Overspending
                </h3>
                <p className="text-muted-foreground">
                  <span className="text-2xl font-bold text-destructive">67%</span>
                  <br />
                  of young adults struggle with overspending on non-essentials
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-card-border">
              <CardContent className="p-6 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold">
                  Poor Budgeting
                </h3>
                <p className="text-muted-foreground">
                  <span className="text-2xl font-bold text-destructive">53%</span>
                  <br />
                  don't have a monthly budget or track their expenses regularly
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-card-border">
              <CardContent className="p-6 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold">
                  Lack of Savings
                </h3>
                <p className="text-muted-foreground">
                  <span className="text-2xl font-bold text-destructive">46%</span>
                  <br />
                  have less than $500 in emergency savings
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-24">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-heading font-bold">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools to help you manage money like a pro
            </p>
          </div>

          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-bold">
                Smart Expense Tracking
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Easily track income and expenses with intuitive categorization.
                Visualize your spending patterns with beautiful charts and
                identify areas where you can save.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Automatic categorization with custom categories</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Interactive spending trends and analytics</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Monthly and yearly financial summaries</span>
                </li>
              </ul>
            </div>
            <Card className="h-80 bg-gradient-to-br from-primary/5 to-primary/10 border-card-border">
              <CardContent className="p-6 flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm">
                  Dashboard Preview
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="h-80 bg-gradient-to-br from-chart-2/10 to-chart-2/20 border-card-border md:order-first">
              <CardContent className="p-6 flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm">
                  Budget Planner Preview
                </p>
              </CardContent>
            </Card>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-chart-2" />
              </div>
              <h3 className="text-2xl font-heading font-bold">
                Budget Planner
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Set monthly budgets for each category and get real-time alerts
                when you're approaching your limits. Stay on track with visual
                progress indicators.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-chart-2 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Category-based budget allocation</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-chart-2 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Overspending alerts and warnings</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-chart-2 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Budget vs. actual comparison reports</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-chart-3" />
              </div>
              <h3 className="text-2xl font-heading font-bold">Savings Goals</h3>
              <p className="text-muted-foreground leading-relaxed">
                Create and track multiple savings goals with target amounts and
                dates. Get motivated with progress visualization and milestone
                celebrations.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-chart-3 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Multiple concurrent savings goals</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-chart-3 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Progress tracking with visual indicators</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-chart-3 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Motivational milestones and reminders</span>
                </li>
              </ul>
            </div>
            <Card className="h-80 bg-gradient-to-br from-chart-3/10 to-chart-3/20 border-card-border">
              <CardContent className="p-6 flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm">
                  Savings Goals Preview
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Feature 4 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="h-80 bg-gradient-to-br from-chart-4/10 to-chart-4/20 border-card-border md:order-first">
              <CardContent className="p-6 flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm">
                  Financial Education Preview
                </p>
              </CardContent>
            </Card>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-chart-4" />
              </div>
              <h3 className="text-2xl font-heading font-bold">
                Financial Education
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Learn financial concepts through bite-sized articles, tutorials,
                and FAQs. Get personalized tips based on your spending patterns
                and financial goals.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-chart-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Curated financial literacy content</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-chart-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Interactive loan and investment calculators</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-chart-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Daily financial tips and best practices</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up",
                description: "Create your free account in seconds",
              },
              {
                step: "2",
                title: "Track Expenses",
                description: "Log your income and expenses easily",
              },
              {
                step: "3",
                title: "Set Budgets",
                description: "Define spending limits for each category",
              },
              {
                step: "4",
                title: "Achieve Goals",
                description: "Watch your savings grow and build wealth",
              },
            ].map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-heading font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-heading font-semibold">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            Your Data is Safe
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We use bank-level encryption to protect your financial information.
            Your data is encrypted at rest and in transit, ensuring complete
            privacy and security.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            Ready to Master Your Money?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of young professionals and students taking control of
            their financial future today.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="h-12 px-8 text-base font-semibold"
            asChild
            data-testid="button-cta-signup"
          >
            <a href="/login">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
