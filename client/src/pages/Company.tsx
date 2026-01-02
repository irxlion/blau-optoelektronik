import { useState, useEffect, useRef } from "react";
import { ChevronRight, Target, Lightbulb, Award, Users, Factory, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import ParallaxSection from "@/components/ParallaxSection";

// Counter Component für animierte Zahlen
function Counter({ value, suffix = "", duration = 2000 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            const startTime = Date.now();
            const startValue = 0;
            const endValue = value;

            const animate = () => {
              const now = Date.now();
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              // Easing function für smooth animation
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
              
              setCount(currentValue);

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(endValue);
              }
            };

            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [value, duration, hasAnimated]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-primary mb-2">
      {count}{suffix}
    </div>
  );
}

// Stats Counter Section Component
function StatsCounter({ stats }: { stats: Array<{ number: string; label: string }> }) {
  // Extrahiere Zahlen und Suffixe aus den stat strings
  const parseStat = (statNumber: string) => {
    if (statNumber.includes("%")) {
      return { value: 100, suffix: "%" };
    } else if (statNumber.includes("h")) {
      return { value: 24, suffix: "h" };
    } else {
      const match = statNumber.match(/(\d+)(\+?)/);
      if (match) {
        return { value: parseInt(match[1]), suffix: match[2] || "" };
      }
      return { value: 0, suffix: "" };
    }
  };

  return (
    <section className="py-16 bg-accent">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const { value, suffix } = parseStat(stat.number);
            return (
              <div key={idx} className="text-center">
                <Counter value={value} suffix={suffix} />
                <div className="text-primary font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Company() {
  const { language, t } = useLanguage();
  const isEnglish = language === "en";

  const timeline = t({
    de: [
    {
      year: "1990",
      title: "Gründung",
      description: "BLAU Optoelektronik wird gegründet mit dem Fokus auf Lasermodule für die Medizintechnik."
    },
    {
      year: "2000",
      title: "Expansion",
      description: "Erweiterung des Produktportfolios um industrielle Bildverarbeitungssysteme."
    },
    {
      year: "2010",
      title: "Innovation",
      description: "Entwicklung eigener optischer Sensortechnologien und PSD-Sensoren."
    },
    {
      year: "2019",
      title: "Powelllinsen-Produktion",
      description: "Start der Eigenproduktion von Powelllinsen mit mehreren hundert Einheiten pro Woche."
    },
    {
      year: "2023",
      title: "MVpulse Launch",
      description: "Einführung des revolutionären MVpulse-Lasermoduls mit Augensicherheit und hoher Leistung."
    },
    {
      year: "2026",
      title: "Zukunft",
      description: "Kontinuierliche Innovation und Entwicklung neuer optoelektronischer Lösungen."
    }
    ],
    en: [
      {
        year: "1990",
        title: "Foundation",
        description: "BLAU Optoelectronics is founded with a focus on laser modules for medical technology."
      },
      {
        year: "2000",
        title: "Expansion",
        description: "Portfolio expands to include industrial imaging systems."
      },
      {
        year: "2010",
        title: "Innovation",
        description: "Development of proprietary optical sensor technologies and PSD sensors."
      },
      {
        year: "2019",
        title: "Powell lenses",
        description: "Start of in-house Powell lens production with several hundred units per week."
      },
      {
        year: "2023",
        title: "MVpulse launch",
        description: "Introduction of the groundbreaking MVpulse laser module combining eye safety and high power."
      },
      {
        year: "2026",
        title: "Future",
        description: "Ongoing innovation and development of next-generation optoelectronic solutions."
      }
    ]
  });

  const values = t({
    de: [
    {
      icon: Target,
      title: "Präzision",
      description: "Höchste Genauigkeit in jedem Detail unserer Produkte und Prozesse."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Ständige Weiterentwicklung und Forschung für zukunftsweisende Lösungen."
    },
    {
      icon: Award,
      title: "Qualität",
      description: "Made in Germany - Entwicklung und Fertigung nach höchsten Standards."
    },
    {
      icon: Users,
      title: "Partnerschaft",
      description: "Enge Zusammenarbeit mit unseren Kunden für individuelle Lösungen."
    }
    ],
    en: [
      {
        icon: Target,
        title: "Precision",
        description: "Maximum accuracy in every detail of our products and processes."
      },
      {
        icon: Lightbulb,
        title: "Innovation",
        description: "Continuous improvement and research for forward-looking solutions."
      },
      {
        icon: Award,
        title: "Quality",
        description: "Made in Germany – engineering and production to the highest standards."
      },
      {
        icon: Users,
        title: "Partnership",
        description: "Close collaboration with our customers for truly bespoke solutions."
      }
    ]
  });

  const stats = t({
    de: [
    { number: "30+", label: "Jahre Erfahrung" },
    { number: "500+", label: "Powelllinsen/Woche" },
    { number: "100%", label: "Made in Germany" },
    { number: "24h", label: "Antwortzeit" }
    ],
    en: [
      { number: "30+", label: "Years of experience" },
      { number: "500+", label: "Powell lenses/week" },
      { number: "100%", label: "Made in Germany" },
      { number: "24h", label: "Response time" }
    ]
  });

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
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm mb-4 opacity-90">
              <span>Home</span>
              <ChevronRight className="h-4 w-4" />
              <span>{isEnglish ? "Company" : "Unternehmen"}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {isEnglish ? "About BLAU Optoelectronics" : "Über BLAU Optoelektronik"}
            </h1>
            <p className="text-xl opacity-90">
              {isEnglish
                ? "For more than 30 years we have been developing and manufacturing high-precision optoelectronic components and systems made in Germany."
                : "Seit über 30 Jahren entwickeln und fertigen wir hochpräzise optoelektronische Komponenten und Systeme Made in Germany."}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsCounter stats={stats} />

      {/* Mission Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-foreground">
                {isEnglish ? "Our mission" : "Unsere Mission"}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {isEnglish
                  ? "BLAU Optoelectronics stands for maximum precision and innovation. Our goal is to provide customers with the best solutions for their most demanding applications."
                  : "BLAU Optoelektronik steht für höchste Präzision und Innovation in der Optoelektronik. Unser Ziel ist es, unseren Kunden die besten Lösungen für ihre anspruchsvollsten Anwendungen zu bieten."}
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {isEnglish
                  ? "By working closely with our customers we develop tailor-made products that match their needs exactly, relying on cutting-edge technology and decades of experience."
                  : "Durch enge Zusammenarbeit mit unseren Kunden entwickeln wir maßgeschneiderte Produkte, die exakt auf ihre Bedürfnisse zugeschnitten sind. Dabei setzen wir auf modernste Technologien und jahrzehntelange Erfahrung."}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {isEnglish
                  ? "Made in Germany is more than a promise of quality – it is our commitment to sustainable production and long-term partnerships."
                  : "Made in Germany bedeutet für uns nicht nur ein Qualitätsversprechen, sondern auch Verantwortung für nachhaltige Produktion und langfristige Partnerschaften."}
              </p>
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/1.png"
                alt="BLAU Optoelektronik Fertigungsstätte mit modernsten Fertigungsanlagen"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              {isEnglish ? "Our values" : "Unsere Werte"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isEnglish ? "What drives and distinguishes us" : "Was uns antreibt und auszeichnet"}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <Card key={idx} className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-card-foreground">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              {isEnglish ? "Our story" : "Unsere Geschichte"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isEnglish ? "More than 30 years of innovation and growth" : "Über 30 Jahre Innovation und Wachstum"}
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

              {/* Timeline Items */}
              <div className="space-y-8">
                {timeline.map((item, idx) => (
                  <div key={idx} className="relative flex gap-8">
                    {/* Year Badge */}
                    <div className="flex-shrink-0 w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-sm z-10">
                      {item.year}
                    </div>

                    {/* Content */}
                    <Card className="flex-1 border-border/50 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-card-foreground">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Manufacturing */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-border/50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                  <Factory className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-card-foreground">
                  {isEnglish ? "Manufacturing & location" : "Fertigung & Standort"}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {isEnglish
                    ? "Our modern production site in Germany allows us to meet the highest quality standards with short lead times. Advanced equipment and experienced specialists guarantee precision in every detail."
                    : "Unsere moderne Produktionsstätte in Deutschland ermöglicht uns höchste Qualitätsstandards und kurze Lieferzeiten. Mit modernsten Fertigungsanlagen und erfahrenen Fachkräften garantieren wir Präzision in jedem Detail."}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {isEnglish
                    ? "From development to prototyping and series production – everything from a single source in Germany."
                    : "Von der Entwicklung über die Prototypenfertigung bis zur Serienfertigung - alles aus einer Hand am Standort Deutschland."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-card-foreground">
                  {isEnglish ? "Innovation & future" : "Innovation & Zukunft"}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {isEnglish
                    ? "Continuous research and development are key to our success. We invest in new technologies and work on future-ready solutions for tomorrow’s challenges."
                    : "Kontinuierliche Forschung und Entwicklung sind der Schlüssel zu unserem Erfolg. Wir investieren in neue Technologien und arbeiten an zukunftsweisenden Lösungen für die Herausforderungen von morgen."}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {isEnglish
                    ? "Our innovation pipeline includes new laser modules, enhanced sensing technologies and extended applications for optoelectronics."
                    : "Unsere Innovationspipeline umfasst neue Lasermodule, verbesserte Sensortechnologien und erweiterte Anwendungsmöglichkeiten für die Optoelektronik."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
