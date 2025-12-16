/**
 * TypeScript-Interfaces für Shop-Produkte
 * Diese Struktur entspricht dem Supabase-Datenmodell
 */

/**
 * Produkt-Asset-Typen (entspricht enum in Supabase)
 */
export type ProductAssetType = "image" | "datasheet_pdf" | "manual_pdf" | "other";

/**
 * Produkt-Asset (entspricht Tabelle product_assets)
 */
export interface ProductAsset {
  id: string;
  product_id: string;
  type: ProductAssetType;
  url: string;
}

/**
 * Shop-Produkt (entspricht Tabelle products)
 * Erweitert um Assets für einfachere Verwendung im Frontend
 */
export interface ShopProduct {
  id: string;
  sku: string;
  name: string;
  short_description: string;
  long_description: string;
  category: string;
  wavelength_nm: number | null;
  power_mw: number | null;
  price_eur: number | null;
  is_active: boolean;
  main_image_url?: string | null; // URL des Hauptbildes
  // Assets werden separat geladen und hier hinzugefügt
  assets?: ProductAsset[];
}

/**
 * Filter-Optionen für Produktsuche
 */
export interface ProductFilters {
  search?: string; // Suche nach Name, SKU, Beschreibung
  category?: string;
  wavelengthMin?: number;
  wavelengthMax?: number;
  powerMin?: number;
  powerMax?: number;
  priceMin?: number;
  priceMax?: number;
  isActive?: boolean; // Standard: true
}

/**
 * Warenkorb-Item
 */
export interface CartItem {
  product: ShopProduct;
  quantity: number;
  // Optionale Konfigurationen (z.B. Wellenlänge, Leistung)
  configuration?: {
    wavelength?: number;
    power?: number;
    [key: string]: any;
  };
}

/**
 * Checkout-Daten
 */
export interface CheckoutData {
  // Schritt 1: Kundendaten
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  billingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    sameAsBilling: boolean;
  };
  // Schritt 2: Versandart
  shippingMethod: string;
  // Schritt 3: Zahlungsart
  paymentMethod: "invoice" | "prepayment";
  // Schritt 4: AGB/Datenschutz
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

