import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GraduationCap, Lightbulb, BookOpen, TrendingUp } from "lucide-react";
import type { FinancialTip } from "@shared/schema";

const faqs = [
  {
    question: "What is the 50/30/20 budgeting rule?",
    answer: "The 50/30/20 rule is a simple budgeting framework: allocate 50% of your income to needs (housing, food, utilities), 30% to wants (entertainment, dining out), and 20% to savings and debt repayment. This helps maintain a balanced financial life while building wealth over time."
  },
  {
    question: "How much should I have in my emergency fund?",
    answer: "Financial experts recommend saving 3-6 months of living expenses in an emergency fund. Start with a smaller goal of $1,000, then gradually build up. Keep this money in a high-yield savings account that's easily accessible but separate from your checking account."
  },
  {
    question: "What's the difference between saving and investing?",
    answer: "Saving is setting aside money for short-term goals or emergencies, typically in a savings account with little to no risk. Investing involves putting money into assets like stocks, bonds, or real estate with the goal of long-term growth, accepting some risk for potentially higher returns."
  },
  {
    question: "When should I start investing?",
    answer: "Start investing as soon as you have: 1) Paid off high-interest debt, 2) Built a small emergency fund ($1,000-$2,000), and 3) Have consistent income. The power of compound interest means starting early, even with small amounts, can lead to significant growth over time."
  },
  {
    question: "How can I improve my credit score?",
    answer: "To improve your credit score: 1) Pay bills on time (35% of score), 2) Keep credit utilization below 30%, 3) Don't close old credit cards, 4) Diversify your credit mix, and 5) Limit hard inquiries. Building good credit takes time, typically 6-12 months to see significant improvement."
  },
  {
    question: "What's compound interest and why does it matter?",
    answer: "Compound interest is earning interest on both your initial principal and the accumulated interest from previous periods. It's powerful because your money grows exponentially over time. For example, $1,000 at 7% annually becomes $1,967 in 10 years, and $3,870 in 20 years."
  },
];

export default function Learn() {
  const { data: tips, isLoading } = useQuery<FinancialTip[]>({
    queryKey: ["/api/financial-tips"],
  });

  const beginner = tips?.filter(t => t.difficulty === 'beginner') || [];
  const intermediate = tips?.filter(t => t.difficulty === 'intermediate') || [];
  const advanced = tips?.filter(t => t.difficulty === 'advanced') || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold" data-testid="text-page-title">
          Financial Education
        </h1>
        <p className="text-muted-foreground mt-1">
          Learn essential money management skills
        </p>
      </div>

      {/* Quick Tips Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-card-border">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-heading font-semibold mb-2">
              Daily Tip
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Track every expense for a week to understand your spending patterns.
              You'll be surprised where your money actually goes!
            </p>
          </CardContent>
        </Card>

        <Card className="border-card-border">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-chart-2" />
            </div>
            <h3 className="text-lg font-heading font-semibold mb-2">
              Smart Saving
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Automate your savings by setting up automatic transfers on payday.
              Pay yourself first, even if it's just $25 per week.
            </p>
          </CardContent>
        </Card>

        <Card className="border-card-border">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-chart-3" />
            </div>
            <h3 className="text-lg font-heading font-semibold mb-2">
              Budget Basics
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Start with the 50/30/20 rule: 50% needs, 30% wants, 20% savings.
              Adjust based on your situation and goals.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Topics */}
      <Card className="border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Learning Paths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="beginner">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="beginner" data-testid="tab-beginner">
                Beginner
              </TabsTrigger>
              <TabsTrigger value="intermediate" data-testid="tab-intermediate">
                Intermediate
              </TabsTrigger>
              <TabsTrigger value="advanced" data-testid="tab-advanced">
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="beginner" className="space-y-4 mt-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : beginner.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No beginner tips available yet
                </p>
              ) : (
                beginner.map((tip) => (
                  <Card key={tip.id} className="border-card-border">
                    <CardHeader>
                      <CardTitle className="text-base">{tip.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tip.content}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="intermediate" className="space-y-4 mt-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : intermediate.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No intermediate tips available yet
                </p>
              ) : (
                intermediate.map((tip) => (
                  <Card key={tip.id} className="border-card-border">
                    <CardHeader>
                      <CardTitle className="text-base">{tip.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tip.content}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : advanced.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No advanced tips available yet
                </p>
              ) : (
                advanced.map((tip) => (
                  <Card key={tip.id} className="border-card-border">
                    <CardHeader>
                      <CardTitle className="text-base">{tip.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tip.content}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card className="border-card-border">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
