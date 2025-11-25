import { ChevronRight, Download, FileText, File, Image } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    {
      title: "Produktdatenblätter",
      icon: FileText,
      description: "Technische Datenblätter für alle Produkte",
      downloads: [
        { name: "Machine Vision Laser - Datenblatt", type: "PDF", size: "2.4 MB" },
        { name: "Linienlaser Serie - Technische Daten", type: "PDF", size: "1.8 MB" },
        { name: "Punktlaser Übersicht", type: "PDF", size: "1.5 MB" },
        { name: "Powelllinsen Spezifikationen", type: "PDF", size: "2.1 MB" },
        { name: "MVpulse Produktdatenblatt", type: "PDF", size: "2.7 MB" },
        { name: "OEM Module Capabilities", type: "PDF", size: "3.2 MB" },
      ]
    },
    {
      title: "CAD-Modelle",
      icon: File,
      description: "3D-Modelle für die Integration in Ihre Konstruktion",
      downloads: [
        { name: "Machine Vision Laser - STEP", type: "STEP", size: "850 KB" },
        { name: "Linienlaser - STEP", type: "STEP", size: "720 KB" },
        { name: "Punktlaser - STEP", type: "STEP", size: "650 KB" },
        { name: "MVpulse - STEP", type: "STEP", size: "920 KB" },
        { name: "Komplettes Produktsortiment - ZIP", type: "ZIP", size: "12.5 MB" },
      ]
    },
    {
      title: "Technische Zeichnungen",
      icon: Image,
      description: "Detaillierte Maßzeichnungen für alle Produkte",
      downloads: [
        { name: "Machine Vision - Maßzeichnung", type: "DWG", size: "450 KB" },
        { name: "Linienlaser - Maßzeichnung", type: "DWG", size: "380 KB" },
        { name: "Punktlaser - Maßzeichnung", type: "DWG", size: "320 KB" },
        { name: "Powelllinsen - Optische Zeichnung", type: "PDF", size: "1.2 MB" },
      ]
    },
    {
      title: "Anwendungshinweise",
      icon: FileText,
      description: "Best Practices und Anwendungsbeispiele",
      downloads: [
        { name: "Lasersicherheit - Leitfaden", type: "PDF", size: "3.5 MB" },
        { name: "Integration Machine Vision Laser", type: "PDF", size: "2.8 MB" },
        { name: "Powelllinsen Anwendungshinweise", type: "PDF", size: "2.1 MB" },
        { name: "Optische Sensoren - Best Practices", type: "PDF", size: "4.2 MB" },
        { name: "Kalibrierung und Justage", type: "PDF", size: "3.1 MB" },
      ]
    },
    {
      title: "Zertifikate & Konformität",
      icon: FileText,
      description: "CE-Konformität, ISO-Zertifikate und Lasersicherheit",
      downloads: [
        { name: "ISO 9001 Zertifikat", type: "PDF", size: "1.1 MB" },
        { name: "CE-Konformitätserklärung", type: "PDF", size: "850 KB" },
        { name: "Lasersicherheit Dokumentation", type: "PDF", size: "2.4 MB" },
        { name: "RoHS Konformität", type: "PDF", size: "720 KB" },
      ]
    },
    {
      title: "Kataloge & Broschüren",
      icon: FileText,
      description: "Produktkataloge und Unternehmenspräsentationen",
      downloads: [
        { name: "BLAU Optoelektronik Hauptkatalog 2025", type: "PDF", size: "15.8 MB" },
        { name: "Machine Vision Produktlinie", type: "PDF", size: "6.2 MB" },
        { name: "OEM Entwicklung Broschüre", type: "PDF", size: "4.5 MB" },
        { name: "Unternehmenspräsentation", type: "PDF", size: "8.3 MB" },
      ]
    }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    downloads: category.downloads.filter(download =>
      download.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.downloads.length > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-24 mt-20">
        <div className="container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm mb-4 opacity-90">
              <span>Home</span>
              <ChevronRight className="h-4 w-4" />
              <span>Ressourcen</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Downloads & Ressourcen
            </h1>
            <p className="text-xl opacity-90">
              Technische Dokumentationen, CAD-Modelle, Datenblätter und weitere Ressourcen für unsere Produkte.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-muted border-b border-border">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Suchen Sie nach Dokumenten, Produkten oder Dateitypen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background h-12 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Download Categories */}
      <section className="py-16">
        <div className="container">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                Keine Ergebnisse für "{searchTerm}" gefunden.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCategories.map((category, idx) => {
                const Icon = category.icon;
                return (
                  <div key={idx}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{category.title}</h2>
                        <p className="text-muted-foreground">{category.description}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.downloads.map((download, downloadIdx) => (
                        <Card key={downloadIdx} className="border-border/50 hover:shadow-lg transition-shadow group">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1">
                                <div className="text-xs text-secondary font-medium mb-1">
                                  {download.type} • {download.size}
                                </div>
                                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                                  {download.name}
                                </h3>
                              </div>
                            </div>
                            <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Herunterladen
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-accent">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-accent-foreground">
              Benötigen Sie weitere Informationen?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Wenn Sie spezifische Dokumente oder technische Informationen benötigen, die hier nicht verfügbar sind, kontaktieren Sie uns bitte direkt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Kontakt aufnehmen
              </Button>
              <Button size="lg" variant="outline">
                FAQ besuchen
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
