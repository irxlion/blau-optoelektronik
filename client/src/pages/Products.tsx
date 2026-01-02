import { useMemo, useState, useEffect } from "react";
import { ChevronRight, Loader2, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import ParallaxSection from "@/components/ParallaxSection";

function getProductHref(product: Product) {
  // /produkte/machine-vision ist eine eigene Seite
  if (product.id === "machine-vision") {
    // #region agent log
    if (typeof window !== "undefined") {
      const w = window as any;
      if (!w.__dbg_products_machine_vision_href) {
        w.__dbg_products_machine_vision_href = true;
        fetch("http://127.0.0.1:7242/ingest/11ad90a2-7433-4ef9-b753-18907f0bce0b", {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify({
            sessionId: "debug-session",
            runId: "pre-fix",
            hypothesisId: "A",
            location: "Products.tsx:getProductHref",
            message: "Products machine-vision href computed",
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
}

export default function Products() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [productsData, setProductsData] = useState<{ de: Product[]; en: Product[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProductsData(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Fehler beim Laden der Produkte:", err);
        setError(err.message || "Fehler beim Laden der Produkte");
        setProductsData({ de: [], en: [] });
      })
      .finally(() => setLoading(false));
  }, []);

  const allProducts = useMemo(() => {
    if (!productsData) return [];
    return productsData[language];
  }, [productsData, language]);

  const categories = useMemo(() => Array.from(new Set(allProducts.map((p) => p.category))), [allProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = selectedCategory === "all" ? allProducts : allProducts.filter((p) => p.category === selectedCategory);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [allProducts, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-12 sm:py-16 lg:py-24 mt-20 overflow-hidden">
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
            <div className="flex items-center gap-2 text-xs sm:text-sm mb-3 sm:mb-4 opacity-90">
              <span>Home</span>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{isEnglish ? "Products" : "Produkte"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6">
              {isEnglish ? "Our products" : "Unsere Produkte"}
            </h1>
            <p className="text-sm sm:text-base lg:text-xl opacity-90">
              {isEnglish
                ? "High-precision optoelectronic components and systems for demanding applications in industry, medical technology and research."
                : "Hochpräzise optoelektronische Komponenten und Systeme für anspruchsvolle Anwendungen in Industrie, Medizintechnik und Forschung."}
            </p>
          </div>
        </div>
      </section>

      {/* Search and Category Filter */}
      <section className="py-6 sm:py-8 bg-muted border-b border-border">
        <div className="container">
          <div className="mb-4 sm:mb-6 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={isEnglish ? "Search products..." : "Produkte durchsuchen..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm sm:text-base min-h-[44px]"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className={selectedCategory === "all" ? "bg-primary" : ""}
              size="sm"
            >
              {isEnglish ? "All" : "Alle"}
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-primary" : ""}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container">
          {error && (
            <div className="mb-6 sm:mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive font-semibold mb-2 text-sm sm:text-base">
                {isEnglish ? "Error loading products" : "Fehler beim Laden der Produkte"}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">{error}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {isEnglish 
                  ? "Please check the browser console for more details or contact support." 
                  : "Bitte überprüfen Sie die Browser-Konsole für weitere Details oder kontaktieren Sie den Support."}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.name}
                description={product.description}
                image={product.image}
                href={getProductHref(product)}
              />
            ))}
          </div>

          {!error && filteredProducts.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <p className="text-lg sm:text-xl text-muted-foreground">
                {isEnglish ? "No products found." : "Keine Produkte gefunden."}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {isEnglish 
                  ? "Please check if products have been migrated to the database." 
                  : "Bitte überprüfen Sie, ob Produkte in die Datenbank migriert wurden."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-accent">
        <div className="container text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-accent-foreground">
            {isEnglish ? "Can't find the product you need?" : "Finden Sie nicht das passende Produkt?"}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            {isEnglish
              ? "We also design custom solutions. Contact us for personalised consulting."
              : "Wir entwickeln auch kundenspezifische Lösungen. Kontaktieren Sie uns für eine individuelle Beratung."}
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 min-h-[44px]">
            {isEnglish ? "Request custom quote" : "Individuelle Anfrage stellen"}
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
