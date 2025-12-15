import { Product } from "@/data/products";
import { Language } from "@/contexts/LanguageContext";
import { getProducts as getStaticProducts } from "@/data/products";

const MACHINE_VISION_LASERMODULE_CATEGORY = {
    de: "Machine Vision Lasermodule",
    en: "Machine Vision laser modules",
} as const;

function normalizeMachineVisionLaserModuleCategory(product: Product, language: Language): Product {
    const id = (product.id || "").toLowerCase();
    const isMachineVisionLaserModule =
        id === "machine-vision" ||
        id.startsWith("machine-vision-") ||
        id === "mvpulse" ||
        id.startsWith("mvpulse-") ||
        id.startsWith("mv-");

    if (!isMachineVisionLaserModule) return product;

    return {
        ...product,
        category: MACHINE_VISION_LASERMODULE_CATEGORY[language],
    };
}

export async function fetchProducts(): Promise<{ de: Product[]; en: Product[] }> {
    try {
        const response = await fetch("/api/products");
        
        // Prüfe ob die Antwort HTML ist (Fehler: Route nicht gefunden)
        const contentType = response.headers.get("content-type");
        if (contentType && !contentType.includes("application/json")) {
            const text = await response.text();
            if (text.trim().startsWith("<!") || text.includes("<!doctype")) {
                // Fallback zu statischen Produktdaten für Development
                console.warn("⚠️ API-Route nicht verfügbar. Verwende statische Produktdaten als Fallback.");
                console.warn("💡 Tipp: Verwenden Sie 'pnpm dev' (netlify dev) für vollständige API-Funktionalität.");
                return {
                    de: getStaticProducts("de").map((p) => normalizeMachineVisionLaserModuleCategory(p, "de")),
                    en: getStaticProducts("en").map((p) => normalizeMachineVisionLaserModuleCategory(p, "en")),
                };
            }
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = "Failed to fetch products";
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || errorData.details || errorMessage;
            } catch {
                errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
        
        const data = (await response.json()) as { de?: Product[]; en?: Product[] };
        return {
            de: (data.de || []).map((p) => normalizeMachineVisionLaserModuleCategory(p, "de")),
            en: (data.en || []).map((p) => normalizeMachineVisionLaserModuleCategory(p, "en")),
        };
    } catch (error: any) {
        // Wenn es ein Netzwerkfehler ist (API nicht erreichbar), verwende Fallback
        if (error.name === "TypeError" || error.message?.includes("fetch") || error.message?.includes("Failed to fetch")) {
            console.warn("⚠️ API nicht erreichbar. Verwende statische Produktdaten als Fallback.");
            console.warn("💡 Tipp: Verwenden Sie 'pnpm dev' (netlify dev) für vollständige API-Funktionalität.");
            return {
                de: getStaticProducts("de").map((p) => normalizeMachineVisionLaserModuleCategory(p, "de")),
                en: getStaticProducts("en").map((p) => normalizeMachineVisionLaserModuleCategory(p, "en")),
            };
        }
        throw new Error(`Fehler beim Laden der Produkte: ${error.message || "Unbekannter Fehler"}`);
    }
}

export async function saveProducts(products: { de: Product[]; en: Product[] }): Promise<void> {
    const response = await fetch("/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(products),
    });
    if (!response.ok) {
        throw new Error("Failed to save products");
    }
}

export async function login(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    const response = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || "Login failed" };
    }

    return response.json();
}

export async function customerLogin(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    const response = await fetch("/api/customer-login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || "Login failed" };
    }

    return response.json();
}

// Upload-Funktionen
function getAuthToken(): string {
    return localStorage.getItem("authToken") || "";
}

export async function uploadImage(productId: string, imageBase64: string, fileName?: string): Promise<{ success: boolean; url?: string; path?: string; error?: string }> {
    const response = await fetch("/api/upload-image", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ productId, imageBase64, fileName }),
    });

    if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || "Upload fehlgeschlagen" };
    }

    return response.json();
}

export async function deleteImage(filePath: string): Promise<{ success: boolean; error?: string }> {
    const response = await fetch("/api/upload-image", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ filePath }),
    });

    if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || "Löschen fehlgeschlagen" };
    }

    return response.json();
}

export async function uploadPDF(productId: string, pdfBase64: string, fileName?: string): Promise<{ success: boolean; url?: string; path?: string; fileName?: string; error?: string }> {
    const response = await fetch("/api/upload-pdf", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ productId, pdfBase64, fileName }),
    });

    if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || "Upload fehlgeschlagen" };
    }

    return response.json();
}

export async function deletePDF(filePath: string): Promise<{ success: boolean; error?: string }> {
    const response = await fetch("/api/upload-pdf", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ filePath }),
    });

    if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || "Löschen fehlgeschlagen" };
    }

    return response.json();
}

// Kundenverwaltung
export interface Customer {
    id: string;
    username: string;
    email?: string;
    company_name?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
    created_at?: string;
    updated_at?: string;
    last_login?: string;
    is_active: boolean;
}

export interface CustomersResponse {
    customers: Customer[];
    total: number;
    limit: number;
    offset: number;
}

export async function fetchCustomers(search?: string, isActive?: boolean, limit?: number, offset?: number): Promise<CustomersResponse> {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (isActive !== undefined) params.append("is_active", String(isActive));
    if (limit) params.append("limit", String(limit));
    if (offset) params.append("offset", String(offset));

    const response = await fetch(`/api/customers?${params.toString()}`, {
        headers: {
            "Authorization": `Bearer ${getAuthToken()}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch customers");
    }

    return response.json();
}

export async function createCustomer(customer: Omit<Customer, "id" | "created_at" | "updated_at" | "last_login"> & { password: string }): Promise<{ customer: Customer }> {
    const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(customer),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create customer");
    }

    return response.json();
}

export async function updateCustomer(customer: Partial<Customer> & { id: string; password?: string }): Promise<{ customer: Customer }> {
    const response = await fetch("/api/customers", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(customer),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update customer");
    }

    return response.json();
}

export async function deleteCustomer(id: string): Promise<void> {
    const response = await fetch("/api/customers", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ id }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete customer");
    }
}

// Admin-Verwaltung
export interface Admin {
    id: string;
    username: string;
    email?: string;
    role: 'admin' | 'mitarbeiter';
    created_at?: string;
    updated_at?: string;
    last_login?: string;
    is_active: boolean;
}

export interface AdminsResponse {
    admins: Admin[];
    total: number;
}

export async function fetchAdmins(search?: string): Promise<AdminsResponse> {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    const response = await fetch(`/api/admins?${params.toString()}`, {
        headers: {
            "Authorization": `Bearer ${getAuthToken()}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch admins");
    }

    return response.json();
}

export async function createAdmin(admin: Omit<Admin, "id" | "created_at" | "updated_at" | "last_login"> & { password: string }): Promise<{ admin: Admin }> {
    const response = await fetch("/api/admins", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(admin),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create admin");
    }

    return response.json();
}

export async function updateAdmin(admin: Partial<Admin> & { id: string; password?: string }): Promise<{ admin: Admin }> {
    const response = await fetch("/api/admins", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(admin),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update admin");
    }

    return response.json();
}

export async function deleteAdmin(id: string): Promise<void> {
    const response = await fetch("/api/admins", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ id }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete admin");
    }
}

// Karriere-Verwaltung
export interface Career {
    id: string;
    title: string;
    department?: string;
    location?: string;
    employmentType?: string;
    shortDescription?: string;
    description: string;
    requirements?: string;
    benefits?: string;
    salaryRange?: string;
    applicationEmail?: string;
    applicationUrl?: string;
    publishedAt?: string | null;
    isPublished: boolean;
}

export async function fetchCareers(includeUnpublished: boolean = false): Promise<{ de: Career[]; en: Career[] }> {
    try {
        const url = includeUnpublished ? "/api/careers?all=true" : "/api/careers";
        const response = await fetch(url);
        
        const contentType = response.headers.get("content-type");
        if (contentType && !contentType.includes("application/json")) {
            const text = await response.text();
            if (text.trim().startsWith("<!") || text.includes("<!doctype")) {
                console.warn("⚠️ API-Route nicht verfügbar. Verwende leere Liste als Fallback.");
                return { de: [], en: [] };
            }
        }
        
        if (!response.ok) {
            throw new Error("Failed to fetch careers");
        }
        
        return response.json();
    } catch (error: any) {
        console.warn("⚠️ API nicht erreichbar. Verwende leere Liste als Fallback.");
        return { de: [], en: [] };
    }
}

export async function saveCareers(careers: { de: Career[]; en: Career[] }): Promise<void> {
    const response = await fetch("/api/careers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(careers),
    });
    if (!response.ok) {
        throw new Error("Failed to save careers");
    }
}

export async function deleteCareer(jobId: string): Promise<void> {
    const response = await fetch(`/api/careers?job_id=${encodeURIComponent(jobId)}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getAuthToken()}`,
        },
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete career");
    }
}