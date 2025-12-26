import { Language } from "@/contexts/LanguageContext";

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
  seoHeadHtml?: string;
  technicalPropertiesHtml?: string;
  tools?: string[]; // Array von Tool-IDs (z.B. ["max-power-simulation", "line-thickness-simulation"])
}

const productData: Record<Language, Product[]> = {
  de: [
  {
    id: "machine-vision",
    name: "Machine Vision Laser",
    category: "Machine Vision Lasermodule",
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
    category: "Machine Vision Lasermodule",
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
  ],
  en: [
    {
      id: "machine-vision",
      name: "Machine Vision Laser",
      category: "Machine Vision laser modules",
      description: "High-precision laser modules for industrial imaging with outstanding accuracy and measurement speed.",
      longDescription: "The lasers in the Machine Vision series deliver maximum precision and measurement speed. Developed specifically for demanding industrial imaging applications, these modules provide exceptional accuracy and reliability. Advanced laser technology and precision optics enable fast, accurate measurements even in challenging environments.",
      image: "/product-machine-vision.jpg",
      images: ["/product-machine-vision.jpg", "/hero-laser-tech.jpg"],
      features: [
        "Optimal accuracy for precise measurements",
        "High measurement speed for efficient processes",
        "Rugged design for industrial environments",
        "Long-term stability and reliability",
        "Easy integration into existing systems",
        "Multiple wavelengths available"
      ],
      specifications: {
        "Wavelength": "405 nm / 450 nm / 520 nm / 635 nm / 660 nm",
        "Output power": "1 mW - 100 mW",
        "Beam profile": "Gaussian",
        "Operating voltage": "3-5 VDC",
        "Operating temperature": "-10°C to +50°C",
        "Housing material": "Aluminium, anodised",
        "Protection rating": "IP54",
        "Dimensions": "Ø12 mm x 45 mm (standard)"
      },
      applications: [
        "Quality control and inspection",
        "Positioning and alignment",
        "Dimensional measurement",
        "Surface inspection",
        "Robot guidance",
        "3D scanning"
      ],
      downloads: [
        { name: "Machine Vision datasheet", type: "PDF", url: "#" },
        { name: "Technical drawing", type: "DWG", url: "#" },
        { name: "CAD model", type: "STEP", url: "#" }
      ]
    },
    {
      id: "linienlaser",
      name: "Line Lasers",
      category: "Line lasers",
      description: "Precision positioning enabled by high-quality line lasers for demanding applications.",
      longDescription: "Line lasers enable exact positioning and place high demands on line quality. Our line lasers offer excellent homogeneity, outstanding straightness and precise alignment, making them ideal where a straight and uniform line is required across long distances.",
      image: "/product-line-laser.jpg",
      images: ["/product-line-laser.jpg", "/technology-optical-sensors.jpg"],
      features: [
        "High-precision line projection",
        "Excellent line homogeneity",
        "Large working distances possible",
        "Multiple line widths available",
        "Robust construction",
        "Easy installation and alignment"
      ],
      specifications: {
        "Wavelength": "635 nm / 660 nm",
        "Output power": "5 mW - 50 mW",
        "Line length": "10 mm - 1000 mm (distance dependent)",
        "Opening angle": "30° - 90°",
        "Operating voltage": "3-5 VDC",
        "Operating temperature": "-10°C to +50°C",
        "Housing material": "Aluminium, black anodised",
        "Protection rating": "IP65",
        "Dimensions": "40 mm x 40 mm x 60 mm"
      },
      applications: [
        "Alignment and positioning",
        "Saw and cutting applications",
        "Packaging machinery",
        "Wood processing",
        "Construction industry",
        "Material handling"
      ],
      downloads: [
        { name: "Line laser datasheet", type: "PDF", url: "#" },
        { name: "Installation guide", type: "PDF", url: "#" },
        { name: "CAD model", type: "STEP", url: "#" }
      ]
    },
    {
      id: "punktlaser",
      name: "Point Lasers",
      category: "Point lasers",
      description: "Point laser modules with round or elliptical beam profiles for versatile use cases.",
      longDescription: "With the right optics and electronics we manufacture point laser modules with round or elliptical beam profiles. They provide maximum precision and flexibility for a wide range of applications. Combining high-quality laser diodes with precision optics ensures excellent beam quality and long-term stability.",
      image: "/product-point-laser.jpg",
      images: ["/product-point-laser.jpg", "/hero-laser-tech.jpg"],
      features: [
        "Round or elliptical beam shapes",
        "High beam quality",
        "Multiple wavelengths",
        "Compact form factor",
        "Long-term stability",
        "Custom adaptations available"
      ],
      specifications: {
        "Wavelength": "405 nm / 450 nm / 520 nm / 635 nm / 660 nm / 780 nm / 850 nm",
        "Output power": "1 mW - 200 mW",
        "Beam profile": "Round (TEM00) or elliptical",
        "Beam diameter": "0.5 mm - 5 mm (at 1 m distance)",
        "Operating voltage": "3-5 VDC",
        "Operating temperature": "-20°C to +60°C",
        "Housing material": "Aluminium, blue anodised",
        "Protection rating": "IP54",
        "Dimensions": "Ø8 mm x 30 mm to Ø25 mm x 80 mm"
      },
      applications: [
        "Target marking and alignment",
        "Metrology",
        "Medical technology",
        "Spectroscopy",
        "Optical communication",
        "Research and development"
      ],
      downloads: [
        { name: "Point laser datasheet", type: "PDF", url: "#" },
        { name: "Wavelength overview", type: "PDF", url: "#" },
        { name: "CAD model", type: "STEP", url: "#" }
      ]
    },
    {
      id: "powelllinsen",
      name: "Powell Lenses",
      category: "Powell lenses",
      description: "In-house manufactured aspheric Powell lenses – several hundred units per week.",
      longDescription: "Since 2019 we have produced several hundred Powell lenses per week in-house. The aspheric shape enables a uniform intensity distribution across the entire line length. Our own production guarantees maximum quality and lets us respond flexibly to customer requirements.",
      image: "/product-powell-lens.jpg",
      images: ["/product-powell-lens.jpg", "/manufacturing-facility.jpg"],
      features: [
        "In-house production for maximum quality",
        "Uniform intensity distribution",
        "Aspheric precision optics",
        "Various opening angles",
        "Fast delivery times",
        "Custom manufacturing available"
      ],
      specifications: {
        "Opening angle": "10° - 90°",
        "Material": "BK7, fused silica or custom",
        "Coating": "AR coating for different wavelengths",
        "Diameter": "5 mm - 25 mm",
        "Focal length": "10 mm - 100 mm",
        "Surface quality": "40-20 scratch-dig",
        "Wavefront error": "< λ/4",
        "Transmission": "> 95% (coated)"
      },
      applications: [
        "Line laser generation",
        "Barcode scanners",
        "Industrial metrology",
        "3D scanning",
        "Structured lighting",
        "Laser material processing"
      ],
      downloads: [
        { name: "Powell lens datasheet", type: "PDF", url: "#" },
        { name: "Optical specifications", type: "PDF", url: "#" },
        { name: "Application notes", type: "PDF", url: "#" }
      ]
    },
    {
      id: "oem-module",
      name: "OEM Modules",
      category: "OEM modules",
      description: "Custom mechanics, optics and electronics tailored to your specifications, even for small series.",
      longDescription: "For 30 years BLAU Optoelectronics has been developing optoelectronics in close collaboration with customers. Besides laser modules for medical technology and machine vision we design and build numerous sensors – from optical distance sensors to PSD solutions for straightness measurement. We manufacture mechanics, optics and electronics to customer specifications, including small series, with manageable effort.",
      image: "/product-oem-module.jpg",
      images: ["/product-oem-module.jpg", "/manufacturing-facility.jpg", "/technology-optical-sensors.jpg"],
      features: [
        "Custom development",
        "Turnkey solutions from a single source",
        "Small batches possible",
        "30 years of engineering experience",
        "Fast prototyping",
        "Comprehensive consulting and support"
      ],
      specifications: {
        "Development time": "4-12 weeks (depending on complexity)",
        "Minimum quantity": "Starting at 10 units",
        "Scope": "Development, design, manufacturing, quality assurance",
        "Technologies": "Laser modules, sensors, optics, electronics, mechanics",
        "Certifications": "ISO 9001, CE compliance",
        "Documentation": "Complete technical documentation",
        "Support": "Long-term availability and support",
        "Quality": "100% final inspection"
      },
      applications: [
        "Medical technology",
        "Industrial metrology",
        "Automation technology",
        "Research and development",
        "Special machinery",
        "Test engineering"
      ],
      downloads: [
        { name: "OEM development overview", type: "PDF", url: "#" },
        { name: "Reference projects", type: "PDF", url: "#" },
        { name: "Request form", type: "PDF", url: "#" }
      ]
    },
    {
      id: "mvpulse",
      name: "MVpulse",
      category: "Machine Vision laser modules",
      description: "Laser class 2 eye safety combined with high output power up to 100 mW.",
      longDescription: "Our MVpulse laser module combines two decisive criteria for industrial imaging: lots of light with output power up to 100 mW and laser class 2 eye safety. Innovative pulsed laser technology delivers high peak power while remaining within eye-safety limits, enabling use in environments where class 3 lasers are not permitted.",
      image: "/product-machine-vision.jpg",
      images: ["/product-machine-vision.jpg", "/hero-laser-tech.jpg", "/technology-optical-sensors.jpg"],
      features: [
        "Laser class 2 eye safety",
        "High output power up to 100 mW",
        "Pulsed operation",
        "Optimised for machine vision",
        "Compact form factor",
        "Long-term stability"
      ],
      specifications: {
        "Wavelength": "450 nm (blue)",
        "Average power": "Up to 100 mW",
        "Peak power": "Up to 500 mW",
        "Pulse frequency": "1 kHz - 100 kHz",
        "Pulse duration": "10 µs - 1000 µs",
        "Laser class": "Class 2 (eye-safe)",
        "Operating voltage": "5 VDC",
        "Operating temperature": "0°C to +40°C",
        "Housing material": "Aluminium, blue anodised",
        "Protection rating": "IP54",
        "Dimensions": "Ø12 mm x 50 mm",
        "Control": "TTL signal or analogue"
      },
      applications: [
        "Industrial imaging",
        "Quality control",
        "Barcode reading",
        "Object detection",
        "Robot guidance",
        "Inspection in accessible areas"
      ],
      downloads: [
        { name: "MVpulse datasheet", type: "PDF", url: "#" },
        { name: "Laser safety documentation", type: "PDF", url: "#" },
        { name: "Drive examples", type: "PDF", url: "#" },
        { name: "CAD model", type: "STEP", url: "#" }
      ]
    }
  ],
};

export function getProducts(language: Language): Product[] {
  return productData[language];
}

export function getProductById(id: string, language: Language): Product | undefined {
  return productData[language].find((p) => p.id === id);
}

export function getProductsByCategory(category: string, language: Language): Product[] {
  return productData[language].filter((p) => p.category === category);
}
