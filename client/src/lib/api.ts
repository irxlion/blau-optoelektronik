import { Product } from "@/data/products";
import { Language } from "@/contexts/LanguageContext";

export async function fetchProducts(): Promise<{ de: Product[]; en: Product[] }> {
    const response = await fetch("/api/products");
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    return response.json();
}

export async function saveProducts(products: { de: Product[]; en: Product[] }): Promise<void> {
    const response = await fetch("/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
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
