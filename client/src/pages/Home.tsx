import { Link } from "wouter";
import { ArrowRight, Zap, Award, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ParallaxSection from "@/components/ParallaxSection";
import AnimatedIcon from "@/components/AnimatedIcon";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";

export default function Home() {
  const products = [
    {
      title: "Machine Vision",
      description: "Hochpräzise Lasermodule für industrielle Bildverarbeitung mit optimaler Genauigkeit und Messgeschwindigkeit.",
      image: "/product-machine-vision.jpg",
      href: "/produkte/machine-vision",
    },
    {
      title: "Linienlaser",
      description: "Präzise Positionierung durch hochwertige Linienlaser für anspruchsvolle Anwendungen.",
      image: "/product-line-laser.jpg",
      href: "/produkte/linienlaser",
    },
    {
      title: "Punktlaser",
      description: "Punktlaser-Module mit rundem oder elliptischem Strahlprofil für vielfältige Einsatzbereiche.",
      image: "/product-point-laser.jpg",
      href: "/produkte/punktlaser",
    },
    {
      title: "Powelllinsen",
      description: "Asphärische Powelllinsen in Eigenproduktion - mehrere hundert Einheiten pro Woche.",
      image: "/product-powell-lens.jpg",
      href: "/produkte/powelllinsen",
    },
    {
      title: "OEM Module",
      description: "Kundenspezifische Mechaniken, Optik und Elektronik nach Ihren Anforderungen, auch in Kleinserien.",
      image: "/product-oem-module.jpg",
      href: "/produkte/oem-module",
    },
  ];

  const features = [
    {
      icon: Award,
      title: "30+ Jahre Erfahrung",
      description: "Bewährte Expertise in der Entwicklung und Fertigung von Optoelektronik",
    },
    {
      icon: Zap,
      title: "Höchste Präzision",
      description: "Modernste Fertigungstechnologie für maximale Genauigkeit",
    },
    {
      icon: Users,
      title: "Kundenspezifisch",
      description: "Individuelle Lösungen nach Ihren exakten Anforderungen",
    },
    {
      icon: Globe,
      title: "Made in Germany",
      description: "Entwicklung und Produktion am Standort Deutschland",
    },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BLAU Optoelektronik",
    description: "Hochpräzise optoelektronische Lösungen Made in Germany",
    url: "https://www.blau-optoelektronik.de",
    logo: "https://www.blau-optoelektronik.de/logo-blau.png",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["German", "English"],
    },
    sameAs: [],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="BLAU Optoelektronik - Präzise optoelektronische Lösungen"
        description="Seit über 30 Jahren entwickeln und fertigen wir hochpräzise Lasermodule, optische Sensoren und kundenspezifische Optoelektronik für Industrie, Medizintechnik und Forschung. Made in Germany."
        structuredData={structuredData}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <ParallaxSection speed={0.3} className="absolute inset-0 z-0">
          <img
            src="/hero-laser-tech.jpg"
            alt="Laser Technology"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
        </ParallaxSection>

        {/* Content */}
        <div className="container relative z-10 text-primary-foreground py-32">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 bg-secondary/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              Präzision in Licht und Optik
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Optoelektronische Lösungen für höchste Ansprüche
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Seit über 30 Jahren entwickeln und fertigen wir hochpräzise Lasermodule, optische Sensoren und kundenspezifische Optoelektronik für Industrie, Medizintechnik und Forschung.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/produkte">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8">
                  Produkte entdecken
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/kontakt">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8">
                  Kontakt aufnehmen
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-primary-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Featured Product - MVpulse */}
      <section className="py-20 bg-accent">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="/product-machine-vision.jpg"
                alt="MVpulse Laser Module"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4" style={{color: 'oklch(0.98 0 0)', backgroundColor: 'oklab(0.35 -0.0507142 -0.108757 / 0.9)'}}>
                Neues aus der Fertigung
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-accent-foreground">
                Augensicherheit <span className="text-muted-foreground">und</span> Hohe Leistung?
              </h2>
              <h3 className="text-3xl font-bold text-secondary mb-6" style={{color: 'oklch(0.98 0 0)'}}>MVpulse!</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Unser MVpulse-Lasermodul verbindet zwei Kriterien der industriellen Bildverarbeitung: Viel Licht mit Ausgangsleistungen bis 100 mW und Augensicherheit nach Laserklasse 2.
              </p>
              <Link href="/produkte/mvpulse">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Zum MVpulse
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Unsere Produktkategorien</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hochpräzise optoelektronische Komponenten für anspruchsvolle Anwendungen
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.href} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Warum BLAU Optoelektronik?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ihr Partner für präzise optoelektronische Lösungen
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              return (
                <motion.div
                  key={index}
                  className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                    <AnimatedIcon
                      icon={feature.icon}
                      size={24}
                      animationType={index % 2 === 0 ? "pulse" : "float"}
                      className="text-secondary"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-card-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Bereit für Ihre individuelle Lösung?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Kontaktieren Sie uns für eine persönliche Beratung zu Ihrem Projekt. Unser Expertenteam steht Ihnen zur Verfügung.
          </p>
          <Link href="/kontakt">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8">
              Jetzt Kontakt aufnehmen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
