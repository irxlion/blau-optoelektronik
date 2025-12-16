/**
 * Datenzugriffsschicht für Shop-Produkte
 * Verbunden mit Supabase über Netlify Functions API
 */

import { ShopProduct, ProductAsset, ProductFilters } from "@/types/shop";

// Mock-Daten wurden entfernt - alle Produkte kommen jetzt aus der Datenbank

/**
 * Lädt alle Produkte mit optionalen Filtern
 */
export async function listProducts(filters?: ProductFilters): Promise<ShopProduct[]> {
  try {
    const response = await fetch("/api/shop-products");
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const products: ShopProduct[] = await response.json();
    
    // Client-seitige Filterung
    let filteredProducts = products;
    
    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.sku.toLowerCase().includes(searchLower) ||
            p.short_description.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.category) {
        filteredProducts = filteredProducts.filter((p) => p.category === filters.category);
      }
      
      if (filters.wavelengthMin !== undefined) {
        filteredProducts = filteredProducts.filter(
          (p) => p.wavelength_nm !== null && p.wavelength_nm >= filters.wavelengthMin!
        );
      }
      
      if (filters.wavelengthMax !== undefined) {
        filteredProducts = filteredProducts.filter(
          (p) => p.wavelength_nm !== null && p.wavelength_nm <= filters.wavelengthMax!
        );
      }
      
      if (filters.powerMin !== undefined) {
        filteredProducts = filteredProducts.filter(
          (p) => p.power_mw !== null && p.power_mw >= filters.powerMin!
        );
      }
      
      if (filters.powerMax !== undefined) {
        filteredProducts = filteredProducts.filter(
          (p) => p.power_mw !== null && p.power_mw <= filters.powerMax!
        );
      }
      
      if (filters.priceMin !== undefined) {
        filteredProducts = filteredProducts.filter(
          (p) => p.price_eur !== null && p.price_eur >= filters.priceMin!
        );
      }
      
      if (filters.priceMax !== undefined) {
        filteredProducts = filteredProducts.filter(
          (p) => p.price_eur !== null && p.price_eur <= filters.priceMax!
        );
      }
      
      if (filters.isActive !== undefined) {
        filteredProducts = filteredProducts.filter((p) => p.is_active === filters.isActive);
      } else {
        // Standard: nur aktive Produkte
        filteredProducts = filteredProducts.filter((p) => p.is_active);
      }
    } else {
      // Standard: nur aktive Produkte
      filteredProducts = filteredProducts.filter((p) => p.is_active);
    }
    
    return filteredProducts;
  } catch (error: any) {
    console.error("Fehler beim Laden der Produkte:", error);
    // Keine Mock-Daten mehr - nur leeres Array zurückgeben
    return [];
  }
}

/**
 * Lädt ein einzelnes Produkt anhand der ID
 */
export async function getProductById(id: string): Promise<ShopProduct | null> {
  try {
    const response = await fetch("/api/shop-products");
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const products: ShopProduct[] = await response.json();
    const product = products.find((p) => p.id === id);
    return product || null;
  } catch (error: any) {
    console.error("Fehler beim Laden des Produkts:", error);
    // Keine Mock-Daten mehr
    return null;
  }
}

/**
 * Lädt alle Assets für ein Produkt
 */
export async function getAssetsForProduct(productId: string): Promise<ProductAsset[]> {
  try {
    const product = await getProductById(productId);
    return product?.assets || [];
  } catch (error: any) {
    console.error("Fehler beim Laden der Assets:", error);
    // Keine Mock-Daten mehr
    return [];
  }
}

/**
 * Lädt ein Produkt mit allen Assets
 * 
 * Diese Funktion kombiniert getProductById und getAssetsForProduct
 */
export async function getProductWithAssets(id: string): Promise<ShopProduct | null> {
  try {
    // Versuche direkt über die API zu laden (enthält bereits Assets)
    const response = await fetch("/api/shop-products");
    
    if (response.ok) {
      const products: ShopProduct[] = await response.json();
      const product = products.find((p) => p.id === id);
      if (product) {
        // Stelle sicher, dass Assets korrekt konvertiert sind
        return {
          ...product,
          assets: product.assets?.map((a: any) => ({
            id: a.id,
            product_id: a.product_id,
            type: a.type as ProductAsset["type"],
            url: a.url,
          })) || [],
        };
      }
    }
    
    // Fallback: Lade Produkt und Assets separat
    const product = await getProductById(id);
    if (!product) return null;
    
    const assets = await getAssetsForProduct(id);
    return {
      ...product,
      assets,
    };
  } catch (error: any) {
    console.error("Fehler beim Laden des Produkts mit Assets:", error);
    // Keine Mock-Daten mehr
    return null;
  }
}

/**
 * Lädt alle verfügbaren Kategorien
 */
export async function getCategories(): Promise<string[]> {
  try {
    const products = await listProducts();
    const categories = Array.from(new Set(products.map((p) => p.category)));
    return categories.sort();
  } catch (error: any) {
    console.error("Fehler beim Laden der Kategorien:", error);
    // Keine Mock-Daten mehr
    return [];
  }
}


