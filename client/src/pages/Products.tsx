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

function getProductHref(product: Product) {
  // /produkte/machine-vision ist jetzt die Kategorie-Seite
  if (product.id === "machine-vision") return "/produkte/machine-vision-laser";
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
      <section className="relative bg-primary text-primary-foreground py-24 mt-20">
        <div className="container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm mb-4 opacity-90">
              <span>Home</span>
              <ChevronRight className="h-4 w-4" />
              <span>{isEnglish ? "Products" : "Produkte"}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {isEnglish ? "Our products" : "Unsere Produkte"}
            </h1>
            <p className="text-xl opacity-90">
              {isEnglish
                ? "High-precision optoelectronic components and systems for demanding applications in industry, medical technology and research."
                : "Hochpräzise optoelektronische Komponenten und Systeme für anspruchsvolle Anwendungen in Industrie, Medizintechnik und Forschung."}
            </p>
          </div>
        </div>
      </section>

      {/* Search and Category Filter */}
      <section className="py-8 bg-muted border-b border-border">
        <div className="container">
          <div className="mb-6 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={isEnglish ? "Search products..." : "Produkte durchsuchen..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className={selectedCategory === "all" ? "bg-primary" : ""}
            >
              {isEnglish ? "All" : "Alle"}
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-primary" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container">
          {error && (
            <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive font-semibold mb-2">
                {isEnglish ? "Error loading products" : "Fehler beim Laden der Produkte"}
              </p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {isEnglish 
                  ? "Please check the browser console for more details or contact support." 
                  : "Bitte überprüfen Sie die Browser-Konsole für weitere Details oder kontaktieren Sie den Support."}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
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
      <section className="py-16 bg-accent">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-accent-foreground">
            {isEnglish ? "Can't find the product you need?" : "Finden Sie nicht das passende Produkt?"}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {isEnglish
              ? "We also design custom solutions. Contact us for personalised consulting."
              : "Wir entwickeln auch kundenspezifische Lösungen. Kontaktieren Sie uns für eine individuelle Beratung."}
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            {isEnglish ? "Request custom quote" : "Individuelle Anfrage stellen"}
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
