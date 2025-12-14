import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Loader2, ArrowLeft } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/data/products";
import { useLanguage } from "@/contexts/LanguageContext";

const CATEGORY = {
  de: "Machine Vision Lasermodule",
  en: "Machine Vision laser modules",
} as const;

function getProductHref(product: Product) {
  // Reservierter Pfad: /produkte/machine-vision ist die Kategorie-Seite.
  // Damit die Standard-Variante dennoch erreichbar bleibt, geben wir ihr einen Alias.
  if (product.id === "machine-vision") return "/produkte/machine-vision-laser";
  return `/produkte/${product.id}`;
}

export default function MachineVisionLaserModules() {
  const { language, t } = useLanguage();

  const [productsData, setProductsData] = useState<{ de: Product[]; en: Product[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(setProductsData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const machineVisionProducts = useMemo(() => {
    const all = productsData?.[language] || [];
    const filtered = all.filter((p) => p.category === CATEGORY[language]);

    // Stabil: Standard (machine-vision) zuerst, danach MVpulse, dann Rest alphabetisch
    const rank = (p: Product) => {
      if (p.id === "machine-vision") return 0;
      if (p.id === "mvpulse") return 1;
      if (p.id.startsWith("machine-vision-")) return 2;
      if (p.id.startsWith("mv-")) return 3;
      return 4;
    };

    return [...filtered].sort((a, b) => {
      const ra = rank(a);
      const rb = rank(b);
      if (ra !== rb) return ra - rb;
      return a.name.localeCompare(b.name);
    });
  }, [productsData, language]);

  const copy = t({
    de: {
      title: "Machine Vision Lasermodule",
      description:
        "Mehrere Versionen für industrielle Bildverarbeitung – wähle die passende Variante (z.B. Standard, MVpulse und weitere).",
      backToProducts: "Zurück zur Übersicht",
      products: "Produkte",
      variantsHeading: "Verfügbare Versionen",
      empty: "Aktuell sind keine Varianten in dieser Kategorie verfügbar.",
    },
    en: {
      title: "Machine Vision laser modules",
      description:
        "Multiple versions for industrial imaging – pick the right variant (e.g. standard, MVpulse and more).",
      backToProducts: "Back to overview",
      products: "Products",
      variantsHeading: "Available versions",
      empty: "There are currently no variants available in this category.",
    },
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: copy.title,
    description: copy.description,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO title={`${copy.title} - BLAU Optoelektronik`} description={copy.description} structuredData={structuredData} />
      <Header />

      {/* Breadcrumb */}
      <div className="bg-muted py-4 mt-20">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/produkte" className="hover:text-foreground transition-colors">
              {copy.products}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{copy.title}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-primary text-primary-foreground py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{copy.title}</h1>
            <p className="text-lg md:text-xl opacity-90">{copy.description}</p>
            <div className="mt-8">
              <Link href="/produkte">
                <Button variant="secondary" className="text-secondary-foreground">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {copy.backToProducts}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Variants */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-foreground">{copy.variantsHeading}</h2>

          {machineVisionProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">{copy.empty}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {machineVisionProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.name}
                  description={product.description}
                  image={product.image}
                  href={getProductHref(product)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

