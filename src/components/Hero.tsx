import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Zap, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Bank-level security with escrow protection"
    },
    {
      icon: Zap,
      title: "Instant Transfers",
      description: "UC transfers processed in real-time"
    },
    {
      icon: Users,
      title: "Verified Accounts",
      description: "All social media accounts thoroughly verified"
    },
    {
      icon: TrendingUp,
      title: "Market Analytics",
      description: "Track account values and market trends"
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/80" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-pulse-glow">
              <span className="text-primary font-medium">🚀 Now Live in Beta</span>
            </div>
            
            <h1 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              style={{
                animation: 'fadeInUp 1s ease-out'
              }}
            >
              Trade Social Media
              <br />
              <span className="gradient-text-animate">
                Accounts Safely
              </span>
            </h1>
            
            <p 
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
              style={{
                animation: 'fadeInUp 1.2s ease-out'
              }}
            >
              The first secure marketplace for buying and selling social media accounts. 
              Use Universal Currency (UC) for instant, protected transactions.
            </p>

            <div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              style={{
                animation: 'fadeInUp 1.4s ease-out'
              }}
            >
              <Button asChild className="min-w-[200px] gradient-primary shadow-premium hover:scale-105 hover:shadow-glow transition-all duration-300 text-lg px-8 py-4">
                <Link to="/register">
                  Start Trading Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="min-w-[200px] hover:scale-105 hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-lg px-8 py-4">
                <Link to="/marketplace">
                  Browse Marketplace
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {[
                { value: "10K+", label: "Accounts Sold" },
                { value: "5K+", label: "Active Users" },
                { value: "99.9%", label: "Uptime" },
                { value: "$2M+", label: "Volume Traded" }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center group hover:scale-105 transition-all duration-300 cursor-pointer"
                  style={{
                    animationDelay: `${1.6 + index * 0.1}s`,
                    animation: 'fadeInUp 0.8s ease-out forwards'
                  }}
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="p-6 glass-card hover:shadow-premium transition-all duration-500 group cursor-pointer hover:scale-105 hover:-translate-y-2"
                  style={{
                    animationDelay: `${2 + index * 0.15}s`,
                    animation: 'fadeInUp 0.8s ease-out forwards'
                  }}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-float">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors duration-300">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;