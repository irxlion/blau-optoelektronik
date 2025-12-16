/**
 * Shop-Startseite
 * Zeigt Produktkatalog mit Suche, Filtern und Grid/Listen-Ansicht
 */

import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, Search, Grid, List, Loader2, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { listProducts, getCategories, ProductFilters } from "@/lib/shopData";
import { ShopProduct } from "@/types/shop";
import { Badge } from "@/components/ui/badge";

type ViewMode = "grid" | "list";

export default function Shop() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const { addItem, getTotalItems } = useCart();
  const [, setLocation] = useLocation();

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [wavelengthFilter, setWavelengthFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        listProducts({ isActive: true }),
        getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Fehler beim Laden der Produkte:", error);
    } finally {
      setLoading(false);
    }
  };

  const filters: ProductFilters = useMemo(() => {
    const filter: ProductFilters = {
      isActive: true,
    };

    if (searchQuery) {
      filter.search = searchQuery;
    }

    if (selectedCategory !== "all") {
      filter.category = selectedCategory;
    }

    if (wavelengthFilter !== "all") {
      const [min, max] = wavelengthFilter.split("-").map(Number);
      if (!isNaN(min)) filter.wavelengthMin = min;
      if (!isNaN(max)) filter.wavelengthMax = max;
    }

    return filter;
  }, [searchQuery, selectedCategory, wavelengthFilter]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery && selectedCategory === "all" && wavelengthFilter === "all") {
      return products;
    }

    return products.filter((product) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.short_description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      if (wavelengthFilter !== "all" && product.wavelength_nm) {
        const [min, max] = wavelengthFilter.split("-").map(Number);
        if (!isNaN(min) && product.wavelength_nm < min) return false;
        if (!isNaN(max) && product.wavelength_nm > max) return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, wavelengthFilter]);

  const handleAddToCart = (product: ShopProduct) => {
    addItem(product, 1);
  };

  const getProductImage = (product: ShopProduct): string => {
    // Verwende Hauptbild falls vorhanden (wird aus main_image_url oder erstes Bild geladen)
    const mainImage = (product as any).main_image_url;
    if (mainImage) return mainImage;
    
    // Fallback: Erstes Bild aus Assets
    const imageAsset = product.assets?.find((a) => a.type === "image");
    if (imageAsset) return imageAsset.url;
    
    // Fallback zu bestehenden Produktbildern
    const imageMap: Record<string, string> = {
      "Machine Vision Lasermodule": "/product-machine-vision.jpg",
      "Linienlaser": "/product-line-laser.jpg",
      "Punktlaser": "/product-point-laser.jpg",
      "Powelllinsen": "/product-powell-lens.jpg",
      "OEM Module": "/product-oem-module.jpg",
    };
    return imageMap[product.category] || "/product-machine-vision.jpg";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-24 mt-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {isEnglish ? "Shop" : "Shop"}
            </h1>
            <p className="text-xl opacity-90">
              {isEnglish
                ? "High-precision optoelectronic components and systems for your applications."
                : "Hochpräzise optoelektronische Komponenten und Systeme für Ihre Anwendungen."}
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="py-6 bg-muted border-b border-border sticky top-20 z-40">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={isEnglish ? "Search products..." : "Produkte suchen..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder={isEnglish ? "All categories" : "Alle Kategorien"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isEnglish ? "All categories" : "Alle Kategorien"}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Wavelength Filter */}
            <Select value={wavelengthFilter} onValueChange={setWavelengthFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder={isEnglish ? "Wavelength" : "Wellenlänge"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isEnglish ? "All wavelengths" : "Alle Wellenlängen"}</SelectItem>
                <SelectItem value="400-500">400-500 nm</SelectItem>
                <SelectItem value="500-600">500-600 nm</SelectItem>
                <SelectItem value="600-700">600-700 nm</SelectItem>
                <SelectItem value="700-800">700-800 nm</SelectItem>
                <SelectItem value="800-900">800-900 nm</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                aria-label={isEnglish ? "Grid view" : "Rasteransicht"}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                aria-label={isEnglish ? "List view" : "Listenansicht"}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Cart Button */}
            <Button
              variant="outline"
              onClick={() => setLocation("/shop/cart")}
              className="relative"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isEnglish ? "Cart" : "Warenkorb"}
              {getTotalItems() > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 flex-1">
        <div className="container">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                {isEnglish ? "No products found." : "Keine Produkte gefunden."}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      loading="lazy"
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{product.sku}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {product.short_description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.wavelength_nm && (
                        <Badge variant="outline">{product.wavelength_nm} nm</Badge>
                      )}
                      {product.power_mw && (
                        <Badge variant="outline">{product.power_mw} mW</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      {product.price_eur ? (
                        <span className="text-2xl font-bold text-primary">
                          {product.price_eur.toFixed(2)} €
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {isEnglish ? "Price on request" : "Preis auf Anfrage"}
                        </span>
                      )}
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isEnglish ? "Add to cart" : "In den Warenkorb"}
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full mt-2"
                      onClick={() => setLocation(`/shop/product/${product.id}`)}
                    >
                      {isEnglish ? "View details" : "Details anzeigen"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="w-32 h-32 flex-shrink-0">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{product.sku}</p>
                          </div>
                          {product.price_eur && (
                            <span className="text-2xl font-bold text-primary">
                              {product.price_eur.toFixed(2)} €
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-4">{product.short_description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.wavelength_nm && (
                            <Badge variant="outline">{product.wavelength_nm} nm</Badge>
                          )}
                          {product.power_mw && (
                            <Badge variant="outline">{product.power_mw} mW</Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setLocation(`/shop/product/${product.id}`)}
                          >
                            {isEnglish ? "View details" : "Details anzeigen"}
                          </Button>
                          <Button
                            onClick={() => handleAddToCart(product)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            {isEnglish ? "Add to cart" : "In den Warenkorb"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

