import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Datenschutz() {
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
              <span>{isEnglish ? "Privacy Policy" : "Datenschutz"}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {isEnglish ? "Privacy Policy" : "Datenschutzerklärung"}
            </h1>
            <p className="text-xl opacity-90">
              {isEnglish ? "Information on data protection in accordance with GDPR" : "Informationen zum Datenschutz gemäß DSGVO"}
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
                  <h2 className="text-3xl font-bold mb-4 text-foreground">1. Data Protection at a Glance</h2>

                  <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">General Information</h3>
                  <p className="leading-relaxed">
                    The following information provides a simple overview of what happens to your personal data when you visit this website. Personal data is any data that can be used to personally identify you.
                  </p>

                  <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">Data Collection on This Website</h3>
                  <p className="leading-relaxed mb-4">
                    <strong className="text-foreground">Who is responsible for data collection on this website?</strong>
                  </p>
                  <p className="leading-relaxed mb-4">
                    Data processing on this website is carried out by the website operator. You can find the operator's contact details in the "Information on the Responsible Party" section of this privacy policy.
                  </p>
                  <p className="leading-relaxed mb-4">
                    <strong className="text-foreground">How do we collect your data?</strong>
                  </p>
                  <p className="leading-relaxed mb-4">
                    Your data is collected on the one hand by you providing it to us. This may be data that you enter in a contact form, for example.
                  </p>
                  <p className="leading-relaxed mb-4">
                    Other data is collected automatically or with your consent when you visit the website through our IT systems. This is primarily technical data (e.g. internet browser, operating system or time of page access). This data is collected automatically as soon as you enter this website.
                  </p>
                  <p className="leading-relaxed mb-4">
                    <strong className="text-foreground">What do we use your data for?</strong>
                  </p>
                  <p className="leading-relaxed mb-4">
                    Some of the data is collected to ensure error-free provision of the website. Other data may be used to analyze your user behavior.
                  </p>
                  <p className="leading-relaxed mb-4">
                    <strong className="text-foreground">What rights do you have regarding your data?</strong>
                  </p>
                  <p className="leading-relaxed">
                    You have the right to receive information about the origin, recipient and purpose of your stored personal data free of charge at any time. You also have the right to request the correction or deletion of this data. If you have given consent to data processing, you can revoke this consent at any time for the future. You also have the right to request the restriction of the processing of your personal data under certain circumstances. Furthermore, you have the right to lodge a complaint with the competent supervisory authority.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">2. Hosting</h2>
                  <p className="leading-relaxed">
                    This website is hosted by an external service provider (host). The personal data collected on this website is stored on the host's servers. This may include IP addresses, contact requests, meta and communication data, contract data, contact details, names, website accesses and other data generated via a website.
                  </p>
                  <p className="leading-relaxed mt-4">
                    The use of the host is for the purpose of contract fulfillment towards our potential and existing customers (Art. 6 para. 1 lit. b GDPR) and in the interest of a secure, fast and efficient provision of our online offer by a professional provider (Art. 6 para. 1 lit. f GDPR).
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">3. General Information and Mandatory Information</h2>

                  <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">Data Protection</h3>
                  <p className="leading-relaxed">
                    The operators of these pages take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with the statutory data protection regulations and this privacy policy.
                  </p>
                  <p className="leading-relaxed mt-4">
                    When you use this website, various personal data is collected. Personal data is data that can be used to personally identify you. This privacy policy explains what data we collect and what we use it for. It also explains how and for what purpose this is done.
                  </p>

                  <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">Information on the Responsible Party</h3>
                  <p className="leading-relaxed mb-4">
                    The responsible party for data processing on this website is:
                  </p>
                  <div className="bg-muted p-6 rounded-lg my-4">
                    <p className="leading-relaxed mb-2">
                      <strong className="text-foreground">BLAU Optoelektronik GmbH</strong>
                    </p>
                    <p className="leading-relaxed mb-2">
                      Germany
                    </p>
                    <p className="leading-relaxed mb-2">
                      Phone: +49 (0) 7551 93748-0
                    </p>
                    <p className="leading-relaxed">
                      Email: info@blauoptoelektronik.de
                    </p>
                  </div>
                  <p className="leading-relaxed">
                    The responsible party is the natural or legal person who alone or jointly with others determines the purposes and means of the processing of personal data (e.g. names, email addresses, etc.).
                  </p>

                  <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">Storage Duration</h3>
                  <p className="leading-relaxed">
                    Unless a more specific storage period has been specified within this privacy policy, your personal data will remain with us until the purpose for data processing no longer applies. If you assert a legitimate request for deletion or revoke consent to data processing, your data will be deleted unless we have other legally permissible reasons for storing your personal data.
                  </p>

                  <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">Revocation of Your Consent to Data Processing</h3>
                  <p className="leading-relaxed">
                    Many data processing operations are only possible with your express consent. You can revoke consent you have already given at any time. The legality of the data processing carried out until the revocation remains unaffected by the revocation.
                  </p>

                  <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">Right to Object to Data Collection in Special Cases</h3>
                  <p className="leading-relaxed">
                    If data processing is based on Art. 6 para. 1 lit. e or f GDPR, you have the right to object to the processing of your personal data at any time for reasons arising from your particular situation. The respective legal basis on which processing is based can be found in this privacy policy.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">4. Data Collection on This Website</h2>

                  <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">Contact Form</h3>
                  <p className="leading-relaxed mb-4">
                    If you send us inquiries via the contact form, your details from the inquiry form, including the contact data you provided there, will be stored by us for the purpose of processing the inquiry and in case of follow-up questions. We do not pass on this data without your consent.
                  </p>
                  <p className="leading-relaxed">
                    The processing of this data is based on Art. 6 para. 1 lit. b GDPR, if your inquiry is related to the fulfillment of a contract or is necessary for the implementation of pre-contractual measures. In all other cases, the processing is based on our legitimate interest in the effective processing of inquiries addressed to us (Art. 6 para. 1 lit. f GDPR) or on your consent (Art. 6 para. 1 lit. a GDPR) if this has been requested.
                  </p>

                  <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">Server Log Files</h3>
                  <p className="leading-relaxed mb-4">
                    The page provider automatically collects and stores information in so-called server log files, which your browser automatically transmits to us. These are:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Browser type and browser version</li>
                    <li>Operating system used</li>
                    <li>Referrer URL</li>
                    <li>Hostname of the accessing computer</li>
                    <li>Time of the server request</li>
                    <li>IP address</li>
                  </ul>
                  <p className="leading-relaxed">
                    This data is not merged with other data sources. The collection of this data is based on Art. 6 para. 1 lit. f GDPR. The website operator has a legitimate interest in the technically error-free presentation and optimization of its website.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">5. Your Rights</h2>
                  <p className="leading-relaxed mb-4">
                    You have the following rights:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li><strong className="text-foreground">Right to Information:</strong> You have the right to request information about your personal data processed by us.</li>
                    <li><strong className="text-foreground">Right to Rectification:</strong> You have the right to rectification of incorrect or completion of your personal data stored with us.</li>
                    <li><strong className="text-foreground">Right to Deletion:</strong> You can request the deletion of your personal data, provided there are no legal retention obligations.</li>
                    <li><strong className="text-foreground">Right to Restriction:</strong> You have the right to request the restriction of the processing of your personal data.</li>
                    <li><strong className="text-foreground">Right to Object:</strong> You have the right to object to the processing of your personal data at any time for reasons arising from your particular situation.</li>
                    <li><strong className="text-foreground">Data Portability:</strong> You have the right to receive personal data that you have provided to us in a structured, commonly used and machine-readable format.</li>
                    <li><strong className="text-foreground">Right to Complain:</strong> You have the right to lodge a complaint with a supervisory authority, in particular in the member state of your habitual residence, place of work or place of the alleged infringement.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">6. Changes to This Privacy Policy</h2>
                  <p className="leading-relaxed">
                    We reserve the right to adapt this privacy policy so that it always complies with current legal requirements or to implement changes to our services in the privacy policy. The new privacy policy will then apply to your next visit.
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
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
