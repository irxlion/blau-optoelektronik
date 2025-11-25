import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqCategories = [
    {
      category: "Allgemeine Fragen",
      questions: [
        {
          q: "Seit wann gibt es BLAU Optoelektronik?",
          a: "BLAU Optoelektronik wurde 1990 gegründet und verfügt über mehr als 30 Jahre Erfahrung in der Entwicklung und Fertigung von optoelektronischen Komponenten und Systemen."
        },
        {
          q: "Wo werden Ihre Produkte hergestellt?",
          a: "Alle unsere Produkte werden in Deutschland entwickelt und gefertigt. Dies garantiert höchste Qualitätsstandards und ermöglicht uns kurze Lieferzeiten sowie flexible Anpassungen."
        },
        {
          q: "Bieten Sie auch kundenspezifische Entwicklungen an?",
          a: "Ja, wir entwickeln seit 30 Jahren Optoelektronik in enger Abstimmung mit unseren Kunden. Von der Konzeption über die Prototypenfertigung bis zur Serienfertigung - auch in Kleinserien - bieten wir Komplettlösungen aus einer Hand."
        },
        {
          q: "Welche Branchen bedienen Sie hauptsächlich?",
          a: "Unsere Hauptbranchen sind Medizintechnik, industrielle Bildverarbeitung, Automatisierungstechnik, Maschinenbau, Mikroelektronik sowie Forschung und Entwicklung."
        }
      ]
    },
    {
      category: "Produkte & Technologie",
      questions: [
        {
          q: "Was ist der Unterschied zwischen MVpulse und herkömmlichen Machine Vision Lasern?",
          a: "MVpulse kombiniert zwei wichtige Kriterien: Hohe Ausgangsleistung bis 100 mW und gleichzeitig Augensicherheit nach Laserklasse 2. Durch innovative gepulste Lasertechnologie erreichen wir hohe Spitzenleistungen bei Einhaltung der Augensicherheitsgrenzwerte."
        },
        {
          q: "Welche Wellenlängen bieten Sie an?",
          a: "Wir bieten Lasermodule in verschiedenen Wellenlängen an: 405 nm (violett), 450 nm (blau), 520 nm (grün), 635 nm (rot), 660 nm (rot), 780 nm (infrarot) und 850 nm (infrarot). Die Auswahl hängt von Ihrer spezifischen Anwendung ab."
        },
        {
          q: "Was sind Powelllinsen und wofür werden sie verwendet?",
          a: "Powelllinsen sind asphärische Speziallinsen, die einen Laserstrahl in eine Linie mit gleichmäßiger Intensitätsverteilung umwandeln. Sie werden in Linienlasern, Barcode-Scannern und 3D-Scanning-Systemen eingesetzt. Wir fertigen diese seit 2019 in Eigenproduktion."
        },
        {
          q: "Können Ihre Laser im Dauerbetrieb eingesetzt werden?",
          a: "Ja, unsere Lasermodule sind für den industriellen Dauerbetrieb ausgelegt. Durch aktive Temperaturregelung und hochwertige Komponenten garantieren wir Langzeitstabilität und konstante Leistung."
        }
      ]
    },
    {
      category: "Bestellung & Lieferung",
      questions: [
        {
          q: "Wie lange sind die Lieferzeiten?",
          a: "Die Lieferzeiten variieren je nach Produkt und Bestellmenge. Standardprodukte sind in der Regel innerhalb von 2-4 Wochen lieferbar. Für kundenspezifische Entwicklungen planen Sie bitte 4-12 Wochen ein, abhängig von der Komplexität."
        },
        {
          q: "Gibt es Mindestbestellmengen?",
          a: "Für Standardprodukte gibt es keine Mindestbestellmenge. Bei kundenspezifischen OEM-Modulen liegt die Mindestmenge bei 10 Stück, was uns auch Kleinserien ermöglicht."
        },
        {
          q: "Wie kann ich ein Angebot anfordern?",
          a: "Sie können uns über unser Kontaktformular, per E-Mail oder telefonisch erreichen. Geben Sie bitte möglichst detaillierte Informationen zu Ihrer Anwendung und den gewünschten Spezifikationen an."
        },
        {
          q: "Bieten Sie Muster zur Evaluierung an?",
          a: "Ja, für qualifizierte Projekte bieten wir Mustergeräte zur Evaluierung an. Kontaktieren Sie uns mit Details zu Ihrer Anwendung, und wir erstellen Ihnen ein individuelles Angebot."
        }
      ]
    },
    {
      category: "Technischer Support",
      questions: [
        {
          q: "Welche technische Dokumentation wird mitgeliefert?",
          a: "Jedes Produkt wird mit einem vollständigen Datenblatt, Maßzeichnungen, CAD-Modellen (STEP-Format) und Anwendungshinweisen geliefert. Zusätzlich stehen Lasersicherheitsdokumentationen und CE-Konformitätserklärungen zur Verfügung."
        },
        {
          q: "Bieten Sie technische Beratung an?",
          a: "Ja, unser Expertenteam steht Ihnen für technische Beratung zur Verfügung. Wir helfen bei der Produktauswahl, Integration und Optimierung für Ihre spezifische Anwendung."
        },
        {
          q: "Wie schnell erhalte ich Antwort auf technische Anfragen?",
          a: "Wir beantworten technische Anfragen in der Regel innerhalb von 24 Stunden während der Geschäftszeiten (Montag bis Freitag, 8:00 - 17:00 Uhr)."
        },
        {
          q: "Gibt es Schulungen für Ihre Produkte?",
          a: "Für größere Projekte und OEM-Kunden bieten wir auf Anfrage Schulungen und Workshops an. Kontaktieren Sie uns für weitere Informationen."
        }
      ]
    },
    {
      category: "Qualität & Zertifizierung",
      questions: [
        {
          q: "Welche Qualitätszertifizierungen haben Sie?",
          a: "Wir sind nach ISO 9001 zertifiziert. Alle Produkte erfüllen die CE-Konformität und werden nach internationalen Lasersicherheitsstandards klassifiziert."
        },
        {
          q: "Wie wird die Qualität Ihrer Produkte sichergestellt?",
          a: "Jedes Produkt durchläuft eine 100%ige Endkontrolle. Wir verwenden modernste Prüftechnik und dokumentieren alle relevanten Parameter. Langzeitstabilität wird durch Stichproben-Dauertests verifiziert."
        },
        {
          q: "Welche Garantie bieten Sie?",
          a: "Wir bieten eine Standardgarantie von 24 Monaten auf Material- und Fertigungsfehler. Für spezielle Anwendungen können erweiterte Garantieleistungen vereinbart werden."
        },
        {
          q: "Was passiert bei einem Defekt?",
          a: "Bei einem Defekt innerhalb der Garantiezeit reparieren oder ersetzen wir das Gerät kostenlos. Kontaktieren Sie unseren Support mit der Seriennummer und einer Fehlerbeschreibung."
        }
      ]
    }
  ];

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
              <span>FAQ</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Häufig gestellte Fragen
            </h1>
            <p className="text-xl opacity-90">
              Finden Sie Antworten auf die häufigsten Fragen zu unseren Produkten, Services und Unternehmen.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="space-y-12">
            {faqCategories.map((category, categoryIdx) => (
              <div key={categoryIdx}>
                <h2 className="text-3xl font-bold mb-6 text-foreground">{category.category}</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, faqIdx) => (
                    <AccordionItem
                      key={faqIdx}
                      value={`${categoryIdx}-${faqIdx}`}
                      className="border border-border rounded-lg px-6 bg-card"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        <span className="font-semibold text-card-foreground">{faq.q}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-accent">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4 text-accent-foreground">
            Ihre Frage ist nicht dabei?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Kontaktieren Sie uns direkt - wir helfen Ihnen gerne weiter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/kontakt" className="inline-block">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Kontakt aufnehmen
              </button>
            </a>
            <a href="mailto:info@blauoptoelektronik.de" className="inline-block">
              <button className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors">
                E-Mail senden
              </button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
