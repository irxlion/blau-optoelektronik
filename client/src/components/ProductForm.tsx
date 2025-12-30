import { useState, useEffect, useRef } from "react";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { uploadImage, deleteImage, uploadPDF, deletePDF, fetchProducts } from "@/lib/api";
import { DragDropUpload } from "@/components/DragDropUpload";
import { ImageManager } from "@/components/ImageManager";
import { toast } from "sonner";
import { Upload, X, FileText, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const TECH_TABLE_SPLIT_MARKER = "<!-- TECH_TABLE_SPLIT -->";

// Verfügbare Tools
const AVAILABLE_TOOLS = [
    {
        id: "max-power-simulation",
        nameDe: "Maximale Leistung Simulation",
        nameEn: "Maximum Power Simulation",
        hrefDe: "/tools/maximale-leistung-simulation",
        hrefEn: "/tools/maximum-power-simulation",
    },
    {
        id: "line-thickness-simulation",
        nameDe: "Liniendicken Simulation",
        nameEn: "Line Thickness Simulation",
        hrefDe: "/tools/liniendickensimulation",
        hrefEn: "/tools/line-thickness-simulation",
    },
];

// Category Combobox Component
function CategoryCombobox({
    value,
    categories,
    onValueChange,
}: {
    value: string;
    categories: string[];
    onValueChange: (value: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync (z.B. Edit-Mode)
    useEffect(() => {
        setInputValue(value || "");
    }, [value]);

    const trimmed = inputValue.trim();
    const exactMatch = trimmed
        ? categories.find((c) => c.toLowerCase() === trimmed.toLowerCase()) || null
        : null;
    const canCreateNew = trimmed.length > 0 && !exactMatch;

    const filteredCategories = categories.filter((c) =>
        c.toLowerCase().includes(inputValue.toLowerCase())
    );

    const selectCategory = (category: string) => {
        setInputValue(category);
        onValueChange(category);
        setOpen(false);
    };

    const createOrSelect = () => {
        if (!trimmed) return;
        if (exactMatch) {
            selectCategory(exactMatch);
            return;
        }
        // neue Kategorie
        setInputValue(trimmed);
        onValueChange(trimmed);
        setOpen(false);
        toast.success(`Neue Kategorie "${trimmed}" erstellt`);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            // Enter soll NICHT das Formular submitten
            e.preventDefault();
            createOrSelect();
        } else if (e.key === "Escape") {
            setOpen(false);
        } else if (e.key === "ArrowDown") {
            setOpen(true);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="relative">
                    <Input
                        ref={inputRef}
                        id="category"
                        name="category"
                        value={inputValue}
                        onChange={(e) => {
                            const v = e.target.value;
                            setInputValue(v);
                            onValueChange(v);
                            setOpen(true);
                        }}
                        onFocus={() => setOpen(true)}
                        onKeyDown={onKeyDown}
                        placeholder="Kategorie eingeben oder auswählen..."
                        autoComplete="off"
                        required
                        className="pr-9"
                    />
                    <button
                        type="button"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md hover:bg-accent flex items-center justify-center"
                        onClick={() => {
                            setOpen((v) => !v);
                            // Fokus zurück ins Input
                            setTimeout(() => inputRef.current?.focus(), 0);
                        }}
                        aria-label="Kategorien öffnen"
                    >
                        <ChevronsUpDown className="h-4 w-4 opacity-70" />
                    </button>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-2" align="start" sideOffset={4}>
                {canCreateNew && (
                    <button
                        type="button"
                        className={cn(
                            "w-full text-left px-3 py-2 rounded-md border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-medium transition-colors"
                        )}
                        // onMouseDown: verhindert dass das Input sofort den Fokus verliert
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={createOrSelect}
                    >
                        ➕ Neue Kategorie erstellen: “{trimmed}”
                    </button>
                )}

                <div className={cn("mt-2 max-h-56 overflow-auto rounded-md border", filteredCategories.length === 0 && "border-dashed")}>
                    {filteredCategories.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">Keine Kategorien gefunden</div>
                    ) : (
                        filteredCategories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                className={cn(
                                    "w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2",
                                    category === value && "bg-accent"
                                )}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => selectCategory(category)}
                            >
                                <Check className={cn("h-4 w-4", category === value ? "opacity-100" : "opacity-0")} />
                                <span className="truncate">{category}</span>
                            </button>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

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
    const [categories, setCategories] = useState<string[]>([]);
    const [nextId, setNextId] = useState<string>("");
    const [technicalTableBlocks, setTechnicalTableBlocks] = useState<string[]>([""]);
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([
        { question: "", answer: "" },
        { question: "", answer: "" },
        { question: "", answer: "" },
    ]);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);

    // Lade Kategorien und generiere nächste ID
    useEffect(() => {
        if (open) {
            loadCategories();
            if (!product) {
                generateNextId();
            }
        }
    }, [open, product]);

    // Lade Kategorien aus Produkten
    const loadCategories = async () => {
        try {
            const productsData = await fetchProducts();
            const allProducts = [...productsData.de, ...productsData.en];
            const uniqueCategories = Array.from(new Set(allProducts.map(p => p.category))).sort();
            setCategories(uniqueCategories);
        } catch (error) {
            console.error("Fehler beim Laden der Kategorien:", error);
        }
    };

    // Generiere nächste verfügbare ID (numerisch)
    const generateNextId = async () => {
        try {
            const productsData = await fetchProducts();
            const allProducts = [...productsData.de, ...productsData.en];
            
            // Extrahiere alle numerischen IDs
            const numericIds = allProducts
                .map(p => {
                    const numId = parseInt(p.id);
                    return isNaN(numId) ? null : numId;
                })
                .filter((id): id is number => id !== null)
                .sort((a, b) => a - b);
            
            // Finde die nächste verfügbare ID
            let next = 1;
            for (const id of numericIds) {
                if (id === next) {
                    next++;
                } else if (id > next) {
                    break;
                }
            }
            
            setNextId(next.toString());
            setFormData(prev => ({ ...prev, id: next.toString() }));
        } catch (error) {
            console.error("Fehler beim Generieren der ID:", error);
            setNextId("1");
            setFormData(prev => ({ ...prev, id: "1" }));
        }
    };

    useEffect(() => {
        if (product) {
            setFormData(product);
            const raw = (product.technicalPropertiesHtml || "").trim();
            const blocks = raw
                ? raw
                      .split(TECH_TABLE_SPLIT_MARKER)
                      .map((b) => b.trim())
                      .filter(Boolean)
                : [];
            setTechnicalTableBlocks(blocks.length > 0 ? blocks : [""]);
            // Bestehende Tools laden
            setSelectedTools((product as any).tools || []);
            // Bestehende Bilder aus images-Array laden
            setImagePaths(
                (product.images || []).map((url) => ({
                    url,
                    path: url,
                }))
            );
            // Bestehende PDFs aus downloads-Array laden
            setPdfFiles(
                (product.downloads || [])
                    .filter((d) => d.type === "PDF")
                    .map((d) => ({
                        name: d.name,
                        url: d.url,
                        path: d.url,
                    }))
            );
            // Bestehende FAQs laden (max. 3)
            const existingFaqs = (product.faqs || []).slice(0, 3);
            setFaqs([
                existingFaqs[0] || { question: "", answer: "" },
                existingFaqs[1] || { question: "", answer: "" },
                existingFaqs[2] || { question: "", answer: "" },
            ]);
        } else {
            setFormData({
                id: nextId || "",
                name: "",
                category: "",
                description: "",
                longDescription: "",
                image: "",
                images: [],
                features: [],
                specifications: {},
                applications: [],
                tools: [],
                downloads: [],
                seoHeadHtml: "",
                technicalPropertiesHtml: "",
            });
            setTechnicalTableBlocks([""]);
            setImagePaths([]);
            setPdfFiles([]);
            setSelectedTools([]);
            setFaqs([
                { question: "", answer: "" },
                { question: "", answer: "" },
                { question: "", answer: "" },
            ]);
        }
    }, [product, open, nextId]);

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
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                const result = await uploadImage(formData.id!, base64, file.name);

                if (result.success && result.url) {
                    const newImage = { url: result.url, path: result.path || result.url };
                    setImagePaths((prev) => [...prev, newImage]);

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

        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    const handleImageDelete = async (path: string) => {
        try {
            if (path.includes("products/")) {
                const result = await deleteImage(path);
                if (!result.success) {
                    toast.error(result.error || "Löschen fehlgeschlagen");
                    return;
                }
            }

            setImagePaths((prev) => prev.filter((img) => img.path !== path));

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

    const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

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

        if (pdfInputRef.current) {
            pdfInputRef.current.value = "";
        }
    };

    const handlePDFDelete = async (path: string) => {
        try {
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

        const imageUrls = imagePaths.map((img) => img.url);
        if (formData.image && !imageUrls.includes(formData.image)) {
            imageUrls.unshift(formData.image);
        }

        const technicalHtml = technicalTableBlocks
            .map((b) => b.trim())
            .filter(Boolean)
            .join(`\n${TECH_TABLE_SPLIT_MARKER}\n`);

        // FAQs filtern (nur die mit Frage UND Antwort)
        const validFaqs = faqs
            .filter((faq) => faq.question.trim() !== "" && faq.answer.trim() !== "")
            .slice(0, 3);

        const updatedFormData = {
            ...formData,
            images: imageUrls,
            image: formData.image || imageUrls[0] || "",
            downloads: [
                ...pdfFiles.map((pdf) => ({
                    name: pdf.name,
                    type: "PDF",
                    url: pdf.url,
                })),
                ...(formData.downloads || []).filter((d) => d.type !== "PDF"),
            ],
            tools: selectedTools.length > 0 ? selectedTools : undefined,
            technicalPropertiesHtml: technicalHtml,
            faqs: validFaqs.length > 0 ? validFaqs : undefined,
        };

        onSave(updatedFormData as Product);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="id">ID</Label>
                            <Input 
                                id="id" 
                                name="id" 
                                value={formData.id || ""} 
                                onChange={handleChange} 
                                required 
                                disabled={!!product}
                                readOnly={!product}
                            />
                            {!product && <p className="text-xs text-muted-foreground">Automatisch generiert</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <CategoryCombobox
                                value={formData.category || ""}
                                categories={categories}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                            />
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
                                        } as unknown as React.ChangeEvent<HTMLInputElement>;
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
                                        } as unknown as React.ChangeEvent<HTMLInputElement>;
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
                        <Label htmlFor="longDescription">Long Description (HTML)</Label>
                        <Textarea 
                            id="longDescription" 
                            name="longDescription" 
                            value={formData.longDescription || ""} 
                            onChange={handleChange} 
                            required 
                            rows={10}
                            className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">Sie können HTML-Tags verwenden (z.B. &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, etc.)</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="seoHeadHtml">SEO Meta-Tags (HTML für &lt;head&gt;)</Label>
                        <Textarea 
                            id="seoHeadHtml" 
                            name="seoHeadHtml" 
                            value={formData.seoHeadHtml || ""} 
                            onChange={handleChange} 
                            rows={8}
                            className="font-mono text-sm"
                            placeholder='z.B. &lt;meta name="description" content="..."&gt;&#10;&lt;meta name="keywords" content="..."&gt;'
                        />
                        <p className="text-xs text-muted-foreground">HTML-Code der in den &lt;head&gt; Bereich der Produktseite eingefügt wird</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="technicalPropertiesHtml">
                            Technische Daten Tabelle (HTML)
                        </Label>
                        <div className="space-y-3">
                            {technicalTableBlocks.map((block, idx) => (
                                <div key={idx} className="relative">
                                    <Textarea
                                        id={idx === 0 ? "technicalPropertiesHtml" : undefined}
                                        name={idx === 0 ? "technicalPropertiesHtml" : undefined}
                                        value={block}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setTechnicalTableBlocks((prev) => {
                                                const next = [...prev];
                                                next[idx] = v;
                                                return next;
                                            });
                                        }}
                                        rows={10}
                                        className="font-mono text-sm"
                                        placeholder={'z.B. <table><tr><th>Wellenlänge</th><td>635 nm</td></tr></table>'}
                                    />
                                    {technicalTableBlocks.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-2 top-2"
                                            title="Diese Tabelle entfernen"
                                            onClick={() => {
                                                setTechnicalTableBlocks((prev) => {
                                                    const next = prev.filter((_, i) => i !== idx);
                                                    return next.length > 0 ? next : [""];
                                                });
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setTechnicalTableBlocks((prev) => [...prev, ""])}
                            >
                                Weitere Tabelle hinzufügen
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Hier kannst du eine oder mehrere HTML-Tabellen einfügen. Jede Tabelle wird auf der Produktseite unter „Technische Daten" angezeigt.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Label>Tools (für Produktseite anzeigen)</Label>
                        <div className="space-y-2 border rounded-md p-4">
                            {AVAILABLE_TOOLS.map((tool) => (
                                <div key={tool.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`tool-${tool.id}`}
                                        checked={selectedTools.includes(tool.id)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedTools((prev) => [...prev, tool.id]);
                                            } else {
                                                setSelectedTools((prev) => prev.filter((id) => id !== tool.id));
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor={`tool-${tool.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {tool.nameDe} / {tool.nameEn}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Wähle die Tools aus, die auf der Produktseite in der "Alle Features" Sektion als Buttons angezeigt werden sollen.
                        </p>
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

                    <div className="space-y-4">
                        <Label>FAQs (max. 3)</Label>
                        <p className="text-xs text-muted-foreground">
                            Sie können bis zu 3 FAQs für dieses Produkt hinzufügen. Diese werden auf der Produktseite zwischen Features und Technische Daten angezeigt.
                        </p>
                        {faqs.map((faq, index) => (
                            <div key={index} className="space-y-2 p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-muted-foreground">FAQ {index + 1}</span>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`faq-question-${index}`}>Frage</Label>
                                    <Input
                                        id={`faq-question-${index}`}
                                        value={faq.question}
                                        onChange={(e) => {
                                            const newFaqs = [...faqs];
                                            newFaqs[index] = { ...newFaqs[index], question: e.target.value };
                                            setFaqs(newFaqs);
                                        }}
                                        placeholder="z.B. Wie funktioniert dieses Produkt?"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`faq-answer-${index}`}>Antwort</Label>
                                    <Textarea
                                        id={`faq-answer-${index}`}
                                        value={faq.answer}
                                        onChange={(e) => {
                                            const newFaqs = [...faqs];
                                            newFaqs[index] = { ...newFaqs[index], answer: e.target.value };
                                            setFaqs(newFaqs);
                                        }}
                                        placeholder="z.B. Dieses Produkt funktioniert durch..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                        ))}
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
