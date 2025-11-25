import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Datenschutz() {
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
              <span>Datenschutz</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Datenschutzerklärung
            </h1>
            <p className="text-xl opacity-90">
              Informationen zum Datenschutz gemäß DSGVO
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">1. Datenschutz auf einen Blick</h2>
              
              <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">Allgemeine Hinweise</h3>
              <p className="leading-relaxed">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
              </p>

              <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">Datenerfassung auf dieser Website</h3>
              <p className="leading-relaxed mb-4">
                <strong className="text-foreground">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong>
              </p>
              <p className="leading-relaxed mb-4">
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle" in dieser Datenschutzerklärung entnehmen.
              </p>
              <p className="leading-relaxed mb-4">
                <strong className="text-foreground">Wie erfassen wir Ihre Daten?</strong>
              </p>
              <p className="leading-relaxed mb-4">
                Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
              </p>
              <p className="leading-relaxed mb-4">
                Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.
              </p>
              <p className="leading-relaxed mb-4">
                <strong className="text-foreground">Wofür nutzen wir Ihre Daten?</strong>
              </p>
              <p className="leading-relaxed mb-4">
                Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
              </p>
              <p className="leading-relaxed mb-4">
                <strong className="text-foreground">Welche Rechte haben Sie bezüglich Ihrer Daten?</strong>
              </p>
              <p className="leading-relaxed">
                Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">2. Hosting</h2>
              <p className="leading-relaxed">
                Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine Website generiert werden, handeln.
              </p>
              <p className="leading-relaxed mt-4">
                Der Einsatz des Hosters erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren potenziellen und bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots durch einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">3. Allgemeine Hinweise und Pflichtinformationen</h2>
              
              <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">Datenschutz</h3>
              <p className="leading-relaxed">
                Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzbestimmungen sowie dieser Datenschutzerklärung.
              </p>
              <p className="leading-relaxed mt-4">
                Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.
              </p>

              <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">Hinweis zur verantwortlichen Stelle</h3>
              <p className="leading-relaxed mb-4">
                Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
              </p>
              <div className="bg-muted p-6 rounded-lg my-4">
                <p className="leading-relaxed mb-2">
                  <strong className="text-foreground">BLAU Optoelektronik GmbH</strong>
                </p>
                <p className="leading-relaxed mb-2">
                  Deutschland
                </p>
                <p className="leading-relaxed mb-2">
                  Telefon: +49 (0) 7551 93748-0
                </p>
                <p className="leading-relaxed">
                  E-Mail: info@blauoptoelektronik.de
                </p>
              </div>
              <p className="leading-relaxed">
                Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
              </p>

              <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">Speicherdauer</h3>
              <p className="leading-relaxed">
                Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben.
              </p>

              <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
              <p className="leading-relaxed">
                Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
              </p>

              <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">Widerspruchsrecht gegen die Datenerhebung in besonderen Fällen</h3>
              <p className="leading-relaxed">
                Wenn die Datenverarbeitung auf Grundlage von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, haben Sie jederzeit das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, gegen die Verarbeitung Ihrer personenbezogenen Daten Widerspruch einzulegen. Die jeweilige Rechtsgrundlage, auf denen eine Verarbeitung beruht, entnehmen Sie dieser Datenschutzerklärung.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">4. Datenerfassung auf dieser Website</h2>
              
              <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">Kontaktformular</h3>
              <p className="leading-relaxed mb-4">
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
              </p>
              <p className="leading-relaxed">
                Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), sofern diese abgefragt wurde.
              </p>

              <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">Server-Log-Dateien</h3>
              <p className="leading-relaxed mb-4">
                Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Browsertyp und Browserversion</li>
                <li>verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse</li>
              </ul>
              <p className="leading-relaxed">
                Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Optimierung seiner Website.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">5. Ihre Rechte</h2>
              <p className="leading-relaxed mb-4">
                Sie haben folgende Rechte:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong className="text-foreground">Auskunftsrecht:</strong> Sie haben das Recht, Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen.</li>
                <li><strong className="text-foreground">Berichtigungsrecht:</strong> Sie haben ein Recht auf Berichtigung unrichtiger oder auf Vervollständigung Ihrer bei uns gespeicherten personenbezogenen Daten.</li>
                <li><strong className="text-foreground">Löschungsrecht:</strong> Sie können die Löschung Ihrer personenbezogenen Daten verlangen, soweit keine gesetzlichen Aufbewahrungspflichten bestehen.</li>
                <li><strong className="text-foreground">Einschränkungsrecht:</strong> Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.</li>
                <li><strong className="text-foreground">Widerspruchsrecht:</strong> Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Sie betreffender personenbezogener Daten Widerspruch einzulegen.</li>
                <li><strong className="text-foreground">Datenübertragbarkeit:</strong> Sie haben das Recht, personenbezogene Daten, die Sie uns bereitgestellt haben, in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten.</li>
                <li><strong className="text-foreground">Beschwerderecht:</strong> Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren, insbesondere in dem Mitgliedstaat Ihres Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">6. Änderungen dieser Datenschutzerklärung</h2>
              <p className="leading-relaxed">
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
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

