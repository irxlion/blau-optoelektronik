import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { fetchProducts, saveProducts } from "@/lib/api";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductForm } from "@/components/ProductForm";
import { CustomerManagement } from "@/components/CustomerManagement";
import { AdminManagement } from "@/components/AdminManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, LogOut, Trash2, Home, Package, Users, Shield } from "lucide-react";

export default function Dashboard() {
    const [products, setProducts] = useState<{ de: Product[]; en: Product[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState<"de" | "en">("de");
    const [userRole, setUserRole] = useState<'admin' | 'mitarbeiter' | null>(null);
    const [, setLocation] = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setLocation("/login");
            return;
        }
        
        // Prüfe ob Token Admin- oder Mitarbeiter-Rolle hat
        try {
            const tokenData = JSON.parse(atob(token));
            if (tokenData.role !== 'admin' && tokenData.role !== 'mitarbeiter') {
                localStorage.removeItem("authToken");
                setLocation("/login");
                return;
            }
            setUserRole(tokenData.role as 'admin' | 'mitarbeiter');
        } catch (e) {
            // Token ungültig
            localStorage.removeItem("authToken");
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
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* Header - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                        <Button 
                            variant="outline" 
                            onClick={() => setLocation("/")}
                            className="w-full sm:w-auto"
                        >
                            <Home className="mr-2 h-4 w-4" /> 
                            <span className="hidden sm:inline">Homepage</span>
                            <span className="sm:hidden">Home</span>
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleLogout}
                            className="w-full sm:w-auto"
                        >
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="products" className="space-y-4">
                    {/* Scrollable Tabs for Mobile */}
                    <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                        <TabsList className="w-full sm:w-fit min-w-max">
                            <TabsTrigger value="products" className="flex-shrink-0">
                                <Package className="mr-2 h-4 w-4" /> 
                                <span className="hidden sm:inline">Produkte</span>
                                <span className="sm:hidden">Prod.</span>
                            </TabsTrigger>
                            <TabsTrigger value="customers" className="flex-shrink-0">
                                <Users className="mr-2 h-4 w-4" /> 
                                <span className="hidden sm:inline">Kundenverwaltung</span>
                                <span className="sm:hidden">Kunden</span>
                            </TabsTrigger>
                            {userRole === 'admin' && (
                                <TabsTrigger value="admins" className="flex-shrink-0">
                                    <Shield className="mr-2 h-4 w-4" /> 
                                    <span className="hidden sm:inline">Admin-Verwaltung</span>
                                    <span className="sm:hidden">Admin</span>
                                </TabsTrigger>
                            )}
                        </TabsList>
                    </div>

                    <TabsContent value="products" className="space-y-4">
                <Card>
                            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <CardTitle className="text-xl sm:text-2xl">Produkte ({currentLang.toUpperCase()})</CardTitle>
                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setCurrentLang(currentLang === "de" ? "en" : "de")}
                                        className="w-full sm:w-auto text-sm"
                                    >
                                        {currentLang === "de" ? "EN" : "DE"}
                                    </Button>
                                    <Button 
                                        onClick={handleAdd}
                                        className="w-full sm:w-auto"
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> 
                                        <span className="hidden sm:inline">Produkt hinzufügen</span>
                                        <span className="sm:hidden">Hinzufügen</span>
                        </Button>
                                </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            {products?.[currentLang].map((product) => (
                                <div
                                    key={product.id}
                                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg bg-white shadow-sm gap-4"
                                >
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0"
                                        />
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-base sm:text-lg truncate">{product.name}</h3>
                                                    <p className="text-sm text-gray-500 truncate">{product.category}</p>
                                        </div>
                                    </div>
                                            <div className="flex gap-2 justify-end sm:justify-start">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleEdit(product)}
                                                    className="h-10 w-10"
                                                >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleDelete(product.id)}
                                                    className="h-10 w-10"
                                                >
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
                    </TabsContent>

                    <TabsContent value="customers" className="space-y-4">
                        <CustomerManagement />
                    </TabsContent>

                    {userRole === 'admin' && (
                        <TabsContent value="admins" className="space-y-4">
                            <AdminManagement />
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </div>
    );
}
