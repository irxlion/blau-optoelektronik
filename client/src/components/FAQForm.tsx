import { useState, useEffect } from "react";
import { FAQ } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface FAQFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    faq?: FAQ;
    onSave: (faq: FAQ) => void;
}

export function FAQForm({ open, onOpenChange, faq, onSave }: FAQFormProps) {
    const { language } = useLanguage();
    const isEnglish = language === "en";
    const [formData, setFormData] = useState<Partial<FAQ>>({});

    useEffect(() => {
        if (faq) {
            setFormData(faq);
        } else {
            setFormData({
                id: "",
                category: "",
                question: "",
                answer: "",
                orderIndex: 0,
            });
        }
    }, [faq, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.id || !formData.category || !formData.question || !formData.answer) {
            toast.error(isEnglish ? "Please fill in all required fields" : "Bitte füllen Sie alle Pflichtfelder aus");
            return;
        }

        const faqToSave: FAQ = {
            id: formData.id,
            category: formData.category,
            question: formData.question,
            answer: formData.answer,
            orderIndex: formData.orderIndex || 0,
        };

        onSave(faqToSave);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle>{faq ? (isEnglish ? "Edit FAQ" : "FAQ bearbeiten") : (isEnglish ? "Add New FAQ" : "Neue FAQ hinzufügen")}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="id">{isEnglish ? "FAQ ID *" : "FAQ-ID *"}</Label>
                            <Input
                                id="id"
                                name="id"
                                value={formData.id || ""}
                                onChange={handleChange}
                                required
                                disabled={!!faq}
                                placeholder={isEnglish ? "e.g. general-1" : "z.B. allgemein-1"}
                                className="text-sm sm:text-base min-h-[44px]"
                            />
                            <p className="text-xs text-muted-foreground">{isEnglish ? "Unique ID (only when creating)" : "Eindeutige ID (nur bei Erstellung)"}</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">{isEnglish ? "Category *" : "Kategorie *"}</Label>
                            <Input
                                id="category"
                                name="category"
                                value={formData.category || ""}
                                onChange={handleChange}
                                required
                                placeholder={isEnglish ? "e.g. General questions" : "z.B. Allgemeine Fragen"}
                                className="text-sm sm:text-base min-h-[44px]"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="question">{isEnglish ? "Question *" : "Frage *"}</Label>
                        <Input
                            id="question"
                            name="question"
                            value={formData.question || ""}
                            onChange={handleChange}
                            required
                            placeholder={isEnglish ? "Enter the question" : "Geben Sie die Frage ein"}
                            className="text-sm sm:text-base min-h-[44px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="answer">{isEnglish ? "Answer *" : "Antwort *"}</Label>
                        <Textarea
                            id="answer"
                            name="answer"
                            value={formData.answer || ""}
                            onChange={handleChange}
                            required
                            rows={8}
                            placeholder={isEnglish ? "Enter the answer" : "Geben Sie die Antwort ein"}
                            className="text-sm sm:text-base"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="orderIndex">{isEnglish ? "Order Index" : "Sortierungsindex"}</Label>
                        <Input
                            id="orderIndex"
                            name="orderIndex"
                            type="number"
                            value={formData.orderIndex || 0}
                            onChange={handleNumberChange}
                            placeholder="0"
                            className="text-sm sm:text-base min-h-[44px]"
                        />
                        <p className="text-xs text-muted-foreground">{isEnglish ? "Lower numbers appear first within the same category" : "Niedrigere Zahlen erscheinen zuerst innerhalb derselben Kategorie"}</p>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto min-h-[44px]">
                            {isEnglish ? "Cancel" : "Abbrechen"}
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto min-h-[44px]">{isEnglish ? "Save" : "Speichern"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

