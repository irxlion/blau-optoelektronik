import { useState, useEffect, useRef } from "react";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { uploadImage, deleteImage, uploadPDF, deletePDF } from "@/lib/api";
import { DragDropUpload } from "@/components/DragDropUpload";
import { ImageManager } from "@/components/ImageManager";
import { toast } from "sonner";
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";

interface ProductFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product;
    onSave: (product: Product) => void;
}

export function ProductForm({ open, onOpenChange, product, onSave }: ProductFormProps) {
    const [formData, setFormData] = useState<Partial<Product>>({});
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingPDF, setUploadingPDF] = useState(false);
    const [imagePaths, setImagePaths] = useState<{ url: string; path: string }[]>([]);
    const [pdfFiles, setPdfFiles] = useState<{ name: string; url: string; path: string }[]>([]);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (product) {
            setFormData(product);
            // Bestehende Bilder aus images-Array laden
            setImagePaths(
                (product.images || []).map((url) => ({
                    url,
                    path: url, // Für bestehende URLs verwenden wir die URL als Path
                }))
            );
            // Bestehende PDFs aus downloads-Array laden
            setPdfFiles(
                (product.downloads || [])
                    .filter((d) => d.type === "PDF")
                    .map((d) => ({
                        name: d.name,
                        url: d.url,
                        path: d.url, // Für bestehende URLs verwenden wir die URL als Path
                    }))
            );
        } else {
            setFormData({
                id: "",
                name: "",
                category: "",
                description: "",
                longDescription: "",
                image: "",
                images: [],
                features: [],
                specifications: {},
                applications: [],
                downloads: [],
            });
            setImagePaths([]);
            setPdfFiles([]);
        }
    }, [product, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: "features" | "applications") => {
        const values = e.target.value.split("\n").filter((line) => line.trim() !== "");
        setFormData((prev) => ({ ...prev, [field]: values }));
    };

    // Bild-Upload Handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validierung
        if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
            toast.error("Nur PNG und JPG Dateien sind erlaubt");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Datei ist zu groß. Maximum: 5 MB");
            return;
        }

        if (!formData.id) {
            toast.error("Bitte geben Sie zuerst eine Produkt-ID ein");
            return;
        }

        setUploadingImage(true);
        try {
            // Datei zu Base64 konvertieren
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                const result = await uploadImage(formData.id!, base64, file.name);

                if (result.success && result.url) {
                    const newImage = { url: result.url, path: result.path || result.url };
                    setImagePaths((prev) => [...prev, newImage]);

                    // Hauptbild setzen wenn noch keines vorhanden
                    if (!formData.image) {
                        setFormData((prev) => ({ ...prev, image: result.url }));
                    }

                    toast.success("Bild erfolgreich hochgeladen");
                } else {
                    toast.error(result.error || "Upload fehlgeschlagen");
                }
                setUploadingImage(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            toast.error("Fehler beim Upload");
            setUploadingImage(false);
        }

        // Input zurücksetzen
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    // Bild löschen
    const handleImageDelete = async (path: string) => {
        try {
            // Nur löschen wenn es ein neuer Upload ist (enthält "products/")
            if (path.includes("products/")) {
                const result = await deleteImage(path);
                if (!result.success) {
                    toast.error(result.error || "Löschen fehlgeschlagen");
                    return;
                }
            }

            setImagePaths((prev) => prev.filter((img) => img.path !== path));

            // Hauptbild zurücksetzen wenn es gelöscht wurde
            if (formData.image === path) {
                const remainingImages = imagePaths.filter((img) => img.path !== path);
                setFormData((prev) => ({
                    ...prev,
                    image: remainingImages[0]?.url || "",
                }));
            }

            toast.success("Bild gelöscht");
        } catch (error) {
            toast.error("Fehler beim Löschen");
        }
    };

    // PDF-Upload Handler
    const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validierung
        if (file.type !== "application/pdf") {
            toast.error("Nur PDF Dateien sind erlaubt");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("Datei ist zu groß. Maximum: 10 MB");
            return;
        }

        if (!formData.id) {
            toast.error("Bitte geben Sie zuerst eine Produkt-ID ein");
            return;
        }

        setUploadingPDF(true);
        try {
            // Datei zu Base64 konvertieren
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                const result = await uploadPDF(formData.id!, base64, file.name);

                if (result.success && result.url) {
                    const newPDF = {
                        name: result.fileName || file.name,
                        url: result.url,
                        path: result.path || result.url,
                    };
                    setPdfFiles((prev) => [...prev, newPDF]);
                    toast.success("PDF erfolgreich hochgeladen");
                } else {
                    toast.error(result.error || "Upload fehlgeschlagen");
                }
                setUploadingPDF(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            toast.error("Fehler beim Upload");
            setUploadingPDF(false);
        }

        // Input zurücksetzen
        if (pdfInputRef.current) {
            pdfInputRef.current.value = "";
        }
    };

    // PDF löschen
    const handlePDFDelete = async (path: string) => {
        try {
            // Nur löschen wenn es ein neuer Upload ist (enthält "products/")
            if (path.includes("products/")) {
                const result = await deletePDF(path);
                if (!result.success) {
                    toast.error(result.error || "Löschen fehlgeschlagen");
                    return;
                }
            }

            setPdfFiles((prev) => prev.filter((pdf) => pdf.path !== path));
            toast.success("PDF gelöscht");
        } catch (error) {
            toast.error("Fehler beim Löschen");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Stelle sicher, dass Hauptbild in images-Array enthalten ist
        const imageUrls = imagePaths.map((img) => img.url);
        if (formData.image && !imageUrls.includes(formData.image)) {
            imageUrls.unshift(formData.image);
        }

        // Bilder und PDFs in formData integrieren
        const updatedFormData = {
            ...formData,
            images: imageUrls,
            // Stelle sicher, dass Hauptbild das erste Bild ist
            image: formData.image || imageUrls[0] || "",
            downloads: [
                ...pdfFiles.map((pdf) => ({
                    name: pdf.name,
                    type: "PDF",
                    url: pdf.url,
                })),
                // Bestehende Downloads die keine PDFs sind behalten
                ...(formData.downloads || []).filter((d) => d.type !== "PDF"),
            ],
        };

        onSave(updatedFormData as Product);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="id">ID</Label>
                            <Input id="id" name="id" value={formData.id || ""} onChange={handleChange} required disabled={!!product} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" name="category" value={formData.category || ""} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Hauptbild URL</Label>
                            <Input id="image" name="image" value={formData.image || ""} onChange={handleChange} />
                            <p className="text-xs text-gray-500">Oder laden Sie Bilder hoch</p>
                        </div>
                    </div>

                    {/* Bild-Upload Bereich */}
                    <div className="space-y-2">
                        <Label>Produktbilder (PNG, JPG, max. 5 MB)</Label>
                        {formData.id ? (
                            <>
                                <DragDropUpload
                                    onImageUpload={async (file) => {
                                        const e = {
                                            target: { files: [file] },
                                        } as React.ChangeEvent<HTMLInputElement>;
                                        await handleImageUpload(e);
                                    }}
                                    acceptPDFs={false}
                                    disabled={uploadingImage || !formData.id}
                                    multiple={true}
                                    className="mb-2"
                                />
                                <div className="flex items-center gap-2">
                                    <Input
                                        ref={imageInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg"
                                        onChange={handleImageUpload}
                                        disabled={uploadingImage || !formData.id}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => imageInputRef.current?.click()}
                                        disabled={uploadingImage || !formData.id}
                                        className="w-full sm:w-auto"
                                    >
                                        {uploadingImage ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Upload...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-2 h-4 w-4" /> Oder Datei auswählen
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">Bitte geben Sie zuerst eine Produkt-ID ein</p>
                        )}
                        {imagePaths.length > 0 && (
                            <div className="mt-4">
                                <ImageManager
                                    images={imagePaths.map((img, idx) => ({
                                        id: img.path || `img-${idx}`,
                                        url: img.url,
                                        path: img.path,
                                    }))}
                                    mainImage={formData.image}
                                    onImagesChange={(newImages) => {
                                        setImagePaths(newImages.map((img) => ({
                                            url: img.url,
                                            path: img.path,
                                        })));
                                    }}
                                    onMainImageChange={(url) => {
                                        setFormData((prev) => ({ ...prev, image: url }));
                                    }}
                                    onDelete={handleImageDelete}
                                    disabled={uploadingImage}
                                    isEnglish={false}
                                />
                            </div>
                        )}
                    </div>

                    {/* PDF-Upload Bereich */}
                    <div className="space-y-2">
                        <Label>PDF-Dokumente (Datenblätter, max. 10 MB)</Label>
                        {formData.id ? (
                            <>
                                <DragDropUpload
                                    onPDFUpload={async (file) => {
                                        const e = {
                                            target: { files: [file] },
                                        } as React.ChangeEvent<HTMLInputElement>;
                                        await handlePDFUpload(e);
                                    }}
                                    acceptImages={false}
                                    disabled={uploadingPDF || !formData.id}
                                    multiple={true}
                                    className="mb-2"
                                />
                                <div className="flex items-center gap-2">
                                    <Input
                                        ref={pdfInputRef}
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handlePDFUpload}
                                        disabled={uploadingPDF || !formData.id}
                                        className="hidden"
                                        id="pdf-upload"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => pdfInputRef.current?.click()}
                                        disabled={uploadingPDF || !formData.id}
                                        className="w-full sm:w-auto"
                                    >
                                        {uploadingPDF ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Upload...
                                            </>
                                        ) : (
                                            <>
                                                <FileText className="mr-2 h-4 w-4" /> Oder Datei auswählen
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">Bitte geben Sie zuerst eine Produkt-ID ein</p>
                        )}
                        {pdfFiles.length > 0 && (
                            <div className="space-y-2 mt-2">
                                {pdfFiles.map((pdf, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-red-500" />
                                            <span className="text-sm truncate">{pdf.name}</span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handlePDFDelete(pdf.path)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Short Description</Label>
                        <Textarea id="description" name="description" value={formData.description || ""} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="longDescription">Long Description</Label>
                        <Textarea id="longDescription" name="longDescription" value={formData.longDescription || ""} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="features">Features (one per line)</Label>
                        <Textarea
                            id="features"
                            value={formData.features?.join("\n") || ""}
                            onChange={(e) => handleArrayChange(e, "features")}
                            rows={5}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="applications">Applications (one per line)</Label>
                        <Textarea
                            id="applications"
                            value={formData.applications?.join("\n") || ""}
                            onChange={(e) => handleArrayChange(e, "applications")}
                            rows={5}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
