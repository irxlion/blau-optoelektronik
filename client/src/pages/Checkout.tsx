/**
 * Checkout-Seite
 * Mehrstufiger Checkout-Prozess für B2B-Kunden
 */

import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { CheckoutData } from "@/types/shop";

type CheckoutStep = 1 | 2 | 3 | 4;

export default function Checkout() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const { items, getTotalPrice, clearCart } = useCart();
  const [, setLocation] = useLocation();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutData>({
    company: "",
    contactPerson: "",
    email: "",
    phone: "",
    billingAddress: {
      street: "",
      city: "",
      postalCode: "",
      country: "Deutschland",
    },
    shippingAddress: {
      street: "",
      city: "",
      postalCode: "",
      country: "Deutschland",
      sameAsBilling: true,
    },
    shippingMethod: "standard",
    paymentMethod: "invoice",
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutData, string | any>>>({});

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.19;
  const total = subtotal + tax;

  const validateStep = (step: CheckoutStep): boolean => {
    const newErrors: Partial<Record<keyof CheckoutData, string>> = {};

    if (step === 1) {
      if (!formData.company.trim()) newErrors.company = isEnglish ? "Required" : "Erforderlich";
      if (!formData.contactPerson.trim())
        newErrors.contactPerson = isEnglish ? "Required" : "Erforderlich";
      if (!formData.email.trim() || !formData.email.includes("@"))
        newErrors.email = isEnglish ? "Valid email required" : "Gültige E-Mail erforderlich";
      if (!formData.phone.trim()) newErrors.phone = isEnglish ? "Required" : "Erforderlich";
      if (!formData.billingAddress.street.trim()) {
        newErrors.billingAddress = newErrors.billingAddress || {};
        (newErrors.billingAddress as any).street = isEnglish ? "Required" : "Erforderlich";
      }
      if (!formData.billingAddress.city.trim()) {
        newErrors.billingAddress = newErrors.billingAddress || {};
        (newErrors.billingAddress as any).city = isEnglish ? "Required" : "Erforderlich";
      }
      if (!formData.billingAddress.postalCode.trim()) {
        newErrors.billingAddress = newErrors.billingAddress || {};
        (newErrors.billingAddress as any).postalCode = isEnglish ? "Required" : "Erforderlich";
      }
      if (!formData.shippingAddress.sameAsBilling) {
        if (!formData.shippingAddress.street.trim()) {
          newErrors.shippingAddress = newErrors.shippingAddress || {};
          (newErrors.shippingAddress as any).street = isEnglish ? "Required" : "Erforderlich";
        }
        if (!formData.shippingAddress.city.trim()) {
          newErrors.shippingAddress = newErrors.shippingAddress || {};
          (newErrors.shippingAddress as any).city = isEnglish ? "Required" : "Erforderlich";
        }
        if (!formData.shippingAddress.postalCode.trim()) {
          newErrors.shippingAddress = newErrors.shippingAddress || {};
          (newErrors.shippingAddress as any).postalCode = isEnglish ? "Required" : "Erforderlich";
        }
      }
    }

    if (step === 4) {
      if (!formData.acceptTerms)
        newErrors.acceptTerms = isEnglish ? "You must accept the terms" : "Sie müssen die AGB akzeptieren";
      if (!formData.acceptPrivacy)
        newErrors.acceptPrivacy = isEnglish ? "You must accept the privacy policy" : "Sie müssen die Datenschutzerklärung akzeptieren";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => (prev + 1) as CheckoutStep);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as CheckoutStep);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setLoading(true);
    try {
      // Bestellung an Backend/API senden
      const { createOrder } = await import("@/lib/api");
      
      const subtotal = getTotalPrice();
      const tax = subtotal * 0.19;
      const total = subtotal + tax;

      // Bestellpositionen vorbereiten
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        product_sku: item.product.sku,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price_eur || 0,
        total_price: (item.product.price_eur || 0) * item.quantity,
        configuration: item.configuration || {},
      }));

      // Bestellung erstellen
      await createOrder({
        company_name: formData.company,
        contact_person: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        billing_street: formData.billingAddress.street,
        billing_city: formData.billingAddress.city,
        billing_postal_code: formData.billingAddress.postalCode,
        billing_country: formData.billingAddress.country,
        shipping_street: formData.shippingAddress.sameAsBilling 
          ? formData.billingAddress.street 
          : formData.shippingAddress.street,
        shipping_city: formData.shippingAddress.sameAsBilling 
          ? formData.billingAddress.city 
          : formData.shippingAddress.city,
        shipping_postal_code: formData.shippingAddress.sameAsBilling 
          ? formData.billingAddress.postalCode 
          : formData.shippingAddress.postalCode,
        shipping_country: formData.shippingAddress.sameAsBilling 
          ? formData.billingAddress.country 
          : formData.shippingAddress.country,
        shipping_method: formData.shippingMethod,
        payment_method: formData.paymentMethod,
        subtotal_net: subtotal,
        tax_amount: tax,
        total_amount: total,
        items: orderItems,
        status: "pending",
      });

      // Erfolg: Warenkorb leeren und zur Bestätigungsseite
      clearCart();
      setLocation("/shop/checkout/success");
    } catch (error) {
      console.error("Fehler beim Absenden der Bestellung:", error);
      alert(isEnglish ? "Error submitting order" : "Fehler beim Absenden der Bestellung");
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = <K extends keyof CheckoutData>(
    key: K,
    value: CheckoutData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Fehler zurücksetzen
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-16 mt-20">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <p className="text-xl text-muted-foreground mb-4">
                {isEnglish ? "Your cart is empty" : "Ihr Warenkorb ist leer"}
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
              onClick={() => setLocation("/shop/cart")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {isEnglish ? "Back to cart" : "Zurück zum Warenkorb"}
            </Button>
          </div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-16 flex-1">
        <div className="container max-w-6xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        currentStep >= step
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step ? <Check className="h-5 w-5" /> : step}
                    </div>
                    <span className="text-xs mt-2 text-center hidden sm:block">
                      {step === 1 && (isEnglish ? "Customer Data" : "Kundendaten")}
                      {step === 2 && (isEnglish ? "Shipping" : "Versand")}
                      {step === 3 && (isEnglish ? "Payment" : "Zahlung")}
                      {step === 4 && (isEnglish ? "Summary" : "Zusammenfassung")}
                    </span>
                  </div>
                  {step < 4 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > step ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {currentStep === 1 && (isEnglish ? "Customer Information" : "Kundeninformationen")}
                    {currentStep === 2 && (isEnglish ? "Shipping Method" : "Versandart")}
                    {currentStep === 3 && (isEnglish ? "Payment Method" : "Zahlungsart")}
                    {currentStep === 4 && (isEnglish ? "Order Summary" : "Bestellübersicht")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Step 1: Customer Data */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="company">
                            {isEnglish ? "Company" : "Firma"} *
                          </Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => updateFormData("company", e.target.value)}
                            className={errors.company ? "border-destructive" : ""}
                          />
                          {errors.company && (
                            <p className="text-sm text-destructive mt-1">{errors.company}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="contactPerson">
                            {isEnglish ? "Contact Person" : "Ansprechpartner"} *
                          </Label>
                          <Input
                            id="contactPerson"
                            value={formData.contactPerson}
                            onChange={(e) => updateFormData("contactPerson", e.target.value)}
                            className={errors.contactPerson ? "border-destructive" : ""}
                          />
                          {errors.contactPerson && (
                            <p className="text-sm text-destructive mt-1">{errors.contactPerson}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">
                            {isEnglish ? "Email" : "E-Mail"} *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateFormData("email", e.target.value)}
                            className={errors.email ? "border-destructive" : ""}
                          />
                          {errors.email && (
                            <p className="text-sm text-destructive mt-1">{errors.email}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="phone">
                            {isEnglish ? "Phone" : "Telefon"} *
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateFormData("phone", e.target.value)}
                            className={errors.phone ? "border-destructive" : ""}
                          />
                          {errors.phone && (
                            <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <h3 className="font-semibold">
                        {isEnglish ? "Billing Address" : "Rechnungsadresse"} *
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="billingStreet">
                            {isEnglish ? "Street" : "Straße"} *
                          </Label>
                          <Input
                            id="billingStreet"
                            value={formData.billingAddress.street}
                            onChange={(e) =>
                              updateFormData("billingAddress", {
                                ...formData.billingAddress,
                                street: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="billingPostalCode">
                              {isEnglish ? "Postal Code" : "PLZ"} *
                            </Label>
                            <Input
                              id="billingPostalCode"
                              value={formData.billingAddress.postalCode}
                              onChange={(e) =>
                                updateFormData("billingAddress", {
                                  ...formData.billingAddress,
                                  postalCode: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingCity">
                              {isEnglish ? "City" : "Stadt"} *
                            </Label>
                            <Input
                              id="billingCity"
                              value={formData.billingAddress.city}
                              onChange={(e) =>
                                updateFormData("billingAddress", {
                                  ...formData.billingAddress,
                                  city: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="billingCountry">
                            {isEnglish ? "Country" : "Land"} *
                          </Label>
                          <Input
                            id="billingCountry"
                            value={formData.billingAddress.country}
                            onChange={(e) =>
                              updateFormData("billingAddress", {
                                ...formData.billingAddress,
                                country: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sameAsBilling"
                          checked={formData.shippingAddress.sameAsBilling}
                          onCheckedChange={(checked) =>
                            updateFormData("shippingAddress", {
                              ...formData.shippingAddress,
                              sameAsBilling: checked === true,
                            })
                          }
                        />
                        <Label htmlFor="sameAsBilling" className="cursor-pointer">
                          {isEnglish
                            ? "Shipping address same as billing address"
                            : "Lieferadresse entspricht Rechnungsadresse"}
                        </Label>
                      </div>

                      {!formData.shippingAddress.sameAsBilling && (
                        <>
                          <h3 className="font-semibold">
                            {isEnglish ? "Shipping Address" : "Lieferadresse"} *
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="shippingStreet">
                                {isEnglish ? "Street" : "Straße"} *
                              </Label>
                              <Input
                                id="shippingStreet"
                                value={formData.shippingAddress.street}
                                onChange={(e) =>
                                  updateFormData("shippingAddress", {
                                    ...formData.shippingAddress,
                                    street: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="shippingPostalCode">
                                  {isEnglish ? "Postal Code" : "PLZ"} *
                                </Label>
                                <Input
                                  id="shippingPostalCode"
                                  value={formData.shippingAddress.postalCode}
                                  onChange={(e) =>
                                    updateFormData("shippingAddress", {
                                      ...formData.shippingAddress,
                                      postalCode: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="shippingCity">
                                  {isEnglish ? "City" : "Stadt"} *
                                </Label>
                                <Input
                                  id="shippingCity"
                                  value={formData.shippingAddress.city}
                                  onChange={(e) =>
                                    updateFormData("shippingAddress", {
                                      ...formData.shippingAddress,
                                      city: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="shippingCountry">
                                {isEnglish ? "Country" : "Land"} *
                              </Label>
                              <Input
                                id="shippingCountry"
                                value={formData.shippingAddress.country}
                                onChange={(e) =>
                                  updateFormData("shippingAddress", {
                                    ...formData.shippingAddress,
                                    country: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Step 2: Shipping */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <RadioGroup
                        value={formData.shippingMethod}
                        onValueChange={(value) => updateFormData("shippingMethod", value)}
                      >
                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard" className="flex-1 cursor-pointer">
                            <div>
                              <div className="font-medium">
                                {isEnglish ? "Standard Shipping" : "Standardversand"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {isEnglish ? "5-7 business days" : "5-7 Werktage"}
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express" className="flex-1 cursor-pointer">
                            <div>
                              <div className="font-medium">
                                {isEnglish ? "Express Shipping" : "Expressversand"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {isEnglish ? "2-3 business days" : "2-3 Werktage"}
                              </div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                      <p className="text-sm text-muted-foreground">
                        {isEnglish
                          ? "Shipping costs will be calculated after order confirmation."
                          : "Versandkosten werden nach Bestätigung der Bestellung berechnet."}
                      </p>
                    </div>
                  )}

                  {/* Step 3: Payment */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <RadioGroup
                        value={formData.paymentMethod}
                        onValueChange={(value) =>
                          updateFormData("paymentMethod", value as "invoice" | "prepayment")
                        }
                      >
                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                          <RadioGroupItem value="invoice" id="invoice" />
                          <Label htmlFor="invoice" className="flex-1 cursor-pointer">
                            <div>
                              <div className="font-medium">
                                {isEnglish ? "Invoice" : "Rechnung"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {isEnglish
                                  ? "Payment within 14 days"
                                  : "Zahlung innerhalb von 14 Tagen"}
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                          <RadioGroupItem value="prepayment" id="prepayment" />
                          <Label htmlFor="prepayment" className="flex-1 cursor-pointer">
                            <div>
                              <div className="font-medium">
                                {isEnglish ? "Prepayment" : "Vorkasse"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {isEnglish
                                  ? "Payment in advance"
                                  : "Zahlung im Voraus"}
                              </div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                      <p className="text-sm text-muted-foreground">
                        {isEnglish
                          ? "Payment details will be sent via email after order confirmation."
                          : "Zahlungsdetails werden nach Bestätigung der Bestellung per E-Mail versendet."}
                      </p>
                    </div>
                  )}

                  {/* Step 4: Summary */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-4">
                          {isEnglish ? "Customer Information" : "Kundeninformationen"}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>{isEnglish ? "Company" : "Firma"}:</strong> {formData.company}
                          </p>
                          <p>
                            <strong>{isEnglish ? "Contact" : "Ansprechpartner"}:</strong>{" "}
                            {formData.contactPerson}
                          </p>
                          <p>
                            <strong>Email:</strong> {formData.email}
                          </p>
                          <p>
                            <strong>{isEnglish ? "Phone" : "Telefon"}:</strong> {formData.phone}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-semibold mb-4">
                          {isEnglish ? "Order Items" : "Bestellpositionen"}
                        </h3>
                        <div className="space-y-2">
                          {items.map((item) => (
                            <div
                              key={item.product.id}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {item.product.name} x {item.quantity}
                              </span>
                              <span>
                                {((item.product.price_eur || 0) * item.quantity).toFixed(2)} €
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="acceptTerms"
                            checked={formData.acceptTerms}
                            onCheckedChange={(checked) =>
                              updateFormData("acceptTerms", checked === true)
                            }
                            className={errors.acceptTerms ? "border-destructive" : ""}
                          />
                          <Label htmlFor="acceptTerms" className="cursor-pointer">
                            {isEnglish ? "I accept the " : "Ich akzeptiere die "}
                            <a
                              href="/agb"
                              target="_blank"
                              className="text-primary hover:underline"
                            >
                              {isEnglish ? "Terms and Conditions" : "AGB"}
                            </a>
                            *
                          </Label>
                        </div>
                        {errors.acceptTerms && (
                          <p className="text-sm text-destructive">{errors.acceptTerms}</p>
                        )}

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="acceptPrivacy"
                            checked={formData.acceptPrivacy}
                            onCheckedChange={(checked) =>
                              updateFormData("acceptPrivacy", checked === true)
                            }
                            className={errors.acceptPrivacy ? "border-destructive" : ""}
                          />
                          <Label htmlFor="acceptPrivacy" className="cursor-pointer">
                            {isEnglish ? "I accept the " : "Ich akzeptiere die "}
                            <a
                              href="/datenschutz"
                              target="_blank"
                              className="text-primary hover:underline"
                            >
                              {isEnglish ? "Privacy Policy" : "Datenschutzerklärung"}
                            </a>
                            *
                          </Label>
                        </div>
                        {errors.acceptPrivacy && (
                          <p className="text-sm text-destructive">{errors.acceptPrivacy}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={currentStep === 1}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {isEnglish ? "Back" : "Zurück"}
                    </Button>
                    {currentStep < 4 ? (
                      <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
                        {isEnglish ? "Next" : "Weiter"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {isEnglish ? "Processing..." : "Wird verarbeitet..."}
                          </>
                        ) : (
                          <>
                            {isEnglish ? "Place Order" : "Kostenpflichtig bestellen"}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>
                    {isEnglish ? "Order Summary" : "Bestellübersicht"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.product.name} x {item.quantity}
                        </span>
                        <span>
                          {((item.product.price_eur || 0) * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {isEnglish ? "Subtotal (net)" : "Zwischensumme (netto)"}
                      </span>
                      <span>{subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {isEnglish ? "VAT (19%)" : "MwSt. (19%)"}
                      </span>
                      <span>{tax.toFixed(2)} €</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>{isEnglish ? "Total" : "Gesamt"}</span>
                      <span>{total.toFixed(2)} €</span>
                    </div>
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

