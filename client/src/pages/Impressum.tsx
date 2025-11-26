import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Impressum() {
  const { language } = useLanguage();
  const isEnglish = language === "en";

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
              <span>{isEnglish ? "Legal Notice" : "Impressum"}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {isEnglish ? "Legal Notice" : "Impressum"}
            </h1>
            <p className="text-xl opacity-90">
              {isEnglish ? "Information according to § 5 TMG" : "Angaben gemäß § 5 TMG"}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
            {isEnglish ? (
              // English Content
              <>
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Information according to § 5 TMG</h2>
                  <div className="bg-muted p-6 rounded-lg my-4">
                    <p className="leading-relaxed mb-2">
                      <strong className="text-foreground">BLAU Optoelektronik GmbH</strong>
                    </p>
                    <p className="leading-relaxed mb-2">
                      Germany
                    </p>
                    <p className="leading-relaxed mb-2">
                      <strong className="text-foreground">Represented by:</strong>
                    </p>
                    <p className="leading-relaxed mb-4">
                      Management
                    </p>
                    <p className="leading-relaxed mb-2">
                      <strong className="text-foreground">Contact:</strong>
                    </p>
                    <p className="leading-relaxed mb-2">
                      Phone: +49 (0) 7551 93748-0
                    </p>
                    <p className="leading-relaxed mb-2">
                      Fax: +49 (0) 7551 93748-99
                    </p>
                    <p className="leading-relaxed">
                      Email: info@blauoptoelektronik.de
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">VAT ID</h2>
                  <p className="leading-relaxed">
                    VAT identification number according to § 27 a of the German VAT Act:
                  </p>
                  <p className="leading-relaxed mt-2">
                    DE [VAT ID will be added upon provision]
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Economic ID</h2>
                  <p className="leading-relaxed">
                    Economic identification number according to § 139c of the German Fiscal Code:
                  </p>
                  <p className="leading-relaxed mt-2">
                    [Economic ID will be added upon provision]
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Supervisory Authority</h2>
                  <p className="leading-relaxed">
                    [Competent supervisory authority will be added upon provision]
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Professional Designation and Professional Regulations</h2>
                  <p className="leading-relaxed">
                    Professional designation: Optoelectronics
                  </p>
                  <p className="leading-relaxed mt-2">
                    Responsible chamber: [will be added upon provision]
                  </p>
                  <p className="leading-relaxed mt-2">
                    Awarded in: Germany
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Editorially Responsible</h2>
                  <div className="bg-muted p-6 rounded-lg my-4">
                    <p className="leading-relaxed mb-2">
                      <strong className="text-foreground">BLAU Optoelektronik GmbH</strong>
                    </p>
                    <p className="leading-relaxed mb-2">
                      Germany
                    </p>
                    <p className="leading-relaxed">
                      Email: info@blauoptoelektronik.de
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">EU Dispute Resolution</h2>
                  <p className="leading-relaxed mb-4">
                    The European Commission provides a platform for online dispute resolution (ODR):
                  </p>
                  <p className="leading-relaxed mb-4">
                    <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      https://ec.europa.eu/consumers/odr/
                    </a>
                  </p>
                  <p className="leading-relaxed">
                    You can find our email address in the legal notice above.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Consumer Dispute Resolution / Universal Arbitration Board</h2>
                  <p className="leading-relaxed mb-4">
                    We are neither willing nor obliged to participate in dispute resolution proceedings before a consumer arbitration board.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Liability for Content</h2>
                  <p className="leading-relaxed mb-4">
                    As a service provider, we are responsible for our own content on these pages in accordance with § 7 para. 1 TMG under general law. According to §§ 8 to 10 TMG, however, we as a service provider are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
                  </p>
                  <p className="leading-relaxed mb-4">
                    Obligations to remove or block the use of information according to general laws remain unaffected. However, liability in this regard is only possible from the time of knowledge of a specific legal violation. Upon becoming aware of corresponding legal violations, we will remove this content immediately.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Liability for Links</h2>
                  <p className="leading-relaxed mb-4">
                    Our offer contains links to external third-party websites over whose content we have no influence. Therefore, we cannot assume any liability for this external content. The respective provider or operator of the pages is always responsible for the content of the linked pages. The linked pages were checked for possible legal violations at the time of linking. Illegal content was not recognizable at the time of linking.
                  </p>
                  <p className="leading-relaxed mb-4">
                    However, permanent monitoring of the content of the linked pages is not reasonable without concrete evidence of a legal violation. Upon becoming aware of legal violations, we will remove such links immediately.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Copyright</h2>
                  <p className="leading-relaxed mb-4">
                    The content and works created by the site operators on these pages are subject to German copyright law. The reproduction, editing, distribution and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator. Downloads and copies of this site are only permitted for private, non-commercial use.
                  </p>
                  <p className="leading-relaxed mb-4">
                    Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is identified as such. Should you nevertheless become aware of a copyright infringement, please inform us accordingly. Upon becoming aware of legal violations, we will remove such content immediately.
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </>
            ) : (
              // German Content
              <>
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Angaben gemäß § 5 TMG</h2>
                  <div className="bg-muted p-6 rounded-lg my-4">
                    <p className="leading-relaxed mb-2">
                      <strong className="text-foreground">BLAU Optoelektronik GmbH</strong>
                    </p>
                    <p className="leading-relaxed mb-2">
                      Deutschland
                    </p>
                    <p className="leading-relaxed mb-2">
                      <strong className="text-foreground">Vertreten durch:</strong>
                    </p>
                    <p className="leading-relaxed mb-4">
                      Geschäftsführung
                    </p>
                    <p className="leading-relaxed mb-2">
                      <strong className="text-foreground">Kontakt:</strong>
                    </p>
                    <p className="leading-relaxed mb-2">
                      Telefon: +49 (0) 7551 93748-0
                    </p>
                    <p className="leading-relaxed mb-2">
                      Telefax: +49 (0) 7551 93748-99
                    </p>
                    <p className="leading-relaxed">
                      E-Mail: info@blauoptoelektronik.de
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Umsatzsteuer-ID</h2>
                  <p className="leading-relaxed">
                    Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
                  </p>
                  <p className="leading-relaxed mt-2">
                    DE [Umsatzsteuer-ID wird nach Angabe ergänzt]
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Wirtschafts-ID</h2>
                  <p className="leading-relaxed">
                    Wirtschafts-Identifikationsnummer gemäß § 139c Abgabenordnung:
                  </p>
                  <p className="leading-relaxed mt-2">
                    [Wirtschafts-ID wird nach Angabe ergänzt]
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Aufsichtsbehörde</h2>
                  <p className="leading-relaxed">
                    [Zuständige Aufsichtsbehörde wird nach Angabe ergänzt]
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Berufsbezeichnung und berufsrechtliche Regelungen</h2>
                  <p className="leading-relaxed">
                    Berufsbezeichnung: Optoelektronik
                  </p>
                  <p className="leading-relaxed mt-2">
                    Zuständige Kammer: [wird nach Angabe ergänzt]
                  </p>
                  <p className="leading-relaxed mt-2">
                    Verliehen in: Deutschland
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Redaktionell verantwortlich</h2>
                  <div className="bg-muted p-6 rounded-lg my-4">
                    <p className="leading-relaxed mb-2">
                      <strong className="text-foreground">BLAU Optoelektronik GmbH</strong>
                    </p>
                    <p className="leading-relaxed mb-2">
                      Deutschland
                    </p>
                    <p className="leading-relaxed">
                      E-Mail: info@blauoptoelektronik.de
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">EU-Streitschlichtung</h2>
                  <p className="leading-relaxed mb-4">
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                  </p>
                  <p className="leading-relaxed mb-4">
                    <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      https://ec.europa.eu/consumers/odr/
                    </a>
                  </p>
                  <p className="leading-relaxed">
                    Unsere E-Mail-Adresse finden Sie oben im Impressum.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
                  <p className="leading-relaxed mb-4">
                    Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Haftung für Inhalte</h2>
                  <p className="leading-relaxed mb-4">
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                  </p>
                  <p className="leading-relaxed mb-4">
                    Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Haftung für Links</h2>
                  <p className="leading-relaxed mb-4">
                    Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
                  </p>
                  <p className="leading-relaxed mb-4">
                    Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Urheberrecht</h2>
                  <p className="leading-relaxed mb-4">
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                  </p>
                  <p className="leading-relaxed mb-4">
                    Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Stand: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
