/**
 * Warenkorb-Seite
 * Zeigt alle Produkte im Warenkorb mit Möglichkeit zur Bearbeitung
 */

import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

export default function Cart() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [, setLocation] = useLocation();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const getProductImage = (category: string): string => {
    const imageMap: Record<string, string> = {
      "Machine Vision Lasermodule": "/product-machine-vision.jpg",
      "Linienlaser": "/product-line-laser.jpg",
      "Punktlaser": "/product-point-laser.jpg",
      "Powelllinsen": "/product-powell-lens.jpg",
      "OEM Module": "/product-oem-module.jpg",
    };
    const mapped = imageMap[category];
    if (!mapped && isEnglish) {
      // #region agent log
      if (typeof window !== "undefined") {
        const w = window as any;
        const key = `__dbg_cart_img_miss_${category || "unknown"}`;
        if (!w[key]) {
          w[key] = true;
          fetch("http://127.0.0.1:7242/ingest/11ad90a2-7433-4ef9-b753-18907f0bce0b", {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify({
              sessionId: "debug-session",
              runId: "pre-fix",
              hypothesisId: "B",
              location: "Cart.tsx:getProductImage",
              message: "Cart image map miss (EN) -> fallback",
              data: { category, fallback: "/product-machine-vision.jpg" },
              timestamp: Date.now(),
            }),
          }).catch(() => {});
        }
      }
      // #endregion
    }
    return mapped || "/product-machine-vision.jpg";
  };

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.19; // 19% MwSt.
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <section className="flex-1 flex items-center justify-center py-16 mt-20">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">
                {isEnglish ? "Your cart is empty" : "Ihr Warenkorb ist leer"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {isEnglish
                  ? "Add products to your cart to continue shopping."
                  : "Fügen Sie Produkte zu Ihrem Warenkorb hinzu, um weiter einzukaufen."}
              </p>
              <Button onClick={() => setLocation("/shop")} className="bg-primary hover:bg-primary/90">
                {isEnglish ? "Continue shopping" : "Weiter einkaufen"}
              </Button>
            </CardContent>
          </Card>
        </section>

        <Footer />
      </div>
    );
  }

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

      {/* Cart Content */}
      <section className="py-16 flex-1">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">
                  {isEnglish ? "Shopping Cart" : "Warenkorb"}
                </h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-destructive hover:text-destructive"
                >
                  {isEnglish ? "Clear cart" : "Warenkorb leeren"}
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item) => {
                  const itemPrice = item.product.price_eur || 0;
                  const itemTotal = itemPrice * item.quantity;

                  return (
                    <Card key={item.product.id}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="w-24 h-24 flex-shrink-0">
                            <img
                              src={getProductImage(item.product.category)}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold mb-1">{item.product.name}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{item.product.sku}</p>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {item.product.wavelength_nm && (
                                    <Badge variant="outline" className="text-xs">
                                      {item.product.wavelength_nm} nm
                                    </Badge>
                                  )}
                                  {item.product.power_mw && (
                                    <Badge variant="outline" className="text-xs">
                                      {item.product.power_mw} mW
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.product.id)}
                                className="text-destructive hover:text-destructive"
                                aria-label={isEnglish ? "Remove item" : "Artikel entfernen"}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                  aria-label={isEnglish ? "Decrease quantity" : "Menge verringern"}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center font-medium">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                  aria-label={isEnglish ? "Increase quantity" : "Menge erhöhen"}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <p className="text-lg font-semibold">
                                  {itemTotal.toFixed(2)} €
                                </p>
                                {itemPrice > 0 && (
                                  <p className="text-sm text-muted-foreground">
                                    {itemPrice.toFixed(2)} € {isEnglish ? "each" : "pro Stück"}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>
                    {isEnglish ? "Order Summary" : "Bestellübersicht"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {isEnglish ? "Subtotal (net)" : "Zwischensumme (netto)"}
                      </span>
                      <span className="font-medium">{subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {isEnglish ? "VAT (19%)" : "MwSt. (19%)"}
                      </span>
                      <span className="font-medium">{tax.toFixed(2)} €</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>{isEnglish ? "Total" : "Gesamt"}</span>
                      <span>{total.toFixed(2)} €</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isEnglish
                        ? "All prices include VAT"
                        : "Alle Preise inkl. MwSt."}
                    </div>

                    <Button
                      onClick={() => setLocation("/shop/checkout")}
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      {isEnglish ? "Proceed to checkout" : "Zur Kasse"}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setLocation("/shop")}
                      className="w-full"
                    >
                      {isEnglish ? "Continue shopping" : "Weiter einkaufen"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

