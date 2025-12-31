import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { fetchProducts, saveProducts, deleteProduct } from "@/lib/api";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductForm } from "@/components/ProductForm";
import { CustomerManagement } from "@/components/CustomerManagement";
import { AdminManagement } from "@/components/AdminManagement";
import { CareerForm } from "@/components/CareerForm";
import { FAQForm } from "@/components/FAQForm";
import { fetchCareers, saveCareers, deleteCareer, Career, fetchFAQs, saveFAQs, deleteFAQ, FAQ, FAQCategory } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, LogOut, Trash2, Home, Package, Users, Shield, Briefcase, HelpCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Dashboard() {
    const { language } = useLanguage();
    const isEnglish = language === "en";
    const [products, setProducts] = useState<{ de: Product[]; en: Product[] } | null>(null);
    const [careers, setCareers] = useState<{ de: Career[]; en: Career[] } | null>(null);
    const [faqs, setFaqs] = useState<{ de: FAQCategory[]; en: FAQCategory[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [editingCareer, setEditingCareer] = useState<Career | undefined>(undefined);
    const [editingFAQ, setEditingFAQ] = useState<FAQ | undefined>(undefined);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isCareerFormOpen, setIsCareerFormOpen] = useState(false);
    const [isFAQFormOpen, setIsFAQFormOpen] = useState(false);
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
        loadCareers();
        loadFAQs();
    }, [setLocation]);

    useEffect(() => {
        // Lade Karriere-Stellen neu wenn sich die Sprache ändert
        loadCareers();
        loadFAQs();
    }, [currentLang]);

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

    const loadCareers = async () => {
        try {
            // Im Dashboard alle Stellen laden (auch nicht veröffentlichte)
            const data = await fetchCareers(true);
            // Stelle sicher, dass beide Sprachen existieren
            setCareers({
                de: data.de || [],
                en: data.en || [],
            });
        } catch (error) {
            console.error("Error loading careers:", error);
            toast.error(isEnglish ? "Failed to load career postings" : "Fehler beim Laden der Karriere-Stellen");
            // Fallback auf leere Arrays
            setCareers({ de: [], en: [] });
        }
    };

    const loadFAQs = async () => {
        try {
            const data = await fetchFAQs();
            console.log("Loaded FAQs:", data); // Debug log
            setFaqs({
                de: data.de || [],
                en: data.en || [],
            });
        } catch (error: any) {
            console.error("Error loading FAQs:", error);
            toast.error(isEnglish ? "Failed to load FAQs" : "Fehler beim Laden der FAQs");
            setFaqs({ de: [], en: [] });
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

        try {
            await deleteProduct(productId);
            // Produkte neu laden, um sicherzustellen, dass die DB aktualisiert wurde
            await loadProducts();
            toast.success("Product deleted successfully");
        } catch (error) {
            console.error("Error deleting product:", error);
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

    const handleSaveCareer = async (career: Career) => {
        // React-State-Updates sind asynchron: bei `careers === null` nie direkt danach
        // mit dem alten Wert weiterarbeiten, sondern mit einer lokal initialisierten Kopie.
        const baseCareers = careers ?? { de: [], en: [] };
        const newCareers: { de: Career[]; en: Career[] } = {
            de: [...(baseCareers.de ?? [])],
            en: [...(baseCareers.en ?? [])],
        };

        const list = [...newCareers[currentLang]];
        const index = list.findIndex((c) => c.id === career.id);

        if (index >= 0) {
            list[index] = career;
        } else {
            list.push(career);
        }
        newCareers[currentLang] = list;

        // Stelle sicher, dass beide Sprachen existieren
        // Wenn eine neue Stelle erstellt wird, erstelle auch einen Platzhalter für die andere Sprache
        const otherLang = currentLang === "de" ? "en" : "de";

        // Wenn es eine neue Stelle ist, erstelle auch einen Eintrag für die andere Sprache
        // (mit minimalen Daten, die später bearbeitet werden können)
        if (index < 0) {
            const otherLangCareer: Career = {
                ...career,
                title: career.title + ` (${otherLang.toUpperCase()})`,
                description: career.description || "",
            };
            // Prüfe ob bereits ein Eintrag für diese ID in der anderen Sprache existiert
            const otherList = [...newCareers[otherLang]];
            const otherIndex = otherList.findIndex((c) => c.id === career.id);
            if (otherIndex < 0) {
                otherList.push(otherLangCareer);
            }
            newCareers[otherLang] = otherList;
        }

        try {
            await saveCareers(newCareers);
            setCareers(newCareers);
            setIsCareerFormOpen(false);
            setEditingCareer(undefined);
            toast.success(isEnglish ? "Career posting saved successfully" : "Stelle erfolgreich gespeichert");
        } catch (error: any) {
            console.error("Error saving career:", error);
            const errorMessage = error.message || (isEnglish ? "Failed to save career posting" : "Fehler beim Speichern der Stelle");
            toast.error(errorMessage);
        }
    };

    const handleDeleteCareer = async (careerId: string) => {
        if (!careers || !confirm(isEnglish ? "Are you sure you want to delete this career posting?" : "Möchten Sie diese Stelle wirklich löschen?")) return;

        try {
            // Lösche die Stelle aus der Datenbank (beide Sprachen werden gelöscht)
            await deleteCareer(careerId);
            
            // Aktualisiere lokalen State
            const newCareers = { ...careers };
            newCareers.de = newCareers.de.filter((c) => c.id !== careerId);
            newCareers.en = newCareers.en.filter((c) => c.id !== careerId);
            setCareers(newCareers);
            
            toast.success(isEnglish ? "Career posting deleted successfully" : "Stelle erfolgreich gelöscht");
        } catch (error: any) {
            console.error("Error deleting career:", error);
            toast.error(isEnglish ? "Failed to delete career posting" : "Fehler beim Löschen der Stelle");
        }
    };

    const handleEditCareer = (career: Career) => {
        setEditingCareer(career);
        setIsCareerFormOpen(true);
    };

    const handleAddCareer = () => {
        // Stelle sicher, dass careers initialisiert ist
        if (!careers) {
            setCareers({ de: [], en: [] });
        }
        setEditingCareer(undefined);
        setIsCareerFormOpen(true);
    };

    const handleSaveFAQ = async (faq: FAQ) => {
        const baseFaqs = faqs ?? { de: [], en: [] };
        const newFaqs: { de: FAQCategory[]; en: FAQCategory[] } = {
            de: [...(baseFaqs.de ?? [])],
            en: [...(baseFaqs.en ?? [])],
        };

        const list = [...newFaqs[currentLang]];
        let categoryFound = false;
        let faqFound = false;

        // Suche nach der Kategorie und der FAQ
        for (let i = 0; i < list.length; i++) {
            if (list[i].category === faq.category) {
                categoryFound = true;
                const faqIndex = list[i].questions.findIndex((f) => f.id === faq.id);
                if (faqIndex >= 0) {
                    list[i].questions[faqIndex] = faq;
                    faqFound = true;
                } else {
                    list[i].questions.push(faq);
                }
                // Sortiere nach orderIndex
                list[i].questions.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
                break;
            }
        }

        // Wenn Kategorie nicht gefunden, erstelle sie
        if (!categoryFound) {
            list.push({
                category: faq.category,
                questions: [faq],
            });
        }

        newFaqs[currentLang] = list;

        // Stelle sicher, dass beide Sprachen existieren
        const otherLang = currentLang === "de" ? "en" : "de";
        if (!faqFound) {
            // Wenn es eine neue FAQ ist, erstelle auch einen Eintrag für die andere Sprache
            const otherList = [...newFaqs[otherLang]];
            let otherCategoryFound = false;
            for (let i = 0; i < otherList.length; i++) {
                if (otherList[i].category === faq.category) {
                    otherCategoryFound = true;
                    const otherFaqIndex = otherList[i].questions.findIndex((f) => f.id === faq.id);
                    if (otherFaqIndex < 0) {
                        otherList[i].questions.push({
                            ...faq,
                            question: faq.question + ` (${otherLang.toUpperCase()})`,
                            answer: faq.answer || "",
                        });
                    }
                    break;
                }
            }
            if (!otherCategoryFound) {
                otherList.push({
                    category: faq.category,
                    questions: [{
                        ...faq,
                        question: faq.question + ` (${otherLang.toUpperCase()})`,
                        answer: faq.answer || "",
                    }],
                });
            }
            newFaqs[otherLang] = otherList;
        }

        try {
            await saveFAQs(newFaqs);
            setFaqs(newFaqs);
            setIsFAQFormOpen(false);
            setEditingFAQ(undefined);
            toast.success(isEnglish ? "FAQ saved successfully" : "FAQ erfolgreich gespeichert");
        } catch (error: any) {
            console.error("Error saving FAQ:", error);
            const errorMessage = error.message || (isEnglish ? "Failed to save FAQ" : "Fehler beim Speichern der FAQ");
            toast.error(errorMessage);
        }
    };

    const handleDeleteFAQ = async (faqId: string) => {
        if (!faqs || !confirm(isEnglish ? "Are you sure you want to delete this FAQ?" : "Möchten Sie diese FAQ wirklich löschen?")) return;

        try {
            await deleteFAQ(faqId);
            
            // Aktualisiere lokalen State
            const newFaqs = { ...faqs };
            newFaqs.de = newFaqs.de.map((cat) => ({
                ...cat,
                questions: cat.questions.filter((f) => f.id !== faqId),
            })).filter((cat) => cat.questions.length > 0);
            newFaqs.en = newFaqs.en.map((cat) => ({
                ...cat,
                questions: cat.questions.filter((f) => f.id !== faqId),
            })).filter((cat) => cat.questions.length > 0);
            setFaqs(newFaqs);
            
            toast.success(isEnglish ? "FAQ deleted successfully" : "FAQ erfolgreich gelöscht");
        } catch (error: any) {
            console.error("Error deleting FAQ:", error);
            toast.error(isEnglish ? "Failed to delete FAQ" : "Fehler beim Löschen der FAQ");
        }
    };

    const handleEditFAQ = (faq: FAQ) => {
        setEditingFAQ(faq);
        setIsFAQFormOpen(true);
    };

    const handleAddFAQ = () => {
        if (!faqs) {
            setFaqs({ de: [], en: [] });
        }
        setEditingFAQ(undefined);
        setIsFAQFormOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
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
                                <span className="hidden sm:inline">{isEnglish ? "Products" : "Produkte"}</span>
                                <span className="sm:hidden">{isEnglish ? "Prod." : "Prod."}</span>
                            </TabsTrigger>
                            <TabsTrigger value="customers" className="flex-shrink-0">
                                <Users className="mr-2 h-4 w-4" /> 
                                <span className="hidden sm:inline">{isEnglish ? "Customers" : "Kundenverwaltung"}</span>
                                <span className="sm:hidden">{isEnglish ? "Cust." : "Kunden"}</span>
                            </TabsTrigger>
                            <TabsTrigger value="careers" className="flex-shrink-0">
                                <Briefcase className="mr-2 h-4 w-4" /> 
                                <span className="hidden sm:inline">{isEnglish ? "Careers" : "Karriere"}</span>
                                <span className="sm:hidden">{isEnglish ? "Careers" : "Karriere"}</span>
                            </TabsTrigger>
                            <TabsTrigger value="faqs" className="flex-shrink-0">
                                <HelpCircle className="mr-2 h-4 w-4" /> 
                                <span className="hidden sm:inline">{isEnglish ? "FAQs" : "FAQs"}</span>
                                <span className="sm:hidden">{isEnglish ? "FAQs" : "FAQs"}</span>
                            </TabsTrigger>
                            {userRole === 'admin' && (
                                <TabsTrigger value="admins" className="flex-shrink-0">
                                    <Shield className="mr-2 h-4 w-4" /> 
                                    <span className="hidden sm:inline">{isEnglish ? "Admin Management" : "Admin-Verwaltung"}</span>
                                    <span className="sm:hidden">{isEnglish ? "Admin" : "Admin"}</span>
                                </TabsTrigger>
                            )}
                        </TabsList>
                    </div>

                    <TabsContent value="products" className="space-y-4">
                        <Card>
                            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <CardTitle className="text-xl sm:text-2xl">{isEnglish ? "Products" : "Produkte"} ({currentLang.toUpperCase()})</CardTitle>
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
                                        <span className="hidden sm:inline">{isEnglish ? "Add product" : "Produkt hinzufügen"}</span>
                                        <span className="sm:hidden">{isEnglish ? "Add" : "Hinzufügen"}</span>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {products && products[currentLang] && products[currentLang].length > 0 ? (
                                            products[currentLang].map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg bg-white shadow-sm gap-4 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                                        {product.image && (
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0"
                                                            />
                                                        )}
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="font-semibold text-base sm:text-lg truncate">{product.name}</h3>
                                                            <p className="text-sm text-gray-500 truncate">{product.category}</p>
                                                            {product.description && (
                                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 justify-end sm:justify-start">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            onClick={() => handleEdit(product)}
                                                            className="h-10 w-10"
                                                            title={isEnglish ? "Edit" : "Bearbeiten"}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            onClick={() => handleDelete(product.id)}
                                                            className="h-10 w-10 text-red-500 hover:text-red-700"
                                                            title={isEnglish ? "Delete" : "Löschen"}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12">
                                                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-muted-foreground">
                                                    {isEnglish ? "No products found" : "Keine Produkte vorhanden"}
                                                </p>
                                                <Button 
                                                    onClick={handleAdd}
                                                    variant="outline"
                                                    className="mt-4"
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    {isEnglish ? "Add first product" : "Erstes Produkt hinzufügen"}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
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

                    <TabsContent value="careers" className="space-y-4">
                        <Card>
                            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <CardTitle className="text-xl sm:text-2xl">{isEnglish ? "Career Postings" : "Karriere-Stellen"} ({currentLang.toUpperCase()})</CardTitle>
                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setCurrentLang(currentLang === "de" ? "en" : "de")}
                                        className="w-full sm:w-auto text-sm"
                                    >
                                        {currentLang === "de" ? "EN" : "DE"}
                                    </Button>
                                    <Button 
                                        onClick={handleAddCareer}
                                        className="w-full sm:w-auto"
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> 
                                        <span className="hidden sm:inline">{isEnglish ? "Add job posting" : "Stelle hinzufügen"}</span>
                                        <span className="sm:hidden">{isEnglish ? "Add" : "Hinzufügen"}</span>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {careers && careers[currentLang] && careers[currentLang].length > 0 ? (
                                            careers[currentLang].map((career) => (
                                                <div
                                                    key={career.id}
                                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg bg-white shadow-sm gap-4 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-semibold text-base sm:text-lg truncate">{career.title}</h3>
                                                                {career.isPublished && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                                        {isEnglish ? "Published" : "Veröffentlicht"}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-500 truncate">
                                                                {career.department && `${career.department}${career.location ? " • " : ""}`}
                                                                {career.location}
                                                            </p>
                                                            {career.shortDescription && (
                                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{career.shortDescription}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 justify-end sm:justify-start">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            onClick={() => handleEditCareer(career)}
                                                            className="h-10 w-10"
                                                            title={isEnglish ? "Edit" : "Bearbeiten"}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            onClick={() => handleDeleteCareer(career.id)}
                                                            className="h-10 w-10 text-red-500 hover:text-red-700"
                                                            title={isEnglish ? "Delete" : "Löschen"}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12">
                                                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-muted-foreground">
                                                    {isEnglish ? "No job postings found" : "Keine Stellen vorhanden"}
                                                </p>
                                                <Button 
                                                    onClick={handleAddCareer}
                                                    variant="outline"
                                                    className="mt-4"
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    {isEnglish ? "Add first job posting" : "Erste Stelle hinzufügen"}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <CareerForm
                            open={isCareerFormOpen}
                            onOpenChange={(open) => {
                                setIsCareerFormOpen(open);
                                if (!open) {
                                    setEditingCareer(undefined);
                                }
                            }}
                            career={editingCareer}
                            onSave={handleSaveCareer}
                        />
                    </TabsContent>

                    <TabsContent value="faqs" className="space-y-4">
                        <Card>
                            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <CardTitle className="text-xl sm:text-2xl">{isEnglish ? "FAQs" : "FAQs"} ({currentLang.toUpperCase()})</CardTitle>
                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setCurrentLang(currentLang === "de" ? "en" : "de")}
                                        className="w-full sm:w-auto text-sm"
                                    >
                                        {currentLang === "de" ? "EN" : "DE"}
                                    </Button>
                                    <Button 
                                        onClick={handleAddFAQ}
                                        className="w-full sm:w-auto"
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> 
                                        <span className="hidden sm:inline">{isEnglish ? "Add FAQ" : "FAQ hinzufügen"}</span>
                                        <span className="sm:hidden">{isEnglish ? "Add" : "Hinzufügen"}</span>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {faqs && faqs[currentLang] && faqs[currentLang].length > 0 ? (
                                            faqs[currentLang].map((category, catIdx) => (
                                                <div key={`${currentLang}-${catIdx}-${category.category}`} className="space-y-3">
                                                    <h3 className="text-lg font-semibold border-b pb-2">{category.category}</h3>
                                                    <div className="space-y-2">
                                                        {category.questions.map((faq) => (
                                                            <div
                                                                key={faq.id}
                                                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg bg-white shadow-sm gap-4 hover:shadow-md transition-shadow"
                                                            >
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-semibold text-base mb-1">{faq.question}</h4>
                                                                    <p className="text-sm text-gray-600 line-clamp-2">{faq.answer}</p>
                                                                </div>
                                                                <div className="flex gap-2 justify-end sm:justify-start">
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="icon" 
                                                                        onClick={() => handleEditFAQ(faq)}
                                                                        className="h-10 w-10"
                                                                        title={isEnglish ? "Edit" : "Bearbeiten"}
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="icon" 
                                                                        onClick={() => handleDeleteFAQ(faq.id)}
                                                                        className="h-10 w-10 text-red-500 hover:text-red-700"
                                                                        title={isEnglish ? "Delete" : "Löschen"}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12">
                                                <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-muted-foreground">
                                                    {isEnglish ? "No FAQs found" : "Keine FAQs vorhanden"}
                                                </p>
                                                <Button 
                                                    onClick={handleAddFAQ}
                                                    variant="outline"
                                                    className="mt-4"
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    {isEnglish ? "Add first FAQ" : "Erste FAQ hinzufügen"}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <FAQForm
                            open={isFAQFormOpen}
                            onOpenChange={(open) => {
                                setIsFAQFormOpen(open);
                                if (!open) {
                                    setEditingFAQ(undefined);
                                }
                            }}
                            faq={editingFAQ}
                            onSave={handleSaveFAQ}
                        />
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
