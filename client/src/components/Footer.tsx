import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { Mail, Phone, MapPin } from "lucide-react";
import { APP_LOGO } from "@/const";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/data/products";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const [productsData, setProductsData] = useState<{ de: Product[]; en: Product[] } | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Produkte aus der Datenbank laden
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        const data = await fetchProducts();
        setProductsData(data);
      } catch (error) {
        console.error("Fehler beim Laden der Produkte für Footer:", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  // Kategorien aus der Datenbank extrahieren
  const productLinks = useMemo(() => {
    if (!productsData || loadingProducts) {
      // Fallback zu statischen Kategorien während des Ladens
      return isEnglish
        ? [
            { name: "Machine Vision Laser Modules", href: "/produkte/machine-vision" },
            { name: "Line Lasers", href: "/produkte/linienlaser" },
            { name: "Point Lasers", href: "/produkte/punktlaser" },
            { name: "Powell Lenses", href: "/produkte/powelllinsen" },
            { name: "OEM Modules", href: "/produkte/oem-module" },
            { name: "MVpulse", href: "/produkte/mvpulse" },
          ]
        : [
            { name: "Machine Vision Lasermodule", href: "/produkte/machine-vision" },
            { name: "Linienlaser", href: "/produkte/linienlaser" },
            { name: "Punktlaser", href: "/produkte/punktlaser" },
            { name: "Powelllinsen", href: "/produkte/powelllinsen" },
            { name: "OEM Module", href: "/produkte/oem-module" },
            { name: "MVpulse", href: "/produkte/mvpulse" },
          ];
    }

    const currentProducts = productsData[language];
    
    // Kategorien aus Produkten extrahieren und sortieren
    const categories = Array.from(new Set(currentProducts.map((p) => p.category))).sort();
    
    // Kategorien als Links erstellen
    return categories.map((category) => ({
      name: category,
      href: `/produkte?category=${encodeURIComponent(category)}`,
    }));
  }, [productsData, language, loadingProducts, isEnglish]);

  const companyLinks = isEnglish
    ? [
      { name: "About us", href: "/unternehmen" },
      { name: "Technology", href: "/technologie" },
      { name: "Careers", href: "/karriere" },
    ]
    : [
      { name: "Über uns", href: "/unternehmen" },
      { name: "Technologie", href: "/technologie" },
      { name: "Karriere", href: "/karriere" },
    ];

  const resourceLinks = isEnglish
    ? [
      { name: "Downloads", href: "/ressourcen" },
      { name: "FAQ", href: "/faq" },
      { name: "Contact", href: "/kontakt" },
    ]
    : [
      { name: "Downloads", href: "/ressourcen" },
      { name: "FAQ", href: "/faq" },
      { name: "Kontakt", href: "/kontakt" },
    ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <img src={APP_LOGO} alt="BLAU Optoelektronik" className="h-10 w-auto brightness-0 invert" />
            </Link>
            <p className="text-sm opacity-90 mb-4 max-w-md">
              {isEnglish
                ? "For more than 30 years we have been developing and manufacturing high-precision optoelectronic components and systems for demanding applications in industry, medical technology and research."
                : "Seit über 30 Jahren entwickeln und fertigen wir hochpräzise optoelektronische Komponenten und Systeme für anspruchsvolle Anwendungen in Industrie, Medizintechnik und Forschung."}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{isEnglish ? "Germany" : "Deutschland"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+49 (0) 7551 93748-0</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@blauoptoelektronik.de</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{isEnglish ? "Products" : "Produkte"}</h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm opacity-90 hover:opacity-100 hover:underline transition-opacity cursor-pointer">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{isEnglish ? "Company" : "Unternehmen"}</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm opacity-90 hover:opacity-100 hover:underline transition-opacity cursor-pointer">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{isEnglish ? "Resources" : "Ressourcen"}</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm opacity-90 hover:opacity-100 hover:underline transition-opacity cursor-pointer">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-80">
            © {currentYear} BLAU Optoelektronik GmbH. {isEnglish ? "All rights reserved." : "Alle Rechte vorbehalten."}
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/datenschutz">
              <span className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                {isEnglish ? "Privacy" : "Datenschutz"}
              </span>
            </Link>
            <Link href="/impressum">
              <span className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                {isEnglish ? "Legal notice" : "Impressum"}
              </span>
            </Link>
            <Link href="/agb">
              <span className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                {isEnglish ? "Terms & Conditions" : "AGB"}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
