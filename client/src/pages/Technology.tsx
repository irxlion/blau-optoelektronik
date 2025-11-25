import { ChevronRight, Zap, Eye, Layers, Gauge } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function Technology() {
  const technologies = [
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
      image: "/product-powell-lens.jpg"
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
      image: "/product-machine-vision.jpg"
    }
  ];

  const principles = [
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
              <span>Technologie</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Unsere Technologien
            </h1>
            <p className="text-xl opacity-90">
              Innovative optoelektronische Lösungen basierend auf modernster Technologie und jahrzehntelanger Erfahrung.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Overview */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Kerntechnologien</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Präzision durch Innovation - unsere technologischen Schwerpunkte
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
            <h2 className="text-4xl font-bold mb-4 text-foreground">Messverfahren & Funktionsprinzipien</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Grundlagen unserer Messtechnologien
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
              <h2 className="text-4xl font-bold mb-6 text-foreground">Technologische Vorteile</h2>
              <div className="space-y-6">
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-card-foreground">Höchste Präzision</h3>
                    <p className="text-muted-foreground">
                      Durch modernste Fertigungstechnologie und präzise Kalibrierung erreichen wir Genauigkeiten im Mikrometerbereich.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-card-foreground">Langzeitstabilität</h3>
                    <p className="text-muted-foreground">
                      Aktive Temperaturregelung und hochwertige Komponenten garantieren konstante Leistung über Jahre.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-card-foreground">Kundenspezifische Anpassung</h3>
                    <p className="text-muted-foreground">
                      Flexible Technologieplattformen ermöglichen individuelle Anpassungen an spezifische Anforderungen.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-card-foreground">Zertifizierte Qualität</h3>
                    <p className="text-muted-foreground">
                      Alle Produkte werden nach ISO 9001 gefertigt und durchlaufen umfassende Qualitätskontrollen.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/manufacturing-facility.jpg"
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
