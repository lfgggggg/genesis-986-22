import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  CreditCard, 
  ShoppingCart, 
  Shield, 
  Users, 
  MessageCircle,
  Wallet,
  Settings
} from "lucide-react";
import { useState } from "react";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const helpCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Users,
      articles: [
        { title: "How to create an account", content: "Sign up with email and verify your account to start using ULTRASOLX." },
        { title: "Understanding UC (Universal Currency)", content: "UC is our secure digital currency. ₦100 = 10 UC." },
        { title: "Your first purchase", content: "Browse marketplace → Select account → Purchase with UC → Receive credentials." }
      ]
    },
    {
      id: "payments",
      title: "Payments & UC",
      icon: CreditCard,
      articles: [
        { title: "How to deposit UC", content: "Go to Wallet → Add UC → Enter amount → Pay via Paystack. ₦100 = 10 UC." },
        { title: "Payment methods", content: "We accept all major cards via Paystack for UC deposits." },
        { title: "UC conversion rates", content: "₦100 Nigerian Naira = 10 Universal Currency (UC)" }
      ]
    },
    {
      id: "marketplace",
      title: "Marketplace",
      icon: ShoppingCart,
      articles: [
        { title: "How to purchase accounts", content: "Browse accounts → Click purchase → Confirm with UC → Receive credentials instantly." },
        { title: "Account categories", content: "We offer Instagram, Twitter, TikTok, YouTube, and Facebook accounts." },
        { title: "Credential delivery", content: "Credentials are delivered via Messages tab and Telegram notification." }
      ]
    },
    {
      id: "security",
      title: "Security & Safety",
      icon: Shield,
      articles: [
        { title: "Account verification", content: "All accounts are verified and tested before listing on our marketplace." },
        { title: "Secure payments", content: "We use Paystack for secure payment processing. No financial data is stored." },
        { title: "Credential security", content: "All credentials are encrypted and delivered through secure channels." }
      ]
    }
  ];

  const filteredCategories = helpCategories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.articles.length > 0 || searchQuery === "");

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Help <span className="bg-gradient-primary bg-clip-text text-transparent">Center</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to your questions about ULTRASOLX marketplace
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <Button variant="outline" className="h-16 flex-col space-y-2">
            <Wallet className="w-6 h-6" />
            <span>Deposit UC</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col space-y-2">
            <ShoppingCart className="w-6 h-6" />
            <span>Buy Account</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col space-y-2">
            <MessageCircle className="w-6 h-6" />
            <span>Contact Support</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col space-y-2">
            <Settings className="w-6 h-6" />
            <span>Account Settings</span>
          </Button>
        </div>

        {/* Help Categories */}
        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {helpCategories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.title}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {helpCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <Card className="glass-card">
                <div className="p-6 border-b border-border/30">
                  <div className="flex items-center space-x-3">
                    <category.icon className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                  </div>
                </div>
                <div className="divide-y divide-border/30">
                  {category.articles.map((article, index) => (
                    <div key={index} className="p-6">
                      <h4 className="font-semibold mb-3">{article.title}</h4>
                      <p className="text-muted-foreground">{article.content}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Still Need Help */}
        <Card className="p-8 glass-card text-center mt-12">
          <MessageCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is available 24/7 via Telegram to help you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Ultrabase1', 'Ultrabase2', 'Ultrabase3', 'Ultrabase4'].map((handle) => (
              <Button
                key={handle}
                variant="hero"
                onClick={() => window.open(`https://t.me/${handle}`, '_blank')}
              >
                Contact @{handle}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;