/**
 * Datenzugriffsschicht für Shop-Produkte
 * 
 * Aktuell: Mock-Implementierung mit Beispiel-Daten
 * 
 * TODO: Später durch echte Supabase/MCP-Aufrufe ersetzen
 * 
 * Integration:
 * 1. MCP-Supabase-Server muss konfiguriert sein
 * 2. Supabase-URL und Keys aus Umgebungsvariablen laden
 * 3. Funktionen unten durch echte MCP-Aufrufe ersetzen
 * 
 * Beispiel für MCP-Aufruf:
 * - mcp_supabase_execute_sql für SELECT-Abfragen
 * - mcp_supabase_list_tables für Schema-Informationen
 */

import { ShopProduct, ProductAsset, ProductFilters } from "@/types/shop";

/**
 * Mock-Daten für Entwicklung
 * Diese werden später durch echte Supabase-Daten ersetzt
 */
const MOCK_PRODUCTS: ShopProduct[] = [
  {
    id: "1",
    sku: "MV-450-50",
    name: "Machine Vision Laser 450nm",
    short_description: "Hochpräzises Lasermodul für industrielle Bildverarbeitung",
    long_description: "Das Machine Vision Laser Modul bietet optimale Genauigkeit und Messgeschwindigkeit für anspruchsvolle Bildverarbeitungsanwendungen.",
    category: "Machine Vision Lasermodule",
    wavelength_nm: 450,
    power_mw: 50,
    price_eur: 299.00,
    is_active: true,
  },
  {
    id: "2",
    sku: "LL-635-20",
    name: "Linienlaser 635nm",
    short_description: "Präzise Linienprojektion für Positionierung",
    long_description: "Hochwertiger Linienlaser mit exzellenter Linienhomogenität und präziser Ausrichtung.",
    category: "Linienlaser",
    wavelength_nm: 635,
    power_mw: 20,
    price_eur: 189.00,
    is_active: true,
  },
  {
    id: "3",
    sku: "PL-405-5",
    name: "Punktlaser 405nm",
    short_description: "Kompakter Punktlaser mit rundem Strahlprofil",
    long_description: "Punktlaser-Modul mit rundem Strahlprofil für vielfältige Einsatzbereiche.",
    category: "Punktlaser",
    wavelength_nm: 405,
    power_mw: 5,
    price_eur: 149.00,
    is_active: true,
  },
  {
    id: "4",
    sku: "MV-PULSE-100",
    name: "MVpulse 450nm",
    short_description: "Augensicherheit Laserklasse 2 mit hoher Leistung",
    long_description: "MVpulse-Lasermodul verbindet Augensicherheit nach Laserklasse 2 mit hoher Ausgangsleistung bis 100 mW.",
    category: "Machine Vision Lasermodule",
    wavelength_nm: 450,
    power_mw: 100,
    price_eur: 399.00,
    is_active: true,
  },
];

const MOCK_ASSETS: ProductAsset[] = [
  {
    id: "1",
    product_id: "1",
    type: "image",
    url: "/product-machine-vision.jpg",
  },
  {
    id: "2",
    product_id: "1",
    type: "datasheet_pdf",
    url: "/datasheets/mv-450-50-datasheet.pdf",
  },
  {
    id: "3",
    product_id: "2",
    type: "image",
    url: "/product-line-laser.jpg",
  },
  {
    id: "4",
    product_id: "2",
    type: "datasheet_pdf",
    url: "/datasheets/ll-635-20-datasheet.pdf",
  },
];

/**
 * Lädt alle Produkte mit optionalen Filtern
 * 
 * TODO: Ersetzen durch MCP/Supabase-Aufruf
 * 
 * Beispiel-Implementierung:
 * ```typescript
 * const query = `
 *   SELECT * FROM products 
 *   WHERE is_active = true
 *   ${filters.category ? `AND category = '${filters.category}'` : ''}
 *   ${filters.wavelengthMin ? `AND wavelength_nm >= ${filters.wavelengthMin}` : ''}
 *   ORDER BY name
 * `;
 * const result = await mcp_supabase_execute_sql({ query });
 * return result.rows.map(row => mapDbRowToShopProduct(row));
 * ```
 */
export async function listProducts(filters?: ProductFilters): Promise<ShopProduct[]> {
  // TODO: Hier Supabase via MCP abfragen
  // 1. SQL-Query basierend auf Filtern erstellen
  // 2. mcp_supabase_execute_sql aufrufen
  // 3. Ergebnisse zu ShopProduct[] mappen
  
  // Aktuell: Mock-Implementierung
  let products = [...MOCK_PRODUCTS];
  
  if (filters) {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower) ||
          p.short_description.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.category) {
      products = products.filter((p) => p.category === filters.category);
    }
    
    if (filters.wavelengthMin !== undefined) {
      products = products.filter(
        (p) => p.wavelength_nm !== null && p.wavelength_nm >= filters.wavelengthMin!
      );
    }
    
    if (filters.wavelengthMax !== undefined) {
      products = products.filter(
        (p) => p.wavelength_nm !== null && p.wavelength_nm <= filters.wavelengthMax!
      );
    }
    
    if (filters.powerMin !== undefined) {
      products = products.filter(
        (p) => p.power_mw !== null && p.power_mw >= filters.powerMin!
      );
    }
    
    if (filters.powerMax !== undefined) {
      products = products.filter(
        (p) => p.power_mw !== null && p.power_mw <= filters.powerMax!
      );
    }
    
    if (filters.priceMin !== undefined) {
      products = products.filter(
        (p) => p.price_eur !== null && p.price_eur >= filters.priceMin!
      );
    }
    
    if (filters.priceMax !== undefined) {
      products = products.filter(
        (p) => p.price_eur !== null && p.price_eur <= filters.priceMax!
      );
    }
    
    if (filters.isActive !== undefined) {
      products = products.filter((p) => p.is_active === filters.isActive);
    } else {
      // Standard: nur aktive Produkte
      products = products.filter((p) => p.is_active);
    }
  } else {
    // Standard: nur aktive Produkte
    products = products.filter((p) => p.is_active);
  }
  
  return products;
}

/**
 * Lädt ein einzelnes Produkt anhand der ID
 * 
 * TODO: Ersetzen durch MCP/Supabase-Aufruf
 * 
 * Beispiel-Implementierung:
 * ```typescript
 * const query = `SELECT * FROM products WHERE id = '${id}' AND is_active = true`;
 * const result = await mcp_supabase_execute_sql({ query });
 * if (result.rows.length === 0) return null;
 * return mapDbRowToShopProduct(result.rows[0]);
 * ```
 */
export async function getProductById(id: string): Promise<ShopProduct | null> {
  // TODO: Hier Supabase via MCP abfragen
  // const query = `SELECT * FROM products WHERE id = '${id}' AND is_active = true`;
  // const result = await mcp_supabase_execute_sql({ query });
  // if (result.rows.length === 0) return null;
  // return mapDbRowToShopProduct(result.rows[0]);
  
  // Aktuell: Mock-Implementierung
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  return product || null;
}

/**
 * Lädt alle Assets für ein Produkt
 * 
 * TODO: Ersetzen durch MCP/Supabase-Aufruf
 * 
 * Beispiel-Implementierung:
 * ```typescript
 * const query = `SELECT * FROM product_assets WHERE product_id = '${productId}' ORDER BY type`;
 * const result = await mcp_supabase_execute_sql({ query });
 * return result.rows.map(row => ({
 *   id: row.id,
 *   product_id: row.product_id,
 *   type: row.type,
 *   url: row.url
 * }));
 * ```
 */
export async function getAssetsForProduct(productId: string): Promise<ProductAsset[]> {
  // TODO: Hier Supabase via MCP abfragen
  // const query = `SELECT * FROM product_assets WHERE product_id = '${productId}' ORDER BY type`;
  // const result = await mcp_supabase_execute_sql({ query });
  // return result.rows.map(mapDbRowToProductAsset);
  
  // Aktuell: Mock-Implementierung
  return MOCK_ASSETS.filter((a) => a.product_id === productId);
}

/**
 * Lädt ein Produkt mit allen Assets
 * 
 * Diese Funktion kombiniert getProductById und getAssetsForProduct
 */
export async function getProductWithAssets(id: string): Promise<ShopProduct | null> {
  const product = await getProductById(id);
  if (!product) return null;
  
  const assets = await getAssetsForProduct(id);
  return {
    ...product,
    assets,
  };
}

/**
 * Lädt alle verfügbaren Kategorien
 * 
 * TODO: Ersetzen durch MCP/Supabase-Aufruf
 * 
 * Beispiel-Implementierung:
 * ```typescript
 * const query = `SELECT DISTINCT category FROM products WHERE is_active = true ORDER BY category`;
 * const result = await mcp_supabase_execute_sql({ query });
 * return result.rows.map(row => row.category);
 * ```
 */
export async function getCategories(): Promise<string[]> {
  // TODO: Hier Supabase via MCP abfragen
  // const query = `SELECT DISTINCT category FROM products WHERE is_active = true ORDER BY category`;
  // const result = await mcp_supabase_execute_sql({ query });
  // return result.rows.map(row => row.category);
  
  // Aktuell: Mock-Implementierung
  const categories = Array.from(new Set(MOCK_PRODUCTS.map((p) => p.category)));
  return categories.sort();
}

/**
 * Hilfsfunktion: Mappt eine Datenbank-Zeile zu ShopProduct
 * (Wird später verwendet, wenn echte Supabase-Daten kommen)
 */
function mapDbRowToShopProduct(row: any): ShopProduct {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    short_description: row.short_description || "",
    long_description: row.long_description || "",
    category: row.category || "",
    wavelength_nm: row.wavelength_nm ? Number(row.wavelength_nm) : null,
    power_mw: row.power_mw ? Number(row.power_mw) : null,
    price_eur: row.price_eur ? Number(row.price_eur) : null,
    is_active: row.is_active === true,
  };
}

/**
 * Hilfsfunktion: Mappt eine Datenbank-Zeile zu ProductAsset
 * (Wird später verwendet, wenn echte Supabase-Daten kommen)
 */
function mapDbRowToProductAsset(row: any): ProductAsset {
  return {
    id: row.id,
    product_id: row.product_id,
    type: row.type as ProductAssetType,
    url: row.url,
  };
}

