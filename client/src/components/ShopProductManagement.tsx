import { useState, useEffect, useRef } from "react";
import { ShopProduct, ProductAsset } from "@/types/shop";
import { listProducts, getProductWithAssets, getCategories } from "@/lib/shopData";
import { uploadImage, deleteImage, uploadPDF, deletePDF, fetchShopProducts, createShopProduct, updateShopProduct, deleteShopProduct } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { DragDropUpload } from "@/components/DragDropUpload";
import { ImageManager } from "@/components/ImageManager";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Image as ImageIcon, FileText, Loader2, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ShopProductManagement() {
    const { language } = useLanguage();
    const isEnglish = language === "en";
    const [products, setProducts] = useState<ShopProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ShopProduct | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingPDF, setUploadingPDF] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);

    const [formData, setFormData] = useState<Partial<ShopProduct>>({
        sku: "",
        name: "",
        short_description: "",
        long_description: "",
        category: "",
        wavelength_nm: null,
        power_mw: null,
        price_eur: null,
        is_active: true,
    });

    const [productAssets, setProductAssets] = useState<ProductAsset[]>([]);
    const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    useEffect(() => {
        if (editingProduct) {
            setFormData({
                sku: editingProduct.sku,
                name: editingProduct.name,
                short_description: editingProduct.short_description,
                long_description: editingProduct.long_description,
                category: editingProduct.category,
                wavelength_nm: editingProduct.wavelength_nm,
                power_mw: editingProduct.power_mw,
                price_eur: editingProduct.price_eur,
                is_active: editingProduct.is_active,
            });
            setProductAssets(editingProduct.assets || []);
            // Setze Hauptbild aus main_image_url oder erstes Bild
            const mainImage = editingProduct.main_image_url;
            if (mainImage) {
                setMainImageUrl(mainImage);
            } else {
                const firstImage = editingProduct.assets?.find((a) => a.type === "image");
                setMainImageUrl(firstImage?.url || null);
            }
        } else {
            setFormData({
                sku: "",
                name: "",
                short_description: "",
                long_description: "",
                category: "",
                wavelength_nm: null,
                power_mw: null,
                price_eur: null,
                is_active: true,
            });
            setProductAssets([]);
            setMainImageUrl(null);
        }
    }, [editingProduct, isFormOpen]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            // Versuche zuerst die API zu verwenden
            const data = await fetchShopProducts();
            // Konvertiere API-Daten zu ShopProduct-Format
            const convertedProducts: ShopProduct[] = data.map((p) => ({
                id: p.id,
                sku: p.sku,
                name: p.name,
                short_description: p.short_description || "",
                long_description: p.long_description || "",
                category: p.category,
                wavelength_nm: p.wavelength_nm,
                power_mw: p.power_mw,
                price_eur: p.price_eur ? Number(p.price_eur) : null,
                is_active: p.is_active,
                assets: p.assets?.map((a) => ({
                    id: a.id,
                    product_id: a.product_id,
                    type: a.type as ProductAsset["type"],
                    url: a.url,
                })),
            }));
            setProducts(convertedProducts);
        } catch (error: any) {
            console.error("Error loading products:", error);
            // Nur Fehler anzeigen, wenn es nicht ein Netzwerkfehler oder leere Datenbank ist
            if (!error.message?.includes("fetch") && !error.message?.includes("Failed to fetch")) {
                toast.error(
                    isEnglish 
                        ? "Failed to load products. Please check your connection." 
                        : "Fehler beim Laden der Produkte. Bitte überprüfen Sie Ihre Verbindung."
                );
            }
            // Setze leeres Array als Fallback
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const cats = await getCategories();
            setCategories(cats);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleEdit = async (product: ShopProduct) => {
        try {
            // Produkt mit Assets laden
            const productWithAssets = await getProductWithAssets(product.id);
            setEditingProduct(productWithAssets || product);
            setIsFormOpen(true);
        } catch (error) {
            console.error("Error loading product:", error);
            toast.error(isEnglish ? "Failed to load product" : "Fehler beim Laden des Produkts");
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm(isEnglish ? "Are you sure you want to delete this product?" : "Möchten Sie dieses Produkt wirklich löschen?")) {
            return;
        }

        try {
            await deleteShopProduct(productId);
            setProducts(products.filter((p) => p.id !== productId));
            toast.success(isEnglish ? "Product deleted" : "Produkt gelöscht");
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error(isEnglish ? "Failed to delete product" : "Fehler beim Löschen");
        }
    };

    const handleImageUpload = async (file: File) => {
        if (!formData.sku && !editingProduct?.id) {
            toast.error(isEnglish ? "Please enter SKU first" : "Bitte geben Sie zuerst eine SKU ein");
            return;
        }

        const productId = editingProduct?.id || formData.sku || "new";
        setUploadingImage(true);

        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                const result = await uploadImage(productId, base64, file.name);

                if (result.success && result.url) {
                    const newAsset: ProductAsset = {
                        id: `temp-${Date.now()}`,
                        product_id: productId,
                        type: "image",
                        url: result.url,
                    };
                    setProductAssets((prev) => [...prev, newAsset]);
                    // Setze als Hauptbild wenn noch keines vorhanden
                    if (!mainImageUrl) {
                        setMainImageUrl(result.url);
                    }
                    toast.success(isEnglish ? "Image uploaded" : "Bild hochgeladen");
                } else {
                    toast.error(result.error || (isEnglish ? "Upload failed" : "Upload fehlgeschlagen"));
                }
                setUploadingImage(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            toast.error(isEnglish ? "Upload error" : "Fehler beim Upload");
            setUploadingImage(false);
        }
    };

    const handlePDFUpload = async (file: File) => {
        // Für neue Produkte: SKU ist erforderlich
        if (!editingProduct && !formData.sku) {
            toast.error(isEnglish ? "Please enter SKU first" : "Bitte geben Sie zuerst eine SKU ein");
            return;
        }

        // Verwende Produkt-ID wenn vorhanden, sonst SKU (wird später durch echte ID ersetzt)
        const productId = editingProduct?.id || formData.sku || "new";
        setUploadingPDF(true);

        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                const result = await uploadPDF(productId, base64, file.name);

                if (result.success && result.url) {
                    // Bestimme Typ basierend auf Dateinamen
                    const type = file.name.toLowerCase().includes("datasheet") || file.name.toLowerCase().includes("datenblatt")
                        ? "datasheet_pdf"
                        : file.name.toLowerCase().includes("manual") || file.name.toLowerCase().includes("handbuch")
                        ? "manual_pdf"
                        : "other";

                    const newAsset: ProductAsset = {
                        id: `temp-${Date.now()}`,
                        product_id: productId,
                        type: type as ProductAsset["type"],
                        url: result.url,
                    };
                    setProductAssets((prev) => [...prev, newAsset]);
                    toast.success(isEnglish ? "PDF uploaded successfully" : "PDF erfolgreich hochgeladen");
                    console.log("PDF Asset hinzugefügt:", newAsset);
                } else {
                    toast.error(result.error || (isEnglish ? "Upload failed" : "Upload fehlgeschlagen"));
                    console.error("PDF Upload Fehler:", result);
                }
                setUploadingPDF(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            toast.error(isEnglish ? "Upload error" : "Fehler beim Upload");
            setUploadingPDF(false);
        }
    };

    const handleAssetDelete = async (asset: ProductAsset) => {
        try {
            // Wenn es ein hochgeladenes Asset ist (enthält "products/")
            if (asset.url.includes("products/")) {
                const path = asset.url.split("/").slice(-3).join("/"); // Extrahiere den Pfad
                if (asset.type === "image") {
                    const result = await deleteImage(path);
                    if (!result.success) {
                        toast.error(result.error || (isEnglish ? "Delete failed" : "Löschen fehlgeschlagen"));
                        return;
                    }
                } else {
                    const result = await deletePDF(path);
                    if (!result.success) {
                        toast.error(result.error || (isEnglish ? "Delete failed" : "Löschen fehlgeschlagen"));
                        return;
                    }
                }
            }

            setProductAssets((prev) => prev.filter((a) => a.id !== asset.id));
            
            // Entferne Hauptbild wenn es gelöscht wird
            if (asset.type === "image" && mainImageUrl === asset.url) {
                const remainingImages = productAssets.filter((a) => a.id !== asset.id && a.type === "image");
                setMainImageUrl(remainingImages[0]?.url || null);
            }
            
            toast.success(isEnglish ? "Asset deleted" : "Asset gelöscht");
        } catch (error) {
            toast.error(isEnglish ? "Delete error" : "Fehler beim Löschen");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Sortiere Assets: Hauptbild zuerst, dann andere Bilder, dann PDFs
            const sortedAssets = [...productAssets].sort((a, b) => {
                // Hauptbild zuerst
                if (mainImageUrl) {
                    if (a.url === mainImageUrl && a.type === "image") return -1;
                    if (b.url === mainImageUrl && b.type === "image") return 1;
                }
                // Dann Bilder
                if (a.type === "image" && b.type !== "image") return -1;
                if (a.type !== "image" && b.type === "image") return 1;
                // Dann PDFs nach Typ
                if (a.type === "datasheet_pdf" && b.type !== "datasheet_pdf") return -1;
                if (a.type !== "datasheet_pdf" && b.type === "datasheet_pdf") return 1;
                return 0;
            });

            const productData = {
                sku: formData.sku!,
                name: formData.name!,
                short_description: formData.short_description!,
                long_description: formData.long_description!,
                category: formData.category!,
                wavelength_nm: formData.wavelength_nm,
                power_mw: formData.power_mw,
                price_eur: formData.price_eur,
                is_active: formData.is_active ?? true,
                main_image_url: mainImageUrl || null, // Hauptbild speichern
                assets: sortedAssets.map((a) => ({
                    type: a.type,
                    url: a.url,
                })),
            };

            console.log("Speichere Produkt mit Assets:", productData);

            if (editingProduct) {
                // Update
                const updated = await updateShopProduct({
                    id: editingProduct.id,
                    ...productData,
                });
                
                // Konvertiere zurück zu ShopProduct
                const convertedProduct: ShopProduct = {
                    id: updated.id,
                    sku: updated.sku,
                    name: updated.name,
                    short_description: updated.short_description,
                    long_description: updated.long_description,
                    category: updated.category,
                    wavelength_nm: updated.wavelength_nm,
                    power_mw: updated.power_mw,
                    price_eur: updated.price_eur,
                    is_active: updated.is_active,
                    assets: updated.assets?.map((a) => ({
                        id: a.id,
                        product_id: a.product_id,
                        type: a.type as ProductAsset["type"],
                        url: a.url,
                    })),
                };
                
                setProducts(products.map((p) => (p.id === editingProduct.id ? convertedProduct : p)));
                toast.success(isEnglish ? "Product updated" : "Produkt aktualisiert");
            } else {
                // Create
                const created = await createShopProduct(productData);
                
                // Konvertiere zurück zu ShopProduct
                const convertedProduct: ShopProduct = {
                    id: created.id,
                    sku: created.sku,
                    name: created.name,
                    short_description: created.short_description,
                    long_description: created.long_description,
                    category: created.category,
                    wavelength_nm: created.wavelength_nm,
                    power_mw: created.power_mw,
                    price_eur: created.price_eur ? Number(created.price_eur) : null,
                    is_active: created.is_active,
                    assets: created.assets?.map((a) => ({
                        id: a.id,
                        product_id: a.product_id,
                        type: a.type as ProductAsset["type"],
                        url: a.url,
                    })) || [],
                };
                
                console.log("Neues Produkt erstellt mit Assets:", convertedProduct);
                setProducts([...products, convertedProduct]);
                toast.success(isEnglish ? "Product created" : "Produkt erstellt");
            }

            setIsFormOpen(false);
            setEditingProduct(null);
        } catch (error: any) {
            console.error("Error saving product:", error);
            toast.error(error.message || (isEnglish ? "Failed to save product" : "Fehler beim Speichern"));
        }
    };

    const images = productAssets.filter((a) => a.type === "image");
    const pdfs = productAssets.filter((a) => a.type === "datasheet_pdf" || a.type === "manual_pdf" || a.type === "other");

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        {isEnglish ? "Shop Products" : "Shop-Produkte"}
                    </CardTitle>
                    <Button onClick={handleAdd} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        {isEnglish ? "Add Product" : "Produkt hinzufügen"}
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        {products.length === 0 ? (
                            <div className="text-center py-12">
                                <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-lg font-medium text-gray-700 mb-2">
                                    {isEnglish ? "No products found" : "Keine Produkte gefunden"}
                                </p>
                                <p className="text-sm text-muted-foreground mb-6">
                                    {isEnglish 
                                        ? "Create your first shop product to get started." 
                                        : "Erstellen Sie Ihr erstes Shop-Produkt, um zu beginnen."}
                                </p>
                                <Button onClick={handleAdd} variant="default" size="lg">
                                    <Plus className="mr-2 h-5 w-5" />
                                    {isEnglish ? "Create First Product" : "Erstes Produkt erstellen"}
                                </Button>
                            </div>
                        ) : (
                            products.map((product) => {
                                const productImage = product.assets?.find((a) => a.type === "image")?.url;
                                return (
                                    <div
                                        key={product.id}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg bg-white shadow-sm gap-4"
                                    >
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            {productImage ? (
                                                <img
                                                    src={productImage}
                                                    alt={product.name}
                                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-semibold text-base sm:text-lg truncate">{product.name}</h3>
                                                <p className="text-sm text-gray-500 truncate">{product.sku}</p>
                                                <p className="text-sm text-gray-500 truncate">{product.category}</p>
                                                {product.price_eur && (
                                                    <p className="text-sm font-medium text-green-600">
                                                        €{product.price_eur.toFixed(2)}
                                                    </p>
                                                )}
                                                {!product.is_active && (
                                                    <span className="inline-block mt-1 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                                                        {isEnglish ? "Inactive" : "Inaktiv"}
                                                    </span>
                                                )}
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
                                );
                            })
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProduct
                                ? isEnglish
                                    ? "Edit Product"
                                    : "Produkt bearbeiten"
                                : isEnglish
                                ? "Add Product"
                                : "Produkt hinzufügen"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sku">SKU *</Label>
                                <Input
                                    id="sku"
                                    value={formData.sku || ""}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    required
                                    disabled={!!editingProduct}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">{isEnglish ? "Name" : "Name"} *</Label>
                                <Input
                                    id="name"
                                    value={formData.name || ""}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">{isEnglish ? "Category" : "Kategorie"} *</Label>
                                <Input
                                    id="category"
                                    list="categories"
                                    value={formData.category || ""}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                />
                                <datalist id="categories">
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price_eur">{isEnglish ? "Price (€)" : "Preis (€)"}</Label>
                                <Input
                                    id="price_eur"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.price_eur || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            price_eur: e.target.value ? parseFloat(e.target.value) : null,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="wavelength_nm">{isEnglish ? "Wavelength (nm)" : "Wellenlänge (nm)"}</Label>
                                <Input
                                    id="wavelength_nm"
                                    type="number"
                                    value={formData.wavelength_nm || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            wavelength_nm: e.target.value ? parseInt(e.target.value) : null,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="power_mw">{isEnglish ? "Power (mW)" : "Leistung (mW)"}</Label>
                                <Input
                                    id="power_mw"
                                    type="number"
                                    value={formData.power_mw || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            power_mw: e.target.value ? parseInt(e.target.value) : null,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="short_description">
                                {isEnglish ? "Short Description" : "Kurzbeschreibung"} *
                            </Label>
                            <Textarea
                                id="short_description"
                                value={formData.short_description || ""}
                                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                                required
                                rows={2}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="long_description">
                                {isEnglish ? "Long Description" : "Langbeschreibung"} *
                            </Label>
                            <Textarea
                                id="long_description"
                                value={formData.long_description || ""}
                                onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                                required
                                rows={4}
                            />
                        </div>

                        {/* Drag & Drop Upload */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>{isEnglish ? "Product Images" : "Produktbilder"}</Label>
                                <DragDropUpload
                                    onImageUpload={handleImageUpload}
                                    acceptPDFs={false}
                                    disabled={uploadingImage || uploadingPDF}
                                    multiple={true}
                                />
                                {images.length > 0 && (
                                    <div className="mt-4">
                                        <ImageManager
                                            images={images.map((img) => ({
                                                id: img.id,
                                                url: img.url,
                                                path: img.url.includes("products/") 
                                                    ? img.url.split("/").slice(-3).join("/")
                                                    : img.url,
                                            }))}
                                            mainImage={mainImageUrl || undefined}
                                            onImagesChange={(newImages) => {
                                                // Aktualisiere Reihenfolge der Bilder
                                                const imageAssets = newImages.map((img) => {
                                                    const existing = images.find((a) => a.url === img.url);
                                                    return existing || {
                                                        id: img.id,
                                                        product_id: editingProduct?.id || formData.sku || "new",
                                                        type: "image" as ProductAsset["type"],
                                                        url: img.url,
                                                    };
                                                });
                                                // Behalte andere Assets (PDFs)
                                                const otherAssets = productAssets.filter((a) => a.type !== "image");
                                                setProductAssets([...imageAssets, ...otherAssets]);
                                            }}
                                            onMainImageChange={(url) => {
                                                setMainImageUrl(url);
                                            }}
                                            onDelete={(path) => {
                                                const asset = images.find((a) => 
                                                    a.url.includes(path) || a.url === path
                                                );
                                                if (asset) {
                                                    handleAssetDelete(asset);
                                                    // Entferne Hauptbild wenn es gelöscht wird
                                                    if (mainImageUrl === asset.url) {
                                                        const remainingImages = images.filter((a) => a.id !== asset.id);
                                                        setMainImageUrl(remainingImages[0]?.url || null);
                                                    }
                                                }
                                            }}
                                            disabled={uploadingImage || uploadingPDF}
                                            isEnglish={isEnglish}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>{isEnglish ? "PDF Documents" : "PDF-Dokumente"}</Label>
                                <DragDropUpload
                                    onPDFUpload={handlePDFUpload}
                                    acceptImages={false}
                                    disabled={uploadingImage || uploadingPDF}
                                    multiple={true}
                                />
                                {pdfs.length > 0 && (
                                    <div className="space-y-2 mt-2">
                                        {pdfs.map((pdf) => (
                                            <div
                                                key={pdf.id}
                                                className="flex items-center justify-between p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                                                        <FileText className="h-4 w-4 text-red-600" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium truncate">
                                                            {pdf.type === "datasheet_pdf" 
                                                                ? (isEnglish ? "Datasheet" : "Datenblatt")
                                                                : pdf.type === "manual_pdf"
                                                                ? (isEnglish ? "Manual" : "Handbuch")
                                                                : (isEnglish ? "Document" : "Dokument")}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {pdf.url.split('/').pop() || "PDF"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={pdf.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline text-sm"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {isEnglish ? "View" : "Ansehen"}
                                                    </a>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleAssetDelete(pdf)}
                                                        className="h-8 w-8"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is_active"
                                checked={formData.is_active ?? true}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                            />
                            <Label htmlFor="is_active" className="cursor-pointer">
                                {isEnglish ? "Active" : "Aktiv"}
                            </Label>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                                {isEnglish ? "Cancel" : "Abbrechen"}
                            </Button>
                            <Button type="submit" disabled={uploadingImage || uploadingPDF}>
                                {uploadingImage || uploadingPDF ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {isEnglish ? "Saving..." : "Speichern..."}
                                    </>
                                ) : (
                                    isEnglish ? "Save" : "Speichern"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
