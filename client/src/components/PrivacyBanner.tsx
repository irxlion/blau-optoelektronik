import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PrivacyBanner() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Prüfe, ob der Benutzer bereits zugestimmt hat
    const consent = localStorage.getItem("privacy-consent");
    if (!consent) {
      // Zeige das Popup nach kurzer Verzögerung
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("privacy-consent", "accepted");
    localStorage.setItem("privacy-consent-date", new Date().toISOString());
    setIsOpen(false);
  };

  const handleDecline = () => {
    localStorage.setItem("privacy-consent", "declined");
    setIsOpen(false);
  };

  const title = isEnglish
    ? "Privacy & Cookie Notice"
    : "Datenschutz & Cookie-Hinweis";

  const description = isEnglish
    ? "We use cookies and similar technologies to improve your experience on our website. By continuing to use our site, you agree to our use of cookies. You can find more information in our privacy policy."
    : "Wir verwenden Cookies und ähnliche Technologien, um Ihr Erlebnis auf unserer Website zu verbessern. Durch die weitere Nutzung unserer Website stimmen Sie der Verwendung von Cookies zu. Weitere Informationen finden Sie in unserer Datenschutzerklärung.";

  const acceptText = isEnglish ? "Accept" : "Akzeptieren";
  const declineText = isEnglish ? "Decline" : "Ablehnen";
  const privacyPolicyText = isEnglish ? "Privacy Policy" : "Datenschutzerklärung";
  const learnMoreText = isEnglish ? "Learn more" : "Mehr erfahren";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-left">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          <Link
            href="/datenschutz"
            className="text-primary hover:underline"
            onClick={() => setIsOpen(false)}
          >
            {learnMoreText}
          </Link>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleDecline}
            className="w-full sm:w-auto"
          >
            {declineText}
          </Button>
          <Button
            onClick={handleAccept}
            className="w-full sm:w-auto"
          >
            {acceptText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

