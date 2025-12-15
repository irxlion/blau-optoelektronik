/**
 * Checkout-Erfolgsseite
 * Wird nach erfolgreicher Bestellung angezeigt
 */

import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CheckoutSuccess() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 flex items-center justify-center py-16 mt-20">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse" />
                <CheckCircle className="relative h-16 w-16 text-green-500" />
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4">
              {isEnglish ? "Order Confirmed!" : "Bestellung bestätigt!"}
            </h1>

            <p className="text-muted-foreground mb-6">
              {isEnglish
                ? "Thank you for your order. We have received your order and will process it shortly. You will receive a confirmation email shortly."
                : "Vielen Dank für Ihre Bestellung. Wir haben Ihre Bestellung erhalten und werden sie in Kürze bearbeiten. Sie erhalten in Kürze eine Bestätigungs-E-Mail."}
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => setLocation("/shop")}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isEnglish ? "Continue shopping" : "Weiter einkaufen"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/")}
                className="w-full"
              >
                {isEnglish ? "Back to homepage" : "Zur Startseite"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}

