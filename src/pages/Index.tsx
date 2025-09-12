import Hero from "@/components/Hero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Zap, Users, Star, CheckCircle, TrendingUp } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Secure Transactions",
      description: "End-to-end encrypted purchases with escrow protection for all marketplace transactions."
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Instant Delivery",
      description: "Get your social media accounts instantly after purchase with automated credential delivery."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Verified Accounts",
      description: "All accounts are pre-verified and come with detailed analytics and engagement metrics."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Growth Analytics",
      description: "Track follower growth, engagement rates, and performance metrics for each account."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Digital Marketer",
      content: "ULTRASOLX helped me scale my client campaigns quickly. The account quality is exceptional!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Content Creator",
      content: "Perfect platform for acquiring established social media accounts. Great customer support!",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Social Media Manager",
      content: "The variety of accounts and transparent pricing makes this my go-to marketplace.",
      rating: 5
    }
  ];

  const stats = [
    { label: "Accounts Sold", value: "10,000+" },
    { label: "Happy Customers", value: "5,000+" },
    { label: "Success Rate", value: "99.9%" },
    { label: "Average Rating", value: "4.9/5" }
  ];

  return (
    <main className="min-h-screen">
      <Hero />
      
      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-muted-foreground group-hover:text-primary transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose ULTRASOLX?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The most trusted marketplace for premium social media accounts with unmatched security and service.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="glass-card hover:shadow-premium transition-all duration-500 hover:scale-105 hover:-translate-y-2 group"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center group-hover:text-foreground transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Get started in just 3 simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                number: 1,
                title: "Browse & Select",
                description: "Explore our marketplace and find the perfect social media account for your needs."
              },
              {
                number: 2,
                title: "Secure Payment",
                description: "Complete your purchase using our secure payment system with buyer protection."
              },
              {
                number: 3,
                title: "Instant Access",
                description: "Receive your account credentials instantly and start growing your presence."
              }
            ].map((step, index) => (
              <div 
                key={index}
                className="text-center space-y-4 group hover:scale-105 transition-all duration-300"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-2xl font-bold group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of satisfied customers who trust ULTRASOLX
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="glass-card hover:shadow-premium transition-all duration-500 hover:scale-105 group"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5 fill-primary text-primary group-hover:scale-110 transition-transform duration-300"
                        style={{ animationDelay: `${i * 50}ms` }}
                      />
                    ))}
                  </div>
                  <CardDescription className="text-base italic group-hover:text-foreground transition-colors duration-300">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold group-hover:text-primary transition-colors duration-300">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join ULTRASOLX today and discover premium social media accounts that will accelerate your digital growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="gradient-primary shadow-premium text-lg px-8 py-6 hover:scale-105 hover:shadow-glow transition-all duration-300">
              <Link to="/marketplace">Browse Marketplace</Link>
            </Button>
            <Button asChild variant="outline" className="text-lg px-8 py-6 hover:scale-105 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ULTRASOLX
              </h3>
              <p className="text-muted-foreground">
                The premium marketplace for verified social media accounts.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/marketplace" className="block text-muted-foreground hover:text-primary transition-colors">
                  Marketplace
                </Link>
                <Link to="/register" className="block text-muted-foreground hover:text-primary transition-colors">
                  Sign Up
                </Link>
                <Link to="/login" className="block text-muted-foreground hover:text-primary transition-colors">
                  Login
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <div className="space-y-2">
                <a href="mailto:support@ultrasolx.com" className="block text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <div className="space-y-2">
                <Link to="/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 ULTRASOLX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
