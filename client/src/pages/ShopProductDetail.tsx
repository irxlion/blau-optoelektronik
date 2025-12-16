/**
 * Shop-Produktdetailseite
 * Zeigt detaillierte Produktinformationen, technische Daten, Downloads und Warenkorb-Button
 */

import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Download, Loader2, ArrowLeft, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { getProductWithAssets } from "@/lib/shopData";
import { ShopProduct, ProductAsset } from "@/types/shop";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ShopProductDetail() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const { addItem, getItemQuantity } = useCart();
  const [, params] = useRoute("/shop/product/:id");
  const [, setLocation] = useLocation();

  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const productId = params?.id;

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const productData = await getProductWithAssets(productId);
      if (productData) {
        console.log("Geladenes Produkt:", productData.name);
        console.log("Produkt-Assets:", productData.assets);
        if (productData.assets && productData.assets.length > 0) {
          const pdfs = productData.assets.filter((a) => 
            a.type === "datasheet_pdf" || a.type === "manual_pdf" || 
            (a.type === "other" && a.url.toLowerCase().endsWith('.pdf'))
          );
          console.log("PDF-Assets gefunden:", pdfs.length, pdfs);
        }
      }
      setProduct(productData);
    } catch (error) {
      console.error("Fehler beim Laden des Produkts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  const getProductImage = (product: ShopProduct): string => {
    // Verwende Hauptbild falls vorhanden
    const mainImage = (product as any).main_image_url;
    if (mainImage) return mainImage;
    
    // Fallback: Erstes Bild aus Assets
    const imageAsset = product.assets?.find((a) => a.type === "image");
    if (imageAsset) return imageAsset.url;

    // Fallback
    const imageMap: Record<string, string> = {
      "Machine Vision Lasermodule": "/product-machine-vision.jpg",
      "Linienlaser": "/product-line-laser.jpg",
      "Punktlaser": "/product-point-laser.jpg",
      "Powelllinsen": "/product-powell-lens.jpg",
      "OEM Module": "/product-oem-module.jpg",
    };
    return imageMap[product.category] || "/product-machine-vision.jpg";
  };

  const getDatasheets = (): ProductAsset[] => {
    return product?.assets?.filter((a) => a.type === "datasheet_pdf") || [];
  };

  const getManuals = (): ProductAsset[] => {
    return product?.assets?.filter((a) => a.type === "manual_pdf") || [];
  };

  const getOtherPDFs = (): ProductAsset[] => {
    return product?.assets?.filter((a) => a.type === "other" && a.url.toLowerCase().endsWith('.pdf')) || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <p className="text-xl text-muted-foreground mb-4">
                {isEnglish ? "Product not found" : "Produkt nicht gefunden"}
              </p>
              <Button onClick={() => setLocation("/shop")}>
                {isEnglish ? "Back to shop" : "Zurück zum Shop"}
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const cartQuantity = getItemQuantity(product.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Breadcrumb */}
      <section className="bg-muted py-4 mt-20">
        <div className="container">
          <div className="flex items-center gap-2 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/shop")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {isEnglish ? "Back to shop" : "Zurück zum Shop"}
            </Button>
          </div>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-16 flex-1">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-4">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <Badge variant="outline" className="mb-2">{product.category}</Badge>
                <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">{product.sku}</p>
              </div>

              <Separator className="my-6" />

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  {isEnglish ? "Description" : "Beschreibung"}
                </h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {product.long_description || product.short_description}
                </p>
              </div>

              {/* Technical Specs Summary */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.wavelength_nm && (
                    <Badge variant="outline" className="text-sm">
                      {isEnglish ? "Wavelength" : "Wellenlänge"}: {product.wavelength_nm} nm
                    </Badge>
                  )}
                  {product.power_mw && (
                    <Badge variant="outline" className="text-sm">
                      {isEnglish ? "Power" : "Leistung"}: {product.power_mw} mW
                    </Badge>
                  )}
                </div>
              </div>

              {/* Price and Add to Cart */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  {product.price_eur ? (
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-primary">
                        {product.price_eur.toFixed(2)} €
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {isEnglish ? "(net)" : "(netto)"}
                      </span>
                    </div>
                  ) : (
                    <p className="text-lg text-muted-foreground mb-4">
                      {isEnglish ? "Price on request" : "Preis auf Anfrage"}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mb-4">
                    <label className="text-sm font-medium">
                      {isEnglish ? "Quantity" : "Menge"}:
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 px-3 py-2 border border-border rounded-md"
                    />
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-primary hover:bg-primary/90 mb-2"
                    size="lg"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isEnglish ? "Add to cart" : "In den Warenkorb"}
                  </Button>

                  {cartQuantity > 0 && (
                    <p className="text-sm text-muted-foreground text-center">
                      {isEnglish
                        ? `${cartQuantity} item(s) in cart`
                        : `${cartQuantity} Artikel im Warenkorb`}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    {isEnglish
                      ? "Delivery time: 2-4 weeks"
                      : "Lieferzeit: 2-4 Wochen"}
                  </p>
                </CardContent>
              </Card>

              {/* Downloads - Zeige alle PDF-Assets */}
              {(getDatasheets().length > 0 || getManuals().length > 0 || getOtherPDFs().length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      {isEnglish ? "Downloads" : "Downloads"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getDatasheets().map((asset) => (
                        <a
                          key={asset.id}
                          href={asset.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors group"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded flex items-center justify-center">
                            <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm group-hover:text-primary transition-colors">
                              {isEnglish ? "Datasheet" : "Datenblatt"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{asset.url.split('/').pop() || "PDF"}</p>
                          </div>
                          <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      ))}
                      {getManuals().map((asset) => (
                        <a
                          key={asset.id}
                          href={asset.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors group"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm group-hover:text-primary transition-colors">
                              {isEnglish ? "Manual" : "Handbuch"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{asset.url.split('/').pop() || "PDF"}</p>
                          </div>
                          <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      ))}
                      {/* Andere PDFs */}
                      {getOtherPDFs().map((asset) => (
                          <a
                            key={asset.id}
                            href={asset.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors group"
                          >
                            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                              <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm group-hover:text-primary transition-colors">
                                {asset.url.split('/').pop() || (isEnglish ? "Document" : "Dokument")}
                              </p>
                              <p className="text-xs text-muted-foreground">PDF</p>
                            </div>
                            <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </a>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isEnglish ? "Technical Specifications" : "Technische Daten"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="w-[200px]">
                        {isEnglish ? "SKU" : "Artikelnummer"}
                      </TableHead>
                      <TableCell>{product.sku}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>{isEnglish ? "Category" : "Kategorie"}</TableHead>
                      <TableCell>{product.category}</TableCell>
                    </TableRow>
                    {product.wavelength_nm && (
                      <TableRow>
                        <TableHead>
                          {isEnglish ? "Wavelength" : "Wellenlänge"}
                        </TableHead>
                        <TableCell>{product.wavelength_nm} nm</TableCell>
                      </TableRow>
                    )}
                    {product.power_mw && (
                      <TableRow>
                        <TableHead>
                          {isEnglish ? "Power" : "Leistung"}
                        </TableHead>
                        <TableCell>{product.power_mw} mW</TableCell>
                      </TableRow>
                    )}
                    {product.price_eur && (
                      <TableRow>
                        <TableHead>
                          {isEnglish ? "Price (net)" : "Preis (netto)"}
                        </TableHead>
                        <TableCell>{product.price_eur.toFixed(2)} €</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

