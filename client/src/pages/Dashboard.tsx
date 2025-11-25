import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { fetchProducts, saveProducts } from "@/lib/api";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductForm } from "@/components/ProductForm";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, LogOut, Trash2 } from "lucide-react";

export default function Dashboard() {
    const [products, setProducts] = useState<{ de: Product[]; en: Product[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState<"de" | "en">("de");
    const [, setLocation] = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setLocation("/login");
            return;
        }
        loadProducts();
    }, [setLocation]);

    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (error) {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setLocation("/login");
    };

    const handleSaveProduct = async (product: Product) => {
        if (!products) return;

        const newProducts = { ...products };
        const list = newProducts[currentLang];
        const index = list.findIndex((p) => p.id === product.id);

        if (index >= 0) {
            list[index] = product;
        } else {
            list.push(product);
        }

        try {
            await saveProducts(newProducts);
            setProducts(newProducts);
            setIsFormOpen(false);
            toast.success("Product saved successfully");
        } catch (error) {
            toast.error("Failed to save product");
        }
    };

    const handleDelete = async (productId: string) => {
        if (!products || !confirm("Are you sure you want to delete this product?")) return;

        const newProducts = { ...products };
        newProducts[currentLang] = newProducts[currentLang].filter((p) => p.id !== productId);

        try {
            await saveProducts(newProducts);
            setProducts(newProducts);
            toast.success("Product deleted successfully");
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setEditingProduct(undefined);
        setIsFormOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={() => setCurrentLang(currentLang === "de" ? "en" : "de")}>
                            Switch to {currentLang === "de" ? "English" : "German"}
                        </Button>
                        <Button variant="destructive" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Products ({currentLang.toUpperCase()})</CardTitle>
                        <Button onClick={handleAdd}>
                            <Plus className="mr-2 h-4 w-4" /> Add Product
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            {products?.[currentLang].map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div>
                                            <h3 className="font-semibold">{product.name}</h3>
                                            <p className="text-sm text-gray-500">{product.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <ProductForm
                    open={isFormOpen}
                    onOpenChange={setIsFormOpen}
                    product={editingProduct}
                    onSave={handleSaveProduct}
                />
            </div>
        </div>
    );
}
