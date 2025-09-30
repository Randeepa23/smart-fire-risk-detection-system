import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Flame, 
  Shield, 
  Thermometer, 
  Eye, 
  BarChart3, 
  MapPin, 
  ArrowRight,
  CheckCircle,
  Zap,
  Brain,
  Wifi,
  Clock,
  Menu,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import environmentHero from "@/assets/environment-hero.jpg";

export default function Landing() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: Shield,
      title: "Advanced Detection",
      description: "AI-powered fire risk assessment with 99.9% accuracy using machine learning algorithms.",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      borderColor: "border-emerald-400/30"
    },
    {
      icon: Thermometer,
      title: "Real-time Monitoring",
      description: "Continuous environmental monitoring with instant alerts and comprehensive sensor data.",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-400/30"
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Predictive insights and trend analysis to prevent fires before they start.",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-400/30"
    },
    {
      icon: Brain,
      title: "AI Intelligence",
      description: "Machine learning models trained on thousands of fire scenarios for optimal protection.",
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      borderColor: "border-orange-400/30"
    }
  ];

  const stats = [
    { value: "99.9%", label: "Detection Accuracy" },
    { value: "24/7", label: "Continuous Monitoring" },
    { value: "5000+", label: "Protected Buildings" },
    { value: "<30s", label: "Response Time" }
  ];

  const benefits = [
    "Enterprise-grade security and compliance",
    "Seamless integration with existing systems",
    "24/7 professional monitoring and support",
    "Cost-effective fire prevention solution"
  ];

  return (
    <div 
      className="min-h-screen text-white relative"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url(${environmentHero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pt-6 sm:pt-8 pb-4 sticky top-0 z-50 glass-navbar">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 backdrop-blur-sm rounded-xl border border-emerald-400/30 animate-pulse-glow">
                <Flame className="h-8 w-8 text-emerald-400 animate-float" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white">EmberGuard</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Badge variant="outline" className="bg-white/10 backdrop-blur-sm border-emerald-400/50 text-emerald-300 px-3 py-1 text-xs sm:text-sm">
                <Wifi className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-emerald-400 animate-bounce-gentle" />
                Live System
              </Badge>
              <Button 
                variant="ghost" 
                className="text-slate-300 hover:text-white transition-colors duration-300"
                onClick={() => navigate("/auth")}
              >
                Sign In
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:bg-white/10"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/10 animate-fade-in-up">
              <div className="flex flex-col gap-4 pt-4">
                <Badge variant="outline" className="bg-white/10 backdrop-blur-sm border-emerald-400/50 text-emerald-300 px-3 py-1 text-xs w-fit">
                  <Wifi className="h-3 w-3 mr-1.5 text-emerald-400" />
                  Live System
                </Badge>
                <Button 
                  variant="ghost" 
                  className="text-slate-300 hover:text-white transition-colors duration-300 w-fit"
                  onClick={() => {
                    navigate("/auth");
                    setIsMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
              </div>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="py-12 sm:py-16 md:py-20 text-center relative overflow-hidden">
          {/* Animated background particles */}
          <div className="particles-bg"></div>
          
          <div className="max-w-4xl mx-auto relative z-10">
            <Badge className="mb-6 sm:mb-8 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 backdrop-blur-sm border-emerald-400/30 text-emerald-300 px-4 py-2 text-sm sm:text-base animate-fade-in-up animate-pulse-glow">
              <Zap className="h-4 w-4 mr-2 animate-rotate-slow" />
              AI-Powered Fire Detection
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <span className="gradient-text animate-gradient">
                Smart Fire Risk
              </span>
              <br />
              <span className="text-white drop-shadow-2xl">Detection System</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Experience the future of fire safety with our advanced machine learning algorithms that deliver 
              <span className="text-emerald-400 font-semibold"> unprecedented accuracy</span> and 
              <span className="text-blue-400 font-semibold"> real-time insights</span>.
            </p>
            
            <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 group hover-lift animate-shimmer"
              >
                <ArrowRight className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                Start Your Journey
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 animate-fade-in-up">
              Why Choose <span className="text-emerald-400">EmberGuard</span>?
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Advanced technology meets environmental protection with our comprehensive fire detection ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 stagger-children">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card hover:bg-white/15 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group hover-lift animate-fade-in-up" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className={`p-4 ${feature.bgColor} backdrop-blur-sm rounded-2xl w-fit mx-auto mb-6 border ${feature.borderColor} group-hover:scale-110 transition-all duration-300 animate-float animate-pulse-glow`} style={{ animationDelay: `${index * 0.5}s` }}>
                    <feature.icon className={`h-8 w-8 sm:h-10 sm:w-10 ${feature.color} animate-bounce-gentle`} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16">
          <div className="glass-card p-8 sm:p-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 animate-fade-in-up">
                Proven Excellence in <span className="gradient-text">Fire Protection</span>
              </h2>
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Join thousands of satisfied customers who trust EmberGuard for their safety.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group animate-fade-in-up" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform duration-300 animate-float">
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base text-slate-400 font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 sm:py-16">
          <Card className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20">
            <CardContent className="p-8 sm:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8">
                    Comprehensive <span className="text-emerald-400">Fire Protection</span> Solution
                  </h3>
                  <p className="text-lg text-slate-300 mb-6 sm:mb-8 leading-relaxed">
                    Advanced AI-powered fire detection system providing intelligent monitoring, 
                    real-time alerts, and comprehensive environmental protection for your business.
                  </p>
                  <Button 
                    size="lg" 
                    onClick={() => navigate("/auth")}
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 group"
                  >
                    <ArrowRight className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Get Started Today
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 bg-emerald-500/20 backdrop-blur-sm rounded-lg border border-emerald-400/30 flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                      </div>
                      <span className="text-sm sm:text-base text-white">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="py-8 sm:py-12 text-center border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 backdrop-blur-sm rounded-lg border border-emerald-400/30">
                <Flame className="h-6 w-6 text-emerald-400" />
              </div>
              <span className="text-lg font-semibold text-white">EmberGuard</span>
            </div>
            
            <p className="text-sm text-slate-400">
              © 2025 EmberGuard. Built with ❤️ for better fire protection.
            </p>
            
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock className="h-4 w-4" />
              <span>Always monitoring</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}