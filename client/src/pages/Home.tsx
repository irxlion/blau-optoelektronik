import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Zap, Award, Users, Globe, Factory, Microscope, Cog, Shield, Clock, TrendingUp, CheckCircle2, Sparkles, Layers, Gauge, Rocket, Target, BarChart3, HeartHandshake, Heart, Cpu, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ParallaxSection from "@/components/ParallaxSection";
import AnimatedIcon from "@/components/AnimatedIcon";
import SEO from "@/components/SEO";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/data/products";

export default function Home() {
  const { language, t } = useLanguage();
  const isEnglish = language === "en";

  // Produkte (aus dem Dashboard "Produkte" gepflegt) für die Startseite laden.
  // Ziel: Startseite zeigt nur Produkte, die im Dashboard angelegt/hochgeladen wurden.
  const [productsByLang, setProductsByLang] = useState<{ de: Product[]; en: Product[] }>({ de: [], en: [] });
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setProductsLoading(true);
      try {
        const data = await fetchProducts();
        if (!cancelled) setProductsByLang({ de: data.de || [], en: data.en || [] });
      } catch (e) {
        console.error("Fehler beim Laden der Produkte (Startseite):", e);
        if (!cancelled) setProductsByLang({ de: [], en: [] });
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const getProductHref = (product: Product) => {
    // Eigene Route für die Machine-Vision-Seite
    if (product.id === "machine-vision") {
      // #region agent log
      if (typeof window !== "undefined") {
        const w = window as any;
        if (!w.__dbg_home_machine_vision_href) {
          w.__dbg_home_machine_vision_href = true;
          fetch("http://127.0.0.1:7242/ingest/11ad90a2-7433-4ef9-b753-18907f0bce0b", {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify({
              sessionId: "debug-session",
              runId: "pre-fix",
              hypothesisId: "A",
              location: "Home.tsx:getProductHref",
              message: "Home machine-vision href computed",
              data: { productId: product.id, href: "/produkte/machine-vision" },
              timestamp: Date.now(),
            }),
          }).catch(() => {});
        }
      }
      // #endregion
      return "/produkte/machine-vision";
    }
    return `/produkte/${product.id}`;
  };

  const getProductImage = (product: Product): string => {
    const mainImage = product.image;
    if (mainImage) return mainImage;

    const imageMap: Record<string, string> = {
      "Machine Vision Lasermodule": "/product-machine-vision.jpg",
      "Linienlaser": "/product-line-laser.jpg",
      "Punktlaser": "/product-point-laser.jpg",
      "Powelllinsen": "/product-powell-lens.jpg",
      "OEM Module": "/product-oem-module.jpg",
    };
    const mapped = imageMap[product.category];
    if (!mapped && language === "en") {
      // #region agent log
      if (typeof window !== "undefined") {
        const w = window as any;
        const key = `__dbg_home_img_miss_${product.category || "unknown"}`;
        if (!w[key]) {
          w[key] = true;
          fetch("http://127.0.0.1:7242/ingest/11ad90a2-7433-4ef9-b753-18907f0bce0b", {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify({
              sessionId: "debug-session",
              runId: "pre-fix",
              hypothesisId: "B",
              location: "Home.tsx:getProductImage",
              message: "Image map miss (EN) -> fallback",
              data: { category: product.category, productId: product.id, fallback: "/product-machine-vision.jpg" },
              timestamp: Date.now(),
            }),
          }).catch(() => {});
        }
      }
      // #endregion
    }
    return mapped || "/product-machine-vision.jpg";
  };

  // Wir nehmen die Reihenfolge der API und begrenzen auf 6 Karten.
  const homeProductCards = (productsByLang[language] || []).slice(0, 6).map((p) => ({
    title: p.name,
    description: p.description || p.longDescription || p.category,
    image: getProductImage(p),
    href: getProductHref(p),
  }));

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

  const stats = t({
    de: [
      { number: "30+", label: "Jahre Erfahrung", icon: Award },
      { number: "500+", label: "Powelllinsen/Woche", icon: TrendingUp },
      { number: "100%", label: "Made in Germany", icon: Shield },
      { number: "24h", label: "Antwortzeit", icon: Clock },
    ],
    en: [
      { number: "30+", label: "Years of experience", icon: Award },
      { number: "500+", label: "Powell lenses/week", icon: TrendingUp },
      { number: "100%", label: "Made in Germany", icon: Shield },
      { number: "24h", label: "Response time", icon: Clock },
    ],
  });

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
    ],
  });

  const technologies = t({
    de: [
      {
        title: "Eigenproduktion Powelllinsen",
        description: "Mehrere hundert Einheiten pro Woche in unserem deutschen Werk",
      },
      {
        title: "Klassenkonforme Lasermodule",
        description: "Augensichere Lösungen nach Laserklasse 2 für sichere Anwendungen",
      },
      {
        title: "Maßgeschneiderte OEM-Lösungen",
        description: "Von der Entwicklung bis zur Serienfertigung aus einer Hand",
      },
      {
        title: "ISO 9001 zertifiziert",
        description: "Höchste Qualitätsstandards in Entwicklung und Fertigung",
      },
    ],
    en: [
      {
        title: "In-house Powell lens production",
        description: "Several hundred units per week at our German facility",
      },
      {
        title: "Class-compliant laser modules",
        description: "Eye-safe solutions according to laser class 2 for safe applications",
      },
      {
        title: "Custom OEM solutions",
        description: "From development to series production from a single source",
      },
      {
        title: "ISO 9001 certified",
        description: "Highest quality standards in development and manufacturing",
      },
    ],
  });

  const process = t({
    de: [
      {
        step: "01",
        icon: HeartHandshake,
        title: "Beratung",
        description: "Wir analysieren Ihre Anforderungen und entwickeln gemeinsam die optimale Lösung",
      },
      {
        step: "02",
        icon: Sparkles,
        title: "Entwicklung",
        description: "Unser Expertenteam entwickelt maßgeschneiderte Optoelektronik für Ihr Projekt",
      },
      {
        step: "03",
        icon: Factory,
        title: "Fertigung",
        description: "Hochpräzise Produktion in unserem deutschen Werk nach höchsten Qualitätsstandards",
      },
      {
        step: "04",
        icon: CheckCircle2,
        title: "Support",
        description: "Langfristige Betreuung und Support für Ihre optoelektronischen Lösungen",
      },
    ],
    en: [
      {
        step: "01",
        icon: HeartHandshake,
        title: "Consulting",
        description: "We analyze your requirements and develop the optimal solution together",
      },
      {
        step: "02",
        icon: Sparkles,
        title: "Development",
        description: "Our expert team develops custom optoelectronics for your project",
      },
      {
        step: "03",
        icon: Factory,
        title: "Manufacturing",
        description: "High-precision production at our German facility to the highest quality standards",
      },
      {
        step: "04",
        icon: CheckCircle2,
        title: "Support",
        description: "Long-term support and service for your optoelectronic solutions",
      },
    ],
  });

  const whyChooseUs = t({
    de: [
      {
        icon: Target,
        title: "Höchste Präzision",
        description: "Millimeter-genaue Fertigung für perfekte Ergebnisse in jeder Anwendung",
      },
      {
        icon: Rocket,
        title: "Innovation",
        description: "Kontinuierliche Weiterentwicklung und Forschung für zukunftsweisende Technologien",
      },
      {
        icon: Shield,
        title: "Zuverlässigkeit",
        description: "Langzeitstabile Produkte mit hervorragender Qualität und Lebensdauer",
      },
      {
        icon: Users,
        title: "Partnerschaft",
        description: "Enge Zusammenarbeit und individuelle Betreuung für Ihren Erfolg",
      },
      {
        icon: Gauge,
        title: "Kurze Lieferzeiten",
        description: "Effiziente Prozesse für schnelle Reaktionszeiten und pünktliche Lieferung",
      },
      {
        icon: Award,
        title: "Qualität",
        description: "Made in Germany - Entwicklung und Fertigung nach höchsten Standards",
      },
    ],
    en: [
      {
        icon: Target,
        title: "Highest Precision",
        description: "Millimeter-accurate manufacturing for perfect results in every application",
      },
      {
        icon: Rocket,
        title: "Innovation",
        description: "Continuous development and research for cutting-edge technologies",
      },
      {
        icon: Shield,
        title: "Reliability",
        description: "Long-term stable products with excellent quality and lifespan",
      },
      {
        icon: Users,
        title: "Partnership",
        description: "Close collaboration and individual support for your success",
      },
      {
        icon: Gauge,
        title: "Fast Delivery",
        description: "Efficient processes for quick response times and on-time delivery",
      },
      {
        icon: Award,
        title: "Quality",
        description: "Made in Germany - development and manufacturing to the highest standards",
      },
    ],
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
      <section className="py-20 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{productSectionCopy.heading}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{productSectionCopy.description}</p>
          </motion.div>
          {productsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : homeProductCards.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                {isEnglish ? "No products available yet." : "Noch keine Produkte verfügbar."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {homeProductCards.map((product, index) => (
                  <motion.div
                    key={product.href}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <ProductCard {...product} />
                  </motion.div>
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link href="/produkte">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    {isEnglish ? "View all products" : "Alle Produkte ansehen"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-primary-foreground/10 rounded-full flex items-center justify-center">
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </motion.div>
              );
            })}
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

      {/* Industries Section */}
      <section className="py-20 bg-muted">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {isEnglish ? "Industries We Serve" : "Branchen, die wir bedienen"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isEnglish
                ? "Our optoelectronic solutions power innovation across diverse industries"
                : "Unsere optoelektronischen Lösungen treiben Innovation in verschiedenen Branchen voran"}
            </p>
          </motion.div>
          
          <div className="space-y-20">
            {industries.map((industry, idx) => {
              const Icon = industry.icon;
              const isEven = idx % 2 === 0;
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="scroll-mt-20"
                >
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
                          {isEnglish ? "Request consultation" : "Beratung anfragen"}
                        </Button>
                      </Link>
                    </div>

                    <div className={`relative ${isEven ? '' : 'lg:order-1'}`}>
                      <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
                        <img
                          src={industry.image}
                          alt={industry.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  {idx < industries.length - 1 && (
                    <div className="mt-20 border-t border-border" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Highlights */}
      <section className="py-20 bg-gradient-to-b from-muted to-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {isEnglish ? "Technology Highlights" : "Technologie-Highlights"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isEnglish
                ? "Our core competencies and manufacturing capabilities"
                : "Unsere Kernkompetenzen und Fertigungsfähigkeiten"}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4 p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow"
              >
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-card-foreground">{tech.title}</h3>
                  <p className="text-muted-foreground">{tech.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {isEnglish ? "How We Work" : "Unser Prozess"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isEnglish
                ? "From initial consultation to long-term support - your success is our mission"
                : "Von der ersten Beratung bis zum langfristigen Support - Ihr Erfolg ist unser Auftrag"}
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-secondary/30 via-secondary/50 to-secondary/30 z-0" />
            
            {process.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative z-10"
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-secondary/50 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-8 text-center relative">
                      <motion.div
                        className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {item.step}
                      </motion.div>
                      <div className="mt-8 mb-6 flex justify-center">
                        <motion.div
                          className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Icon className="h-8 w-8 text-secondary" />
                        </motion.div>
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-card-foreground">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-b from-muted via-background to-muted">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {isEnglish ? "Why Choose BLAU Optoelectronics?" : "Warum BLAU Optoelektronik?"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isEnglish
                ? "Six reasons that make us your ideal partner for optoelectronic solutions"
                : "Sechs Gründe, die uns zu Ihrem idealen Partner für optoelektronische Lösungen machen"}
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full border-2 hover:border-secondary/50 hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <motion.div
                        className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-4"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="h-7 w-7 text-secondary" />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-3 text-card-foreground">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary to-primary/90" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {/* Large animated circles */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-secondary/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 150, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/40 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.4, 1],
              x: [0, -150, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/30 to-primary" />
          
          {/* Diagonal stripes pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)",
            }}
          />
          
          {/* Mesh gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
        </div>
        
        {/* Text color override */}
        <div className="relative z-10 text-primary-foreground">

        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="inline-block px-6 py-3 bg-secondary/20 backdrop-blur-sm rounded-full text-sm font-medium border border-primary-foreground/20">
              {isEnglish ? "Let's work together" : "Gemeinsam zum Erfolg"}
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            {ctaCopy.heading}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed"
          >
            {ctaCopy.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/kontakt">
                <Button 
                  size="lg" 
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-10 py-7 group shadow-2xl relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    {ctaCopy.button}
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    animate={{
                      x: ["-200%", "200%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/produkte">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground text-lg px-10 py-7 backdrop-blur-sm bg-primary/50"
                >
                  {isEnglish ? "Explore Products" : "Produkte entdecken"}
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 pt-12 border-t border-primary-foreground/20"
          >
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <span>{isEnglish ? "30+ Years Experience" : "30+ Jahre Erfahrung"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <span>{isEnglish ? "Made in Germany" : "Made in Germany"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <span>{isEnglish ? "ISO 9001 Certified" : "ISO 9001 Zertifiziert"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <span>{isEnglish ? "Quick Response" : "Schnelle Antwort"}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-secondary/60 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      </section>

      <Footer />
    </div>
  );
}
