import { ChevronRight, Heart, Cog, Cpu, Microscope, Factory } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Industries() {
  const { language, t } = useLanguage();
  const isEnglish = language === "en";

  const industries = t({
    de: [
      {
        icon: Heart,
        title: "Medizintechnik",
        description: "Präzise Lasermodule und optische Sensoren für medizinische Diagnostik und Therapie",
        applications: [
          "Laser für medizinische Bildgebung",
          "Optische Kohärenztomographie (OCT)",
          "Spektroskopie für Gewebeanalyse",
          "Positionssensoren für chirurgische Roboter",
          "Augensichere Lasermodule für Patientenumgebungen"
        ],
        products: ["MVpulse", "Punktlaser", "OEM Module"],
        image: "/industry-medical-tech.jpg"
      },
      {
        icon: Cog,
        title: "Maschinenbau",
        description: "Robuste Lösungen für industrielle Fertigungs- und Produktionsanlagen",
        applications: [
          "Positionierung und Ausrichtung",
          "Dimensionsmessung von Werkstücken",
          "Schweißnahtführung",
          "Kantenerfassung",
          "Oberflächeninspektion"
        ],
        products: ["Linienlaser", "Punktlaser", "OEM Module"],
        image: "/manufacturing-facility.jpg"
      },
      {
        icon: Factory,
        title: "Automatisierungstechnik",
        description: "Hochgeschwindigkeits-Sensoren für moderne Automatisierungsprozesse",
        applications: [
          "Industrielle Bildverarbeitung",
          "Qualitätskontrolle in Echtzeit",
          "Roboterführung und -navigation",
          "Objekterkennung und -tracking",
          "Barcode- und Schriftlesung"
        ],
        products: ["Machine Vision", "MVpulse", "Linienlaser"],
        image: "/hero-laser-tech.jpg"
      },
      {
        icon: Microscope,
        title: "Forschung & Entwicklung",
        description: "Flexible Lösungen für wissenschaftliche Anwendungen und Laborumgebungen",
        applications: [
          "Spektroskopie und Materialanalyse",
          "Optische Messtechnik",
          "Laser-Doppler-Anemometrie",
          "Holographie",
          "Quantenoptik-Experimente"
        ],
        products: ["Punktlaser", "OEM Module", "Powelllinsen"],
        image: "/technology-optical-sensors.jpg"
      },
      {
        icon: Cpu,
        title: "Mikroelektronik",
        description: "Präzisionslösungen für Halbleiterfertigung und Elektronikproduktion",
        applications: [
          "Wafer-Inspektion",
          "Chip-Positionierung",
          "Lötstellen-Kontrolle",
          "Leiterplatten-Prüfung",
          "Bonddraht-Inspektion"
        ],
        products: ["Machine Vision", "Punktlaser", "OEM Module"],
        image: "/product-oem-module.jpg"
      }
    ],
    en: [
      {
        icon: Heart,
        title: "Medical technology",
        description: "Precision laser modules and optical sensors for medical diagnostics and therapy",
        applications: [
          "Lasers for medical imaging",
          "Optical coherence tomography (OCT)",
          "Spectroscopy for tissue analysis",
          "Position sensors for surgical robots",
          "Eye-safe modules for patient environments"
        ],
        products: ["MVpulse", "Point lasers", "OEM modules"],
        image: "/industry-medical-tech.jpg"
      },
      {
        icon: Cog,
        title: "Mechanical engineering",
        description: "Rugged solutions for industrial manufacturing and production equipment",
        applications: [
          "Positioning and alignment",
          "Dimensional measurement of workpieces",
          "Weld seam guidance",
          "Edge detection",
          "Surface inspection"
        ],
        products: ["Line lasers", "Point lasers", "OEM modules"],
        image: "/manufacturing-facility.jpg"
      },
      {
        icon: Factory,
        title: "Automation technology",
        description: "High-speed sensors for modern automation processes",
        applications: [
          "Industrial imaging",
          "Real-time quality control",
          "Robot guidance and navigation",
          "Object detection and tracking",
          "Barcode and character reading"
        ],
        products: ["Machine Vision", "MVpulse", "Line lasers"],
        image: "/hero-laser-tech.jpg"
      },
      {
        icon: Microscope,
        title: "Research & development",
        description: "Flexible solutions for scientific applications and laboratory environments",
        applications: [
          "Spectroscopy and material analysis",
          "Optical metrology",
          "Laser Doppler anemometry",
          "Holography",
          "Quantum optics experiments"
        ],
        products: ["Point lasers", "OEM modules", "Powell lenses"],
        image: "/technology-optical-sensors.jpg"
      },
      {
        icon: Cpu,
        title: "Microelectronics",
        description: "Precision solutions for semiconductor manufacturing and electronics production",
        applications: [
          "Wafer inspection",
          "Chip positioning",
          "Solder joint control",
          "PCB inspection",
          "Bond wire inspection"
        ],
        products: ["Machine Vision", "Point lasers", "OEM modules"],
        image: "/product-oem-module.jpg"
      }
    ]
  });

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
              <span>{isEnglish ? "Industries" : "Branchen"}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {isEnglish ? "Industries & applications" : "Branchen & Anwendungen"}
            </h1>
            <p className="text-xl opacity-90">
              {isEnglish
                ? "Our optoelectronic solutions power a wide range of industries and application areas."
                : "Unsere optoelektronischen Lösungen finden Einsatz in den unterschiedlichsten Branchen und Anwendungsbereichen."}
            </p>
          </div>
        </div>
      </section>

      {/* Industries Overview */}
      <section className="py-20">
        <div className="container">
          <div className="space-y-20">
            {industries.map((industry, idx) => {
              const Icon = industry.icon;
              const isEven = idx % 2 === 0;
              
              return (
                <div key={idx} className="scroll-mt-20">
                  <div className={`grid lg:grid-cols-2 gap-12 items-start ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                    <div className={isEven ? '' : 'lg:order-2'}>
                      <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                        <Icon className="h-8 w-8 text-secondary" />
                      </div>
                      <h2 className="text-3xl font-bold mb-4 text-foreground">{industry.title}</h2>
                      <p className="text-lg text-muted-foreground mb-6">{industry.description}</p>

                      {/* Applications */}
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 text-foreground">
                          {isEnglish ? "Typical applications" : "Typische Anwendungen"}
                        </h3>
                        <ul className="space-y-3">
                          {industry.applications.map((app, appIdx) => (
                            <li key={appIdx} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                              <span className="text-foreground">{app}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Relevant Products */}
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-4 text-foreground">
                          {isEnglish ? "Recommended products" : "Passende Produkte"}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {industry.products.map((product, prodIdx) => (
                            <span
                              key={prodIdx}
                              className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium"
                            >
                              {product}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link href="/kontakt">
                        <Button className="bg-primary hover:bg-primary/90">
                          Beratung anfragen
                        </Button>
                      </Link>
                    </div>

                    <div className={`relative ${isEven ? '' : 'lg:order-1'}`}>
                      <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
                        <img
                          src={industry.image}
                          alt={industry.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  {idx < industries.length - 1 && (
                    <div className="mt-20 border-t border-border" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-accent-foreground">
            {isEnglish ? "Is your industry missing?" : "Ihre Branche ist nicht dabei?"}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {isEnglish
              ? "We also develop bespoke solutions for specialised use cases. Contact us for individual consulting."
              : "Wir entwickeln auch kundenspezifische Lösungen für spezielle Anwendungsfälle. Kontaktieren Sie uns für eine individuelle Beratung."}
          </p>
          <Link href="/kontakt">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              {isEnglish ? "Get in touch" : "Jetzt Kontakt aufnehmen"}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
