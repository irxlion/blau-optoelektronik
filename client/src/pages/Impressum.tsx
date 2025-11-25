import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Impressum() {
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
              <span>Impressum</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Impressum
            </h1>
            <p className="text-xl opacity-90">
              Angaben gemäß § 5 TMG
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
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
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

