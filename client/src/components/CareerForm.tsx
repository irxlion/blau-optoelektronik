import { useState, useEffect } from "react";
import { Career } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface CareerFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    career?: Career;
    onSave: (career: Career) => void;
}

export function CareerForm({ open, onOpenChange, career, onSave }: CareerFormProps) {
    const { language } = useLanguage();
    const isEnglish = language === "en";
    const [formData, setFormData] = useState<Partial<Career>>({});

    useEffect(() => {
        if (career) {
            setFormData(career);
        } else {
            setFormData({
                id: "",
                title: "",
                department: "",
                location: "",
                employmentType: "",
                shortDescription: "",
                description: "",
                requirements: "",
                benefits: "",
                salaryRange: "",
                applicationEmail: "",
                applicationUrl: "",
                isPublished: false,
            });
        }
    }, [career, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, isPublished: checked }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.id || !formData.title || !formData.description) {
            toast.error(isEnglish ? "Please fill in all required fields" : "Bitte füllen Sie alle Pflichtfelder aus");
            return;
        }

        // Stelle published_at setzen wenn isPublished true ist
        const careerToSave: Career = {
            ...formData,
            publishedAt: formData.isPublished && !formData.publishedAt 
                ? new Date().toISOString() 
                : formData.isPublished 
                    ? formData.publishedAt 
                    : null,
        } as Career;

        onSave(careerToSave);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle>{career ? (isEnglish ? "Edit Job Posting" : "Stelle bearbeiten") : (isEnglish ? "Add New Job Posting" : "Neue Stelle hinzufügen")}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="id">{isEnglish ? "Job ID *" : "Job-ID *"}</Label>
                            <Input
                                id="id"
                                name="id"
                                value={formData.id || ""}
                                onChange={handleChange}
                                required
                                disabled={!!career}
                                placeholder={isEnglish ? "e.g. software-engineer" : "z.B. software-engineer"}
                                className="text-sm sm:text-base min-h-[44px]"
                            />
                            <p className="text-xs text-muted-foreground">{isEnglish ? "Unique ID (only when creating)" : "Eindeutige ID (nur bei Erstellung)"}</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">{isEnglish ? "Title *" : "Titel *"}</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title || ""}
                                onChange={handleChange}
                                required
                                placeholder={isEnglish ? "e.g. Software Engineer" : "z.B. Software Engineer"}
                                className="text-sm sm:text-base min-h-[44px]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="department">{isEnglish ? "Department" : "Abteilung"}</Label>
                            <Input
                                id="department"
                                name="department"
                                value={formData.department || ""}
                                onChange={handleChange}
                                placeholder={isEnglish ? "e.g. Development" : "z.B. Entwicklung"}
                                className="text-sm sm:text-base min-h-[44px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">{isEnglish ? "Location" : "Standort"}</Label>
                            <Input
                                id="location"
                                name="location"
                                value={formData.location || ""}
                                onChange={handleChange}
                                placeholder={isEnglish ? "e.g. Munich" : "z.B. München"}
                                className="text-sm sm:text-base min-h-[44px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="employmentType">{isEnglish ? "Employment Type" : "Anstellungsart"}</Label>
                            <Input
                                id="employmentType"
                                name="employmentType"
                                value={formData.employmentType || ""}
                                onChange={handleChange}
                                placeholder={isEnglish ? "e.g. Full-time" : "z.B. Vollzeit"}
                                className="text-sm sm:text-base min-h-[44px]"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="shortDescription">{isEnglish ? "Short Description" : "Kurzbeschreibung"}</Label>
                        <Textarea
                            id="shortDescription"
                            name="shortDescription"
                            value={formData.shortDescription || ""}
                            onChange={handleChange}
                            rows={2}
                            placeholder={isEnglish ? "Brief description for overview" : "Kurze Beschreibung für die Übersicht"}
                            className="text-sm sm:text-base"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">{isEnglish ? "Full Description *" : "Vollständige Beschreibung *"}</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description || ""}
                            onChange={handleChange}
                            required
                            rows={8}
                            placeholder={isEnglish ? "Detailed job description" : "Detaillierte Stellenbeschreibung"}
                            className="text-sm sm:text-base"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="requirements">{isEnglish ? "Requirements" : "Anforderungen"}</Label>
                            <Textarea
                                id="requirements"
                                name="requirements"
                                value={formData.requirements || ""}
                                onChange={handleChange}
                                rows={6}
                                placeholder={isEnglish ? "List of requirements" : "Aufzählung der Anforderungen"}
                                className="text-sm sm:text-base"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="benefits">{isEnglish ? "Benefits" : "Vorteile/Benefits"}</Label>
                            <Textarea
                                id="benefits"
                                name="benefits"
                                value={formData.benefits || ""}
                                onChange={handleChange}
                                rows={6}
                                placeholder={isEnglish ? "List of benefits" : "Aufzählung der Vorteile"}
                                className="text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="salaryRange">{isEnglish ? "Salary Range" : "Gehaltsangabe"}</Label>
                            <Input
                                id="salaryRange"
                                name="salaryRange"
                                value={formData.salaryRange || ""}
                                onChange={handleChange}
                                placeholder={isEnglish ? "e.g. 50,000 - 70,000 €" : "z.B. 50.000 - 70.000 €"}
                                className="text-sm sm:text-base min-h-[44px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="applicationEmail">{isEnglish ? "Application Email" : "Bewerbungs-E-Mail"}</Label>
                            <Input
                                id="applicationEmail"
                                name="applicationEmail"
                                type="email"
                                value={formData.applicationEmail || ""}
                                onChange={handleChange}
                                placeholder="karriere@blau-optoelektronik.de"
                                className="text-sm sm:text-base min-h-[44px]"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="applicationUrl">{isEnglish ? "Application URL (optional)" : "Bewerbungs-URL (optional)"}</Label>
                        <Input
                            id="applicationUrl"
                            name="applicationUrl"
                            type="url"
                            value={formData.applicationUrl || ""}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="text-sm sm:text-base min-h-[44px]"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="isPublished"
                            checked={formData.isPublished || false}
                            onCheckedChange={handleSwitchChange}
                        />
                        <Label htmlFor="isPublished">{isEnglish ? "Published (visible on website)" : "Veröffentlicht (auf Website sichtbar)"}</Label>
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
