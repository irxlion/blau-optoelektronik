import { useState, useEffect } from "react";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductLinkDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sourceProduct: Product;
    sourceLanguage: "de" | "en";
    availableProducts: Product[];
    onLink: (targetProductId: string) => Promise<void>;
}

export function ProductLinkDialog({
    open,
    onOpenChange,
    sourceProduct,
    sourceLanguage,
    availableProducts,
    onLink,
}: ProductLinkDialogProps) {
    const { language } = useLanguage();
    const isEnglish = language === "en";
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [linking, setLinking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const targetLanguage = sourceLanguage === "de" ? "en" : "de";

    // Filtere Produkte basierend auf Suchanfrage
    const filteredProducts = availableProducts.filter((product) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) ||
            product.id.toLowerCase().includes(query)
        );
    });

    // Prüfe, ob das Quellprodukt bereits verknüpft ist (ein Produkt in der anderen Sprache mit derselben ID)
    const linkedProduct = availableProducts.find((p) => p.id === sourceProduct.id);

    useEffect(() => {
        if (open) {
            setSearchQuery("");
            setSelectedProductId(null);
            setError(null);
        }
    }, [open]);

    const handleLink = async () => {
        if (!selectedProductId) return;

        setLinking(true);
        setError(null);

        try {
            await onLink(selectedProductId);
            onOpenChange(false);
        } catch (err: any) {
            setError(err.message || (isEnglish ? "Failed to link products" : "Fehler beim Verknüpfen der Produkte"));
        } finally {
            setLinking(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEnglish ? "Link Product" : "Produkt verknüpfen"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Info über Quellprodukt */}
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-2">
                            {isEnglish ? "Source Product" : "Quellprodukt"} ({sourceLanguage.toUpperCase()}):
                        </p>
                        <p className="font-semibold">{sourceProduct.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {sourceProduct.id}</p>
                    </div>

                    {/* Warnung wenn bereits verknüpft */}
                    {linkedProduct && (
                        <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                {isEnglish
                                    ? `This product is already linked with "${linkedProduct.name}" (${targetLanguage.toUpperCase()})`
                                    : `Dieses Produkt ist bereits mit "${linkedProduct.name}" (${targetLanguage.toUpperCase()}) verknüpft`}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Fehleranzeige */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Suchfeld */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={isEnglish ? "Search products..." : "Produkte suchen..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Produktliste */}
                    <div className="border rounded-lg max-h-96 overflow-y-auto">
                        {filteredProducts.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                {isEnglish ? "No products found" : "Keine Produkte gefunden"}
                            </div>
                        ) : (
                            <div className="divide-y">
                                {filteredProducts.map((product) => (
                                    <button
                                        key={product.id}
                                        onClick={() => setSelectedProductId(product.id)}
                                        className={`w-full text-left p-4 hover:bg-muted transition-colors ${
                                            selectedProductId === product.id ? "bg-primary/10 border-l-4 border-primary" : ""
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold truncate">{product.name}</p>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {product.category}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">ID: {product.id}</p>
                                            </div>
                                            {selectedProductId === product.id && (
                                                <div className="flex-shrink-0 text-primary">✓</div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={linking}>
                        {isEnglish ? "Cancel" : "Abbrechen"}
                    </Button>
                    <Button
                        onClick={handleLink}
                        disabled={!selectedProductId || linking || !!linkedProduct}
                    >
                        {linking ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isEnglish ? "Linking..." : "Verknüpfe..."}
                            </>
                        ) : (
                            isEnglish ? "Link Products" : "Produkte verknüpfen"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

