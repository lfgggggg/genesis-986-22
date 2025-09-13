import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Clock, Globe } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Contact <span className="bg-gradient-primary bg-clip-text text-transparent">ULTRASOLX</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get in touch with our team. We're here to help you with any questions about our premium social media marketplace.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Primary Contact */}
          <Card className="p-8 glass-card">
            <MessageCircle className="w-12 h-12 text-primary mb-6" />
            <h3 className="text-2xl font-bold mb-4">Telegram Support</h3>
            <p className="text-muted-foreground mb-6">
              Our primary communication channel. Get instant support from our team.
            </p>
            
            <div className="space-y-3">
              {['Ultrabase1', 'Ultrabase2', 'Ultrabase3', 'Ultrabase4'].map((handle) => (
                <Button
                  key={handle}
                  variant="hero"
                  className="w-full"
                  onClick={() => window.open(`https://t.me/${handle}`, '_blank')}
                >
                  Contact @{handle}
                </Button>
              ))}
            </div>
          </Card>

          {/* Business Hours */}
          <Card className="p-8 glass-card">
            <Clock className="w-12 h-12 text-primary mb-6" />
            <h3 className="text-2xl font-bold mb-4">Availability</h3>
            <p className="text-muted-foreground mb-6">
              Our support team is available around the clock to assist you.
            </p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Support Hours</span>
                <span className="text-success font-semibold">24/7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Response Time</span>
                <span className="text-success font-semibold">~5 minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Languages</span>
                <span className="font-semibold">English</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Platform Info */}
        <Card className="p-8 glass-card text-center">
          <Globe className="w-16 h-16 text-primary mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-4">ULTRASOLX Platform</h3>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
            Your trusted marketplace for premium social media accounts. We provide secure transactions, 
            instant delivery, and verified high-quality accounts across all major platforms.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-sm text-muted-foreground">Accounts Sold</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Support Available</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContactUs;