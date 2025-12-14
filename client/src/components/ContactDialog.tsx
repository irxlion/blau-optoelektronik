import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContactForm } from "@/components/ContactForm";
import { useLanguage } from "@/contexts/LanguageContext";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactDialog({ open, onOpenChange }: ContactDialogProps) {
  const { language } = useLanguage();
  const isEnglish = language === "en";

  const handleSuccess = () => {
    // Optional: Dialog nach erfolgreichem Absenden schließen
    // onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEnglish ? "Get in touch" : "Kontaktieren Sie uns"}
          </DialogTitle>
          <DialogDescription>
            {isEnglish
              ? "Fill out the form and we will get back to you as soon as possible. For urgent requests please call us directly."
              : "Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen. Für dringende Anfragen rufen Sie uns bitte direkt an."}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <ContactForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
