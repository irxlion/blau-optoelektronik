import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FAQ() {
  const { language, t } = useLanguage();
  const isEnglish = language === "en";

  const faqCategories = t({
    de: [
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
    ],
    en: [
      {
        category: "General questions",
        questions: [
          {
            q: "Since when has BLAU Optoelectronics existed?",
            a: "BLAU Optoelectronics was founded in 1990 and has over 30 years of experience in developing and manufacturing optoelectronic components and systems."
          },
          {
            q: "Where are your products manufactured?",
            a: "All of our products are developed and manufactured in Germany. This guarantees the highest quality standards, short lead times and flexible customisation."
          },
          {
            q: "Do you provide custom developments?",
            a: "Yes, for 30 years we have been developing optoelectronics in close collaboration with our customers. From concept through prototyping to series production – including small batches – we deliver turnkey solutions."
          },
          {
            q: "Which industries do you primarily serve?",
            a: "Our main industries are medical technology, industrial imaging, automation, mechanical engineering, microelectronics as well as research and development."
          }
        ]
      },
      {
        category: "Products & technology",
        questions: [
          {
            q: "What differentiates MVpulse from conventional machine vision lasers?",
            a: "MVpulse combines two crucial criteria: high output power up to 100 mW and laser class 2 eye safety. Innovative pulsed laser technology delivers high peak power while staying within eye-safety limits."
          },
          {
            q: "Which wavelengths do you offer?",
            a: "We provide laser modules at 405 nm (violet), 450 nm (blue), 520 nm (green), 635 nm (red), 660 nm (red), 780 nm (infrared) and 850 nm (infrared). The choice depends on your application."
          },
          {
            q: "What are Powell lenses used for?",
            a: "Powell lenses are aspheric specialty lenses that transform a laser beam into a line with uniform intensity. They are used in line lasers, barcode scanners and 3D scanning systems. We have produced them in-house since 2019."
          },
          {
            q: "Can your lasers operate continuously?",
            a: "Yes, our laser modules are designed for industrial continuous operation. Active temperature control and premium components guarantee long-term stable performance."
          }
        ]
      },
      {
        category: "Ordering & delivery",
        questions: [
          {
            q: "What are the delivery times?",
            a: "Lead times vary by product and order volume. Standard products typically ship within 2–4 weeks. Please allow 4–12 weeks for custom developments depending on complexity."
          },
          {
            q: "Do you have minimum order quantities?",
            a: "There is no minimum order for standard products. Custom OEM modules start at 10 units, enabling small batches."
          },
          {
            q: "How can I request a quotation?",
            a: "Reach us via the contact form, email or phone. Please provide as many details as possible about your application and required specifications."
          },
          {
            q: "Do you offer evaluation samples?",
            a: "Yes, we provide sample units for qualified projects. Contact us with your application details and we will prepare an individual proposal."
          }
        ]
      },
      {
        category: "Technical support",
        questions: [
          {
            q: "Which technical documentation is included?",
            a: "Each product ships with a complete datasheet, dimensional drawings, CAD models (STEP) and application notes. Laser safety documents and CE declarations are also available."
          },
          {
            q: "Do you offer technical consulting?",
            a: "Absolutely. Our experts support you with product selection, integration and optimisation for your specific application."
          },
          {
            q: "How fast do you respond to technical enquiries?",
            a: "We usually answer technical enquiries within 24 hours during business hours (Monday to Friday, 8:00 am – 5:00 pm)."
          },
          {
            q: "Do you provide product training?",
            a: "For larger projects and OEM customers we offer training sessions and workshops on request. Please contact us for details."
          }
        ]
      },
      {
        category: "Quality & certification",
        questions: [
          {
            q: "Which quality certifications do you hold?",
            a: "We are ISO 9001 certified. All products comply with CE requirements and are classified according to international laser safety standards."
          },
          {
            q: "How do you ensure product quality?",
            a: "Every product undergoes 100% final inspection. We use state-of-the-art test technology and document all relevant parameters. Long-term stability is verified via endurance sampling."
          },
          {
            q: "What warranty do you offer?",
            a: "We provide a standard warranty of 24 months against material and manufacturing defects. Extended warranties can be arranged for specialised applications."
          },
          {
            q: "What happens in case of a defect?",
            a: "Within the warranty period we repair or replace the unit free of charge. Contact our support team with the serial number and an error description."
          }
        ]
      }
    ]
  });

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
              {isEnglish ? "Frequently asked questions" : "Häufig gestellte Fragen"}
            </h1>
            <p className="text-xl opacity-90">
              {isEnglish
                ? "Find answers to the most common questions about our products, services and company."
                : "Finden Sie Antworten auf die häufigsten Fragen zu unseren Produkten, Services und Unternehmen."}
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
            {isEnglish ? "Can't find your question?" : "Ihre Frage ist nicht dabei?"}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {isEnglish ? "Contact us directly – we're happy to help." : "Kontaktieren Sie uns direkt - wir helfen Ihnen gerne weiter."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/kontakt" className="inline-block">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                {isEnglish ? "Contact us" : "Kontakt aufnehmen"}
              </button>
            </a>
            <a href="mailto:info@blauoptoelektronik.de" className="inline-block">
              <button className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors">
                {isEnglish ? "Send email" : "E-Mail senden"}
              </button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
