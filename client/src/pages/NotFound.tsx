import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft, Search } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const isEnglish = language === "en";

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <Card className="w-full max-w-2xl mx-4 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="pt-12 pb-12 px-8 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75" />
              <div className="absolute inset-0 bg-primary/10 rounded-full" />
              <AlertCircle className="relative h-20 w-20 text-primary" />
            </div>
          </div>

          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>

          <h2 className="text-2xl font-semibold text-foreground mb-4">
            {isEnglish ? "Page not found" : "Seite nicht gefunden"}
          </h2>

          <p className="text-muted-foreground mb-8 leading-relaxed text-lg max-w-md mx-auto">
            {isEnglish ? (
              <>
                Sorry, the page you are looking for doesn't exist.
                <br />
                It may have been moved or deleted.
              </>
            ) : (
              <>
                Entschuldigung, die angeforderte Seite existiert nicht.
                <br />
                Sie wurde möglicherweise verschoben oder gelöscht.
              </>
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoHome}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Home className="w-4 h-4 mr-2" />
              {isEnglish ? "Go home" : "Zur Startseite"}
            </Button>
            <Button
              asChild
              variant="outline"
              className="px-8 py-3 rounded-lg"
            >
              <Link href="/produkte">
                <Search className="w-4 h-4 mr-2" />
                {isEnglish ? "Browse products" : "Produkte durchsuchen"}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="px-8 py-3 rounded-lg"
            >
              <Link href="/kontakt">
                {isEnglish ? "Contact us" : "Kontakt aufnehmen"}
              </Link>
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              {isEnglish 
                ? "Need help? Check out our navigation menu or contact our support team."
                : "Benötigen Sie Hilfe? Schauen Sie sich unser Navigationsmenü an oder kontaktieren Sie unser Support-Team."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
