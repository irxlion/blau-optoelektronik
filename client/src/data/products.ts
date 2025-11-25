export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  image: string;
  images: string[];
  features: string[];
  specifications: { [key: string]: string };
  applications: string[];
  downloads: { name: string; type: string; url: string }[];
}

export const products: Product[] = [
  {
    id: "machine-vision",
    name: "Machine Vision Laser",
    category: "Industrielle Bildverarbeitung",
    description: "Hochpräzise Lasermodule für industrielle Bildverarbeitung mit optimaler Genauigkeit und Messgeschwindigkeit.",
    longDescription: "Die Laser der Machine Vision Serie gewährleisten ein Optimum an Genauigkeit und Messgeschwindigkeit. Speziell entwickelt für anspruchsvolle Bildverarbeitungsanwendungen in der Industrie, bieten diese Module höchste Präzision und Zuverlässigkeit. Mit modernster Lasertechnologie und präziser Optik ermöglichen sie schnelle und genaue Messungen auch unter schwierigen Bedingungen.",
    image: "/product-machine-vision.jpg",
    images: ["/product-machine-vision.jpg", "/hero-laser-tech.jpg"],
    features: [
      "Optimale Genauigkeit für präzise Messungen",
      "Hohe Messgeschwindigkeit für effiziente Prozesse",
      "Robustes Design für industrielle Umgebungen",
      "Langzeitstabilität und Zuverlässigkeit",
      "Einfache Integration in bestehende Systeme",
      "Verschiedene Wellenlängen verfügbar"
    ],
    specifications: {
      "Wellenlänge": "405 nm / 450 nm / 520 nm / 635 nm / 660 nm",
      "Ausgangsleistung": "1 mW - 100 mW",
      "Strahlprofil": "Gaußförmig",
      "Betriebsspannung": "3-5 VDC",
      "Betriebstemperatur": "-10°C bis +50°C",
      "Gehäusematerial": "Aluminium, eloxiert",
      "Schutzklasse": "IP54",
      "Abmessungen": "Ø12 mm x 45 mm (Standard)"
    },
    applications: [
      "Qualitätskontrolle und Inspektion",
      "Positionierung und Ausrichtung",
      "Dimensionsmessung",
      "Oberflächenprüfung",
      "Roboterführung",
      "3D-Scanning"
    ],
    downloads: [
      { name: "Produktdatenblatt Machine Vision", type: "PDF", url: "#" },
      { name: "Technische Zeichnung", type: "DWG", url: "#" },
      { name: "CAD-Modell", type: "STEP", url: "#" }
    ]
  },
  {
    id: "linienlaser",
    name: "Linienlaser",
    category: "Linienlaser",
    description: "Präzise Positionierung durch hochwertige Linienlaser für anspruchsvolle Anwendungen.",
    longDescription: "Linienlaser ermöglichen eine präzise Positionierung und stellen hohe Anforderungen an die Beschaffenheit der Linie. Unsere Linienlaser zeichnen sich durch exzellente Linienqualität, hohe Homogenität und präzise Ausrichtung aus. Sie sind ideal für Anwendungen, bei denen eine gerade, gleichmäßige Linie über große Distanzen erforderlich ist.",
    image: "/product-line-laser.jpg",
    images: ["/product-line-laser.jpg", "/technology-optical-sensors.jpg"],
    features: [
      "Hochpräzise Linienprojektion",
      "Exzellente Linienhomogenität",
      "Große Arbeitsabstände möglich",
      "Verschiedene Linienbreiten verfügbar",
      "Robuste Konstruktion",
      "Einfache Montage und Justage"
    ],
    specifications: {
      "Wellenlänge": "635 nm / 660 nm",
      "Ausgangsleistung": "5 mW - 50 mW",
      "Linienlänge": "10 mm - 1000 mm (abhängig vom Abstand)",
      "Öffnungswinkel": "30° - 90°",
      "Betriebsspannung": "3-5 VDC",
      "Betriebstemperatur": "-10°C bis +50°C",
      "Gehäusematerial": "Aluminium, schwarz eloxiert",
      "Schutzklasse": "IP65",
      "Abmessungen": "40 mm x 40 mm x 60 mm"
    },
    applications: [
      "Ausrichtung und Positionierung",
      "Säge- und Schneidanwendungen",
      "Verpackungsmaschinen",
      "Holzbearbeitung",
      "Bauindustrie",
      "Materialhandling"
    ],
    downloads: [
      { name: "Produktdatenblatt Linienlaser", type: "PDF", url: "#" },
      { name: "Montageanleitung", type: "PDF", url: "#" },
      { name: "CAD-Modell", type: "STEP", url: "#" }
    ]
  },
  {
    id: "punktlaser",
    name: "Punktlaser",
    category: "Punktlaser",
    description: "Punktlaser-Module mit rundem oder elliptischem Strahlprofil für vielfältige Einsatzbereiche.",
    longDescription: "Mit der richtigen Optik und Elektronik fertigen wir Punktlaser-Module mit rundem oder elliptischem Strahlprofil. Diese Module bieten höchste Präzision und Flexibilität für verschiedenste Anwendungen. Durch die Kombination aus hochwertigen Laserdioden und präziser Optik erreichen wir exzellente Strahlqualität und Langzeitstabilität.",
    image: "/product-point-laser.jpg",
    images: ["/product-point-laser.jpg", "/hero-laser-tech.jpg"],
    features: [
      "Runde oder elliptische Strahlprofile",
      "Hohe Strahlqualität",
      "Verschiedene Wellenlängen",
      "Kompakte Bauform",
      "Langzeitstabilität",
      "Kundenspezifische Anpassungen möglich"
    ],
    specifications: {
      "Wellenlänge": "405 nm / 450 nm / 520 nm / 635 nm / 660 nm / 780 nm / 850 nm",
      "Ausgangsleistung": "1 mW - 200 mW",
      "Strahlprofil": "Rund (TEM00) oder elliptisch",
      "Strahldurchmesser": "0.5 mm - 5 mm (bei 1m Abstand)",
      "Betriebsspannung": "3-5 VDC",
      "Betriebstemperatur": "-20°C bis +60°C",
      "Gehäusematerial": "Aluminium, blau eloxiert",
      "Schutzklasse": "IP54",
      "Abmessungen": "Ø8 mm x 30 mm bis Ø25 mm x 80 mm"
    },
    applications: [
      "Zielmarkierung und Ausrichtung",
      "Messtechnik",
      "Medizintechnik",
      "Spektroskopie",
      "Optische Kommunikation",
      "Forschung und Entwicklung"
    ],
    downloads: [
      { name: "Produktdatenblatt Punktlaser", type: "PDF", url: "#" },
      { name: "Wellenlängenübersicht", type: "PDF", url: "#" },
      { name: "CAD-Modell", type: "STEP", url: "#" }
    ]
  },
  {
    id: "powelllinsen",
    name: "Powelllinsen",
    category: "Powelllinsen",
    description: "Asphärische Powelllinsen in Eigenproduktion - mehrere hundert Einheiten pro Woche.",
    longDescription: "Seit 2019 fertigen wir mehrere hundert Powelllinsen pro Woche in Eigenproduktion. Die asphärische Form dieser speziellen Linsen ermöglicht eine gleichmäßige Intensitätsverteilung über die gesamte Linienlänge. Durch unsere eigene Fertigung können wir höchste Qualität garantieren und flexibel auf Kundenwünsche eingehen.",
    image: "/product-powell-lens.jpg",
    images: ["/product-powell-lens.jpg", "/manufacturing-facility.jpg"],
    features: [
      "Eigenproduktion für höchste Qualität",
      "Gleichmäßige Intensitätsverteilung",
      "Asphärische Präzisionsoptik",
      "Verschiedene Öffnungswinkel",
      "Schnelle Lieferzeiten",
      "Kundenspezifische Anfertigungen"
    ],
    specifications: {
      "Öffnungswinkel": "10° - 90°",
      "Material": "BK7, Quarzglas oder kundenspezifisch",
      "Beschichtung": "AR-Beschichtung für verschiedene Wellenlängen",
      "Durchmesser": "5 mm - 25 mm",
      "Brennweite": "10 mm - 100 mm",
      "Oberflächenqualität": "40-20 scratch-dig",
      "Wellenfrontfehler": "< λ/4",
      "Transmissionsgrad": "> 95% (beschichtet)"
    },
    applications: [
      "Linienlaser-Erzeugung",
      "Barcode-Scanner",
      "Industrielle Messtechnik",
      "3D-Scanning",
      "Strukturierte Beleuchtung",
      "Laser-Materialbearbeitung"
    ],
    downloads: [
      { name: "Produktdatenblatt Powelllinsen", type: "PDF", url: "#" },
      { name: "Optische Spezifikationen", type: "PDF", url: "#" },
      { name: "Anwendungshinweise", type: "PDF", url: "#" }
    ]
  },
  {
    id: "oem-module",
    name: "OEM Module",
    category: "OEM Module",
    description: "Kundenspezifische Mechaniken, Optik und Elektronik nach Ihren Anforderungen, auch in Kleinserien.",
    longDescription: "BLAU Optoelektronik entwickelt seit 30 Jahren Optoelektronik in enger Abstimmung mit seinen Kunden. Neben den Schwerpunkten Lasermodule für die Medizintechnik und Machine Vision entwickeln und fertigen wir auch eine Vielzahl von Sensoren: Vom optischen Abstandsmesser und Taster bis zum PSD-Sensor zur Geradheitsvermessung von Werkstücken. Mit überschaubarem Aufwand fertigen wir Mechaniken, Optik und Elektronik nach Kundenwunsch auch in Kleinserien.",
    image: "/product-oem-module.jpg",
    images: ["/product-oem-module.jpg", "/manufacturing-facility.jpg", "/technology-optical-sensors.jpg"],
    features: [
      "Kundenspezifische Entwicklung",
      "Komplettlösungen aus einer Hand",
      "Kleinserien möglich",
      "30 Jahre Entwicklungserfahrung",
      "Schnelle Prototypenfertigung",
      "Umfassende Beratung und Support"
    ],
    specifications: {
      "Entwicklungszeit": "4-12 Wochen (je nach Komplexität)",
      "Mindestmenge": "Ab 10 Stück",
      "Leistungen": "Entwicklung, Konstruktion, Fertigung, Qualitätssicherung",
      "Technologien": "Lasermodule, Sensoren, Optik, Elektronik, Mechanik",
      "Zertifizierungen": "ISO 9001, CE-Konformität",
      "Dokumentation": "Vollständige technische Dokumentation",
      "Support": "Langfristige Verfügbarkeit und Support",
      "Qualität": "100% Endkontrolle"
    },
    applications: [
      "Medizintechnik",
      "Industrielle Messtechnik",
      "Automatisierungstechnik",
      "Forschung und Entwicklung",
      "Sondermaschinen",
      "Prüftechnik"
    ],
    downloads: [
      { name: "OEM-Entwicklung Übersicht", type: "PDF", url: "#" },
      { name: "Referenzprojekte", type: "PDF", url: "#" },
      { name: "Anfrage-Formular", type: "PDF", url: "#" }
    ]
  },
  {
    id: "mvpulse",
    name: "MVpulse",
    category: "Machine Vision",
    description: "Augensicherheit nach Laserklasse 2 kombiniert mit hoher Leistung bis 100 mW.",
    longDescription: "Unser MVpulse-Lasermodul verbindet zwei Kriterien der industriellen Bildverarbeitung: Viel Licht mit Ausgangsleistungen bis 100 mW und Augensicherheit nach Laserklasse 2. Durch innovative gepulste Lasertechnologie erreichen wir hohe Spitzenleistungen bei gleichzeitiger Einhaltung der Augensicherheitsgrenzwerte. Dies ermöglicht den Einsatz in Bereichen, in denen Laserklasse 3 nicht zugelassen ist.",
    image: "/product-machine-vision.jpg",
    images: ["/product-machine-vision.jpg", "/hero-laser-tech.jpg", "/technology-optical-sensors.jpg"],
    features: [
      "Augensicherheit Laserklasse 2",
      "Hohe Ausgangsleistung bis 100 mW",
      "Gepulster Betrieb",
      "Optimiert für Machine Vision",
      "Kompakte Bauform",
      "Langzeitstabilität"
    ],
    specifications: {
      "Wellenlänge": "450 nm (blau)",
      "Mittlere Leistung": "Bis 100 mW",
      "Spitzenleistung": "Bis 500 mW",
      "Pulsfrequenz": "1 kHz - 100 kHz",
      "Pulsdauer": "10 µs - 1000 µs",
      "Laserklasse": "Klasse 2 (augensicher)",
      "Betriebsspannung": "5 VDC",
      "Betriebstemperatur": "0°C bis +40°C",
      "Gehäusematerial": "Aluminium, blau eloxiert",
      "Schutzklasse": "IP54",
      "Abmessungen": "Ø12 mm x 50 mm",
      "Ansteuerung": "TTL-Signal oder analog"
    },
    applications: [
      "Industrielle Bildverarbeitung",
      "Qualitätskontrolle",
      "Barcode-Lesung",
      "Objekterkennung",
      "Roboterführung",
      "Inspektion in zugänglichen Bereichen"
    ],
    downloads: [
      { name: "MVpulse Produktdatenblatt", type: "PDF", url: "#" },
      { name: "Lasersicherheit Dokumentation", type: "PDF", url: "#" },
      { name: "Ansteuerungsbeispiele", type: "PDF", url: "#" },
      { name: "CAD-Modell", type: "STEP", url: "#" }
    ]
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category);
}
