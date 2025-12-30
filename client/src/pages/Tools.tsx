import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, LineChart, LogOut } from "lucide-react";
import ParallaxSection from "@/components/ParallaxSection";

export default function Tools() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const isEnglish = language === "en";
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Login-Schutz - prüft customerToken
  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    if (!token) {
      setLocation("/customer-login");
      return;
    }
    setIsAuthenticated(true);
    setLoading(false);
  }, [setLocation]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  const tools = isEnglish
    ? [
        {
          name: "Maximum Power Simulation",
          description: "Calculate maximum laser power for different parameters",
          href: "/tools/maximum-power-simulation",
          icon: Calculator,
        },
        {
          name: "Line Thickness Simulation",
          description: "Calculate line thickness at different focus distances",
          href: "/tools/line-thickness-simulation",
          icon: LineChart,
        },
      ]
    : [
        {
          name: "Maximale Leistung Simulation",
          description: "Maximale Laserleistung für verschiedene Parameter berechnen",
          href: "/tools/maximale-leistung-simulation",
          icon: Calculator,
        },
        {
          name: "Liniendicken Simulation",
          description: "Liniendicke bei verschiedenen Fokusdistanzen berechnen",
          href: "/tools/liniendickensimulation",
          icon: LineChart,
        },
      ];
  
  const pageTitle = isEnglish ? "Tools" : "Tools";
  const pageDescription = isEnglish
    ? "Select a tool to calculate laser parameters"
    : "Wählen Sie ein Tool aus, um Laserparameter zu berechnen";

  const handleLogout = () => {
    localStorage.removeItem("customerToken");
    setLocation("/customer-login");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-24 mt-20 overflow-hidden">
        {/* Background Video with Parallax */}
        <ParallaxSection speed={0.3} className="absolute inset-0 z-0">
          <video
            src="/hearo.mov"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
        </ParallaxSection>

        <div className="container relative z-10">
          <div className="max-w-3xl relative">
            <div className="absolute top-0 right-0">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground backdrop-blur-sm"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isEnglish ? "Logout" : "Abmelden"}
              </Button>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              {pageTitle}
            </h1>
            <p className="text-lg sm:text-xl opacity-90">
              {pageDescription}
            </p>
          </div>
        </div>
      </section>
      
      {/* Tools Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card key={tool.href} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <Icon className="h-8 w-8 text-primary" />
                      <CardTitle className="text-2xl">{tool.name}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={tool.href}>
                      <Button className="w-full">
                        {isEnglish ? "Open Tool" : "Tool öffnen"}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

