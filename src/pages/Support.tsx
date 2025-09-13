import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ExternalLink, HelpCircle } from "lucide-react";

const Support = () => {
  const telegramHandles = [
    { name: "Support Agent 1", handle: "Ultrabase1" },
    { name: "Support Agent 2", handle: "Ultrabase2" },
    { name: "Support Agent 3", handle: "Ultrabase3" },
    { name: "Support Agent 4", handle: "Ultrabase4" }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Get <span className="bg-gradient-primary bg-clip-text text-transparent">Support</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Need help? Our support team is available 24/7 via Telegram to assist you with any questions or issues.
          </p>
        </div>

        {/* Support Options */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Telegram Support */}
          <Card className="p-8 glass-card">
            <div className="mb-6">
              <MessageCircle className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">Telegram Support</h3>
              <p className="text-muted-foreground">
                Contact our support team directly via Telegram for instant assistance.
              </p>
            </div>
            
            <div className="space-y-3">
              {telegramHandles.map((agent) => (
                <Button
                  key={agent.handle}
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => window.open(`https://t.me/${agent.handle}`, '_blank')}
                >
                  <span>{agent.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">@{agent.handle}</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </Button>
              ))}
            </div>
          </Card>

          {/* FAQ */}
          <Card className="p-8 glass-card">
            <div className="mb-6">
              <HelpCircle className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">Frequently Asked Questions</h3>
              <p className="text-muted-foreground">
                Find answers to common questions about our platform.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-1">How do I deposit UC?</h4>
                <p className="text-sm text-muted-foreground">
                  Use the Paystack integration in your wallet. ₦100 = 10 UC.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-1">How are credentials delivered?</h4>
                <p className="text-sm text-muted-foreground">
                  After purchase, credentials are sent to your messages and via Telegram.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-1">What is UC?</h4>
                <p className="text-sm text-muted-foreground">
                  Universal Currency (UC) is our secure digital currency for marketplace transactions.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-1">Is my payment secure?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, we use Paystack for secure payment processing and store no financial data.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Response Time */}
        <Card className="p-6 glass-card text-center">
          <h3 className="text-xl font-semibold mb-2">Average Response Time</h3>
          <div className="text-3xl font-bold text-success mb-2">~5 minutes</div>
          <p className="text-muted-foreground">
            Our support team typically responds within 5 minutes during business hours.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Support;