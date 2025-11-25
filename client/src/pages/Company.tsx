import { ChevronRight, Target, Lightbulb, Award, Users, Factory, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function Company() {
  const timeline = [
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
      year: "2025",
      title: "Zukunft",
      description: "Kontinuierliche Innovation und Entwicklung neuer optoelektronischer Lösungen."
    }
  ];

  const values = [
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
  ];

  const stats = [
    { number: "30+", label: "Jahre Erfahrung" },
    { number: "500+", label: "Powelllinsen/Woche" },
    { number: "100%", label: "Made in Germany" },
    { number: "24h", label: "Antwortzeit" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-24 mt-20">
        <div className="container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm mb-4 opacity-90">
              <span>Home</span>
              <ChevronRight className="h-4 w-4" />
              <span>Unternehmen</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Über BLAU Optoelektronik
            </h1>
            <p className="text-xl opacity-90">
              Seit über 30 Jahren entwickeln und fertigen wir hochpräzise optoelektronische Komponenten und Systeme Made in Germany.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-accent">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-black mb-2">{stat.number}</div>
                <div className="text-black">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-foreground">Unsere Mission</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                BLAU Optoelektronik steht für höchste Präzision und Innovation in der Optoelektronik. Unser Ziel ist es, unseren Kunden die besten Lösungen für ihre anspruchsvollsten Anwendungen zu bieten.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Durch enge Zusammenarbeit mit unseren Kunden entwickeln wir maßgeschneiderte Produkte, die exakt auf ihre Bedürfnisse zugeschnitten sind. Dabei setzen wir auf modernste Technologien und jahrzehntelange Erfahrung.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Made in Germany bedeutet für uns nicht nur ein Qualitätsversprechen, sondern auch Verantwortung für nachhaltige Produktion und langfristige Partnerschaften.
              </p>
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/manufacturing-facility.jpg"
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
            <h2 className="text-4xl font-bold mb-4 text-foreground">Unsere Werte</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Was uns antreibt und auszeichnet
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
            <h2 className="text-4xl font-bold mb-4 text-foreground">Unsere Geschichte</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Über 30 Jahre Innovation und Wachstum
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
                <h3 className="text-2xl font-bold mb-4 text-card-foreground">Fertigung & Standort</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Unsere moderne Produktionsstätte in Deutschland ermöglicht uns höchste Qualitätsstandards und kurze Lieferzeiten. Mit modernsten Fertigungsanlagen und erfahrenen Fachkräften garantieren wir Präzision in jedem Detail.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Von der Entwicklung über die Prototypenfertigung bis zur Serienfertigung - alles aus einer Hand am Standort Deutschland.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-card-foreground">Innovation & Zukunft</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Kontinuierliche Forschung und Entwicklung sind der Schlüssel zu unserem Erfolg. Wir investieren in neue Technologien und arbeiten an zukunftsweisenden Lösungen für die Herausforderungen von morgen.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Unsere Innovationspipeline umfasst neue Lasermodule, verbesserte Sensortechnologien und erweiterte Anwendungsmöglichkeiten für die Optoelektronik.
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
