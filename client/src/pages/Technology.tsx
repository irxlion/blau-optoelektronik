import { ChevronRight, Zap, Eye, Layers, Gauge } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import ParallaxSection from "@/components/ParallaxSection";

export default function Technology() {
  const { language, t } = useLanguage();
  const isEnglish = language === "en";

  const technologies = t({
    de: [
      {
        icon: Zap,
        title: "Lasertechnologie",
        description: "Hochpräzise Laserdioden und -module für verschiedenste Anwendungen",
        details: [
          "Wellenlängen von 405 nm bis 850 nm",
          "Ausgangsleistungen von 1 mW bis 200 mW",
          "TEM00 Strahlqualität",
          "Langzeitstabilität durch aktive Regelung"
        ],
        image: "/hero-laser-tech.jpg"
      },
      {
        icon: Eye,
        title: "Optische Sensorik",
        description: "Präzise Sensoren für Positions-, Abstands- und Geradheitsmessung",
        details: [
          "PSD-Sensoren (Position Sensitive Detector)",
          "Triangulationssensoren",
          "Konfokale Sensoren",
          "Optische Abstandsmesser"
        ],
        image: "/technology-optical-sensors.jpg"
      },
      {
        icon: Layers,
        title: "Powelllinsen-Technologie",
        description: "Asphärische Präzisionsoptik für gleichmäßige Linienprojektion",
        details: [
          "Eigenproduktion seit 2019",
          "Gleichmäßige Intensitätsverteilung",
          "Verschiedene Öffnungswinkel",
          "Kundenspezifische Anfertigungen"
        ],
        image: "/powelllinsen3 - Kopie.jpg"
      },
      {
        icon: Gauge,
        title: "MVpulse-Technologie",
        description: "Innovative gepulste Lasertechnologie für Augensicherheit bei hoher Leistung",
        details: [
          "Laserklasse 2 (augensicher)",
          "Bis zu 100 mW mittlere Leistung",
          "Gepulster Betrieb mit variabler Frequenz",
          "Optimiert für Machine Vision"
        ],
        image: "/MVpico1 - Kopie.jpg"
      }
    ],
    en: [
      {
        icon: Zap,
        title: "Laser technology",
        description: "High-precision laser diodes and modules for a wide range of applications",
        details: [
          "Wavelengths from 405 nm to 850 nm",
          "Output power from 1 mW to 200 mW",
          "TEM00 beam quality",
          "Long-term stability via active control"
        ],
        image: "/hero-laser-tech.jpg"
      },
      {
        icon: Eye,
        title: "Optical sensing",
        description: "Precision sensors for position, distance and straightness measurements",
        details: [
          "PSD sensors (position sensitive detectors)",
          "Triangulation sensors",
          "Confocal sensors",
          "Optical distance measurement"
        ],
        image: "/technology-optical-sensors.jpg"
      },
      {
        icon: Layers,
        title: "Powell lens technology",
        description: "Aspheric precision optics for uniform line projection",
        details: [
          "In-house production since 2019",
          "Uniform intensity distribution",
          "Multiple opening angles",
          "Custom fabrication available"
        ],
        image: "/powelllinsen3 - Kopie.jpg"
      },
      {
        icon: Gauge,
        title: "MVpulse technology",
        description: "Innovative pulsed laser technology delivering eye safety at high power",
        details: [
          "Laser class 2 (eye-safe)",
          "Up to 100 mW average output",
          "Pulsed operation with variable frequency",
          "Optimised for machine vision"
        ],
        image: "/MVpico1 - Kopie.jpg"
      }
    ]
  });

  const principles = t({
    de: [
      {
        title: "Triangulation",
        description: "Berührungslose Abstandsmessung durch Winkelmessung des reflektierten Laserstrahls auf einem Positionssensor."
      },
      {
        title: "Konfokale Messtechnik",
        description: "Hochpräzise Oberflächenmessung durch chromatische Aberration und Fokuslagenerkennung."
      },
      {
        title: "PSD-Technologie",
        description: "Position Sensitive Detectors ermöglichen präzise Positionsbestimmung von Lichtpunkten mit hoher Auflösung."
      },
      {
        title: "Laserklassen",
        description: "Einhaltung internationaler Sicherheitsstandards von Klasse 1 (völlig sicher) bis Klasse 3B (hohe Leistung)."
      }
    ],
    en: [
      {
        title: "Triangulation",
        description: "Non-contact distance measurement via angular detection of the reflected laser beam on a position sensor."
      },
      {
        title: "Confocal metrology",
        description: "High-precision surface measurements using chromatic aberration and focus position detection."
      },
      {
        title: "PSD technology",
        description: "Position Sensitive Detectors enable precise determination of light spot positions with high resolution."
      },
      {
        title: "Laser classes",
        description: "Compliance with international safety standards from class 1 (completely safe) to class 3B (high power)."
      }
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
              <span>{isEnglish ? "Technology" : "Technologie"}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {isEnglish ? "Our technologies" : "Unsere Technologien"}
            </h1>
            <p className="text-xl opacity-90">
              {isEnglish
                ? "Innovative optoelectronic solutions built on state-of-the-art technology and decades of experience."
                : "Innovative optoelektronische Lösungen basierend auf modernster Technologie und jahrzehntelanger Erfahrung."}
            </p>
          </div>
        </div>
      </section>

      {/* Technology Overview */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              {isEnglish ? "Core technologies" : "Kerntechnologien"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isEnglish ? "Precision through innovation – our technological focus areas" : "Präzision durch Innovation - unsere technologischen Schwerpunkte"}
            </p>
          </div>

          <div className="space-y-16">
            {technologies.map((tech, idx) => {
              const Icon = tech.icon;
              const isEven = idx % 2 === 0;
              
              return (
                <div key={idx} className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={isEven ? '' : 'lg:order-2'}>
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                      <Icon className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-foreground">{tech.title}</h3>
                    <p className="text-lg text-muted-foreground mb-6">{tech.description}</p>
                    <ul className="space-y-3">
                      {tech.details.map((detail, detailIdx) => (
                        <li key={detailIdx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`relative aspect-video rounded-xl overflow-hidden shadow-2xl ${isEven ? '' : 'lg:order-1'}`}>
                    <img
                      src={tech.image}
                      alt={tech.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Measurement Principles */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              {isEnglish ? "Measurement principles" : "Messverfahren & Funktionsprinzipien"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isEnglish ? "Foundations of our measurement technologies" : "Grundlagen unserer Messtechnologien"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {principles.map((principle, idx) => (
              <Card key={idx} className="border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-card-foreground">{principle.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Advantages */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-foreground">
                {isEnglish ? "Technological advantages" : "Technologische Vorteile"}
              </h2>
              <div className="space-y-6">
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                      {isEnglish ? "Maximum precision" : "Höchste Präzision"}
                    </h3>
                    <p className="text-muted-foreground">
                      {isEnglish
                        ? "Advanced production technology and precise calibration enable accuracies down to the micrometre range."
                        : "Durch modernste Fertigungstechnologie und präzise Kalibrierung erreichen wir Genauigkeiten im Mikrometerbereich."}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                      {isEnglish ? "Long-term stability" : "Langzeitstabilität"}
                    </h3>
                    <p className="text-muted-foreground">
                      {isEnglish
                        ? "Active temperature control and premium components guarantee consistent performance for years."
                        : "Aktive Temperaturregelung und hochwertige Komponenten garantieren konstante Leistung über Jahre."}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                      {isEnglish ? "Custom adaptations" : "Kundenspezifische Anpassung"}
                    </h3>
                    <p className="text-muted-foreground">
                      {isEnglish
                        ? "Flexible technology platforms enable individual adaptations to your specific requirements."
                        : "Flexible Technologieplattformen ermöglichen individuelle Anpassungen an spezifische Anforderungen."}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                      {isEnglish ? "Certified quality" : "Zertifizierte Qualität"}
                    </h3>
                    <p className="text-muted-foreground">
                      {isEnglish
                        ? "All products are manufactured to ISO 9001 and undergo comprehensive quality checks."
                        : "Alle Produkte werden nach ISO 9001 gefertigt und durchlaufen umfassende Qualitätskontrollen."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/1.png"
                alt="Technologie und Fertigung"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
