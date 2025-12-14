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
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { language, t } = useLanguage();
  const isEnglish = language === "en";

  const products = t({
    de: [
      {
        title: "Machine Vision Lasermodule",
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
    ],
    en: [
      {
        title: "Machine Vision Laser Modules",
        description: "High-precision laser modules for industrial imaging with outstanding accuracy and measurement speed.",
        image: "/product-machine-vision.jpg",
        href: "/produkte/machine-vision",
      },
      {
        title: "Line Lasers",
        description: "High-quality line lasers for precise positioning in demanding applications.",
        image: "/product-line-laser.jpg",
        href: "/produkte/linienlaser",
      },
      {
        title: "Point Lasers",
        description: "Point laser modules with round or elliptical beam profiles for versatile use cases.",
        image: "/product-point-laser.jpg",
        href: "/produkte/punktlaser",
      },
      {
        title: "Powell Lenses",
        description: "In-house manufactured aspheric Powell lenses – several hundred units per week.",
        image: "/product-powell-lens.jpg",
        href: "/produkte/powelllinsen",
      },
      {
        title: "OEM Modules",
        description: "Custom mechanics, optics and electronics tailored to your specifications, even for small batches.",
        image: "/product-oem-module.jpg",
        href: "/produkte/oem-module",
      },
    ],
  });

  const features = t({
    de: [
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
    ],
    en: [
      {
        icon: Award,
        title: "30+ years of experience",
        description: "Proven expertise in designing and manufacturing optoelectronics",
      },
      {
        icon: Zap,
        title: "Maximum precision",
        description: "State-of-the-art production technology for ultimate accuracy",
      },
      {
        icon: Users,
        title: "Customized",
        description: "Tailor-made solutions that match your exact requirements",
      },
      {
        icon: Globe,
        title: "Made in Germany",
        description: "Development and production at our German headquarters",
      },
    ],
  });

  const heroCopy = t({
    de: {
      label: "Präzision in Licht und Optik",
      title: "Optoelektronische Lösungen für höchste Ansprüche",
      description:
        "Seit über 30 Jahren entwickeln und fertigen wir hochpräzise Lasermodule, optische Sensoren und kundenspezifische Optoelektronik für Industrie, Medizintechnik und Forschung.",
      primaryCta: "Produkte entdecken",
      secondaryCta: "Kontakt aufnehmen",
      seoTitle: "BLAU Optoelektronik - Präzise optoelektronische Lösungen",
      seoDescription:
        "Seit über 30 Jahren entwickeln und fertigen wir hochpräzise Lasermodule, optische Sensoren und kundenspezifische Optoelektronik für Industrie, Medizintechnik und Forschung. Made in Germany.",
    },
    en: {
      label: "Precision in light and optics",
      title: "Optoelectronic solutions for the highest demands",
      description:
        "For more than 30 years we have been developing and manufacturing high-precision laser modules, optical sensors and custom optoelectronic systems for industry, medical technology and research.",
      primaryCta: "Explore products",
      secondaryCta: "Contact us",
      seoTitle: "BLAU Optoelectronics – Precision optoelectronic solutions",
      seoDescription:
        "For more than 30 years we have been building high-precision laser modules, optical sensors and custom optoelectronics for industry, medical technology and research – made in Germany.",
    },
  });

  const featuredCopy = t({
    de: {
      pill: "Neues aus der Fertigung",
      headingStrong: "Augensicherheit",
      headingLight: "und",
      headingHighlight: "Hohe Leistung?",
      subheading: "MVpulse!",
      description:
        "Unser MVpulse-Lasermodul verbindet zwei Kriterien der industriellen Bildverarbeitung: Viel Licht mit Ausgangsleistungen bis 100 mW und Augensicherheit nach Laserklasse 2.",
      button: "Zum MVpulse",
    },
    en: {
      pill: "Manufacturing update",
      headingStrong: "Eye safety",
      headingLight: "and",
      headingHighlight: "high performance?",
      subheading: "MVpulse!",
      description:
        "Our MVpulse laser module combines two crucial criteria for industrial imaging: plenty of light with output power up to 100 mW and laser class 2 eye safety.",
      button: "Discover MVpulse",
    },
  });

  const productSectionCopy = t({
    de: {
      heading: "Unsere Produktkategorien",
      description: "Hochpräzise optoelektronische Komponenten für anspruchsvolle Anwendungen",
    },
    en: {
      heading: "Our product categories",
      description: "High-precision optoelectronic components for demanding applications",
    },
  });

  const featuresSectionCopy = t({
    de: {
      heading: "Warum BLAU Optoelektronik?",
      description: "Ihr Partner für präzise optoelektronische Lösungen",
    },
    en: {
      heading: "Why BLAU Optoelektronik?",
      description: "Your partner for precise optoelectronic solutions",
    },
  });

  const ctaCopy = t({
    de: {
      heading: "Bereit für Ihre individuelle Lösung?",
      description:
        "Kontaktieren Sie uns für eine persönliche Beratung zu Ihrem Projekt. Unser Expertenteam steht Ihnen zur Verfügung.",
      button: "Jetzt Kontakt aufnehmen",
    },
    en: {
      heading: "Ready for your custom solution?",
      description:
        "Reach out for personal consulting on your project. Our team of experts is here to support you.",
      button: "Talk to us today",
    },
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BLAU Optoelektronik",
    description: isEnglish
      ? "High-precision optoelectronic solutions made in Germany"
      : "Hochpräzise optoelektronische Lösungen Made in Germany",
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
      <SEO title={heroCopy.seoTitle} description={heroCopy.seoDescription} structuredData={structuredData} />
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
              {heroCopy.label}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {heroCopy.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">{heroCopy.description}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/produkte">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8">
                  {heroCopy.primaryCta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/kontakt">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8">
                  {heroCopy.secondaryCta}
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
              <div className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ color: 'oklch(0.98 0 0)', backgroundColor: 'oklab(0.35 -0.0507142 -0.108757 / 0.9)' }}>
                {featuredCopy.pill}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-accent-foreground">
                {featuredCopy.headingStrong} <span className="text-muted-foreground">{featuredCopy.headingLight}</span> {featuredCopy.headingHighlight}
              </h2>
              <h3 className="text-3xl font-bold text-secondary mb-6" style={{ color: 'oklch(0.98 0 0)' }}>{featuredCopy.subheading}</h3>
              <p className="text-lg text-muted-foreground mb-6">{featuredCopy.description}</p>
              <Link href="/produkte/mvpulse">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  {featuredCopy.button}
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{productSectionCopy.heading}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{productSectionCopy.description}</p>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{featuresSectionCopy.heading}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{featuresSectionCopy.description}</p>
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
            {ctaCopy.heading}
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {ctaCopy.description}
          </p>
          <Link href="/kontakt">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8">
              {ctaCopy.button}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
