import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Alle");

  const categories = ["Alle", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === "Alle" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

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
              <span>Produkte</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Unsere Produkte
            </h1>
            <p className="text-xl opacity-90">
              Hochpräzise optoelektronische Komponenten und Systeme für anspruchsvolle Anwendungen in Industrie, Medizintechnik und Forschung.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-muted border-b border-border">
        <div className="container">
          <div className="flex flex-wrap gap-3">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.name}
                description={product.description}
                image={product.image}
                href={`/produkte/${product.id}`}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                Keine Produkte in dieser Kategorie gefunden.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-accent-foreground">
            Finden Sie nicht das passende Produkt?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Wir entwickeln auch kundenspezifische Lösungen. Kontaktieren Sie uns für eine individuelle Beratung.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Individuelle Anfrage stellen
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
