import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AGB() {
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
              <span>AGB</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Allgemeine Geschäftsbedingungen
            </h1>
            <p className="text-xl opacity-90">
              AGB der BLAU Optoelektronik GmbH
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">1. Geltungsbereich</h2>
              <p className="leading-relaxed mb-4">
                (1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Lieferungen und Leistungen der BLAU Optoelektronik GmbH (nachfolgend "Verkäufer" genannt) an ihre Kunden (nachfolgend "Käufer" genannt).
              </p>
              <p className="leading-relaxed mb-4">
                (2) Abweichende, entgegenstehende oder ergänzende AGB des Käufers werden nicht Vertragsbestandteil, es sei denn, ihrer Geltung wird ausdrücklich schriftlich zugestimmt.
              </p>
              <p className="leading-relaxed">
                (3) Diese AGB gelten auch für alle künftigen Geschäfte mit dem Käufer, auch wenn sie nicht nochmals ausdrücklich vereinbart werden.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">2. Vertragsgegenstand</h2>
              <p className="leading-relaxed mb-4">
                (1) Vertragsgegenstand sind optoelektronische Komponenten und Systeme, insbesondere Lasermodule, Linienlaser, Punktlaser, Powelllinsen, OEM-Module und MVpulse-Produkte sowie kundenspezifische Entwicklungen.
              </p>
              <p className="leading-relaxed mb-4">
                (2) Alle Leistungen des Verkäufers erfolgen ausschließlich auf Grundlage dieser AGB.
              </p>
              <p className="leading-relaxed">
                (3) Angebote des Verkäufers sind freibleibend und unverbindlich, sofern nicht ausdrücklich etwas anderes vereinbart wurde.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">3. Vertragsabschluss</h2>
              <p className="leading-relaxed mb-4">
                (1) Der Vertrag kommt durch die schriftliche Auftragsbestätigung des Verkäufers oder durch die Lieferung der Ware zustande.
              </p>
              <p className="leading-relaxed mb-4">
                (2) Mündliche Nebenabreden bedürfen zu ihrer Wirksamkeit der schriftlichen Bestätigung durch den Verkäufer.
              </p>
              <p className="leading-relaxed">
                (3) Der Käufer ist an seine Bestellung 14 Tage gebunden, es sei denn, der Verkäufer lehnt die Bestellung innerhalb dieser Frist ab.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">4. Preise und Zahlungsbedingungen</h2>
              <p className="leading-relaxed mb-4">
                (1) Alle Preise verstehen sich in Euro zuzüglich der gesetzlichen Mehrwertsteuer. Die Preise gelten ab Werk bzw. ab Lager des Verkäufers unter Ausschluss der Verpackung, Versand- und Frachtkosten.
              </p>
              <p className="leading-relaxed mb-4">
                (2) Sofern nicht anders vereinbart, sind die Rechnungsbeträge innerhalb von 30 Tagen nach Rechnungsdatum ohne Abzug zur Zahlung fällig. Bei Zahlungsverzug werden Verzugszinsen in Höhe von 9 Prozentpunkten über dem Basiszinssatz berechnet.
              </p>
              <p className="leading-relaxed mb-4">
                (3) Der Käufer ist nur dann zur Aufrechnung berechtigt, wenn seine Gegenansprüche rechtskräftig festgestellt oder unbestritten sind. Ein Zurückbehaltungsrecht kann der Käufer nur geltend machen, soweit sein Gegenanspruch auf demselben Vertragsverhältnis beruht.
              </p>
              <p className="leading-relaxed">
                (4) Bei Zahlungsverzug behält sich der Verkäufer vor, weitere Lieferungen zurückzuhalten oder nur gegen Vorkasse zu leisten.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">5. Lieferung und Lieferzeit</h2>
              <p className="leading-relaxed mb-4">
                (1) Lieferzeiten und -termine sind nur dann verbindlich, wenn sie vom Verkäufer ausdrücklich schriftlich bestätigt wurden. Bei kundenspezifischen Entwicklungen können die Lieferzeiten abweichen und werden individuell vereinbart.
              </p>
              <p className="leading-relaxed mb-4">
                (2) Die Lieferfrist beginnt mit dem Datum der Auftragsbestätigung, jedoch nicht vor Klärung aller Einzelheiten der Ausführung und nicht vor Eingang einer vereinbarten Anzahlung.
              </p>
              <p className="leading-relaxed mb-4">
                (3) Die Lieferfrist wird als eingehalten angesehen, wenn bis zu ihrem Ablauf die Ware das Werk verlassen hat oder die Mitteilung über die Versandbereitschaft erfolgt ist.
              </p>
              <p className="leading-relaxed mb-4">
                (4) Der Verkäufer ist berechtigt, Teillieferungen zu leisten, soweit dies für den Käufer zumutbar ist.
              </p>
              <p className="leading-relaxed">
                (5) Bei höherer Gewalt, Arbeitskämpfen, behördlichen Maßnahmen, Ausfall von Transportmitteln, unvorhergesehenen Behinderungen bei Zulieferern oder anderen vom Verkäufer nicht zu vertretenden Umständen werden die Lieferfristen entsprechend verlängert.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">6. Gefahrübergang und Versand</h2>
              <p className="leading-relaxed mb-4">
                (1) Die Gefahr des zufälligen Untergangs und der zufälligen Verschlechterung der Ware geht mit der Übergabe, bei Versendung mit der Aushändigung an den Spediteur, den Frachtführer oder der sonst zur Ausführung der Versendung bestimmten Person oder Anstalt auf den Käufer über.
              </p>
              <p className="leading-relaxed mb-4">
                (2) Art und Weise der Versendung bestimmt der Verkäufer nach pflichtgemäßem Ermessen, sofern nicht etwas anderes vereinbart wurde.
              </p>
              <p className="leading-relaxed">
                (3) Verpackungskosten werden gesondert berechnet, sofern nicht anders vereinbart.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">7. Gewährleistung und Mängelhaftung</h2>
              <p className="leading-relaxed mb-4">
                (1) Der Verkäufer haftet für Mängel der gelieferten Ware nach Maßgabe der gesetzlichen Bestimmungen, soweit nachfolgend nichts anderes geregelt ist.
              </p>
              <p className="leading-relaxed mb-4">
                (2) Die Gewährleistungsfrist beträgt 24 Monate ab Lieferung der Ware, es sei denn, es handelt sich um gebrauchte Waren, für die die Gewährleistungsfrist 12 Monate beträgt.
              </p>
              <p className="leading-relaxed mb-4">
                (3) Der Käufer hat die gelieferte Ware unverzüglich nach Lieferung zu untersuchen und sichtbare Mängel unverzüglich, spätestens innerhalb von 14 Tagen nach Lieferung, schriftlich anzuzeigen. Versteckte Mängel sind unverzüglich nach Entdeckung anzuzeigen.
              </p>
              <p className="leading-relaxed mb-4">
                (4) Bei berechtigten Mängelrügen hat der Verkäufer zunächst das Recht zur Nacherfüllung durch Nachbesserung oder Ersatzlieferung. Schlägt die Nacherfüllung fehl oder ist sie dem Käufer nicht zumutbar, kann dieser nach seiner Wahl vom Vertrag zurücktreten oder die Minderung verlangen.
              </p>
              <p className="leading-relaxed">
                (5) Die Haftung des Verkäufers ist ausgeschlossen, wenn der Käufer die Ware nicht bestimmungsgemäß verwendet oder unsachgemäß behandelt hat.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">8. Haftung</h2>
              <p className="leading-relaxed mb-4">
                (1) Der Verkäufer haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie nach Maßgabe des Produkthaftungsgesetzes.
              </p>
              <p className="leading-relaxed mb-4">
                (2) Bei leichter Fahrlässigkeit haftet der Verkäufer nur bei Verletzung einer wesentlichen Vertragspflicht, deren Erfüllung die ordnungsgemäße Durchführung des Vertrages überhaupt erst ermöglicht und auf deren Einhaltung der Käufer regelmäßig vertrauen darf (Kardinalpflicht). In diesem Fall ist die Haftung auf den vorhersehbaren, typischerweise eintretenden Schaden begrenzt.
              </p>
              <p className="leading-relaxed mb-4">
                (3) Die vorstehenden Haftungsbeschränkungen gelten nicht bei Verletzung von Leben, Körper und Gesundheit.
              </p>
              <p className="leading-relaxed">
                (4) Soweit die Haftung des Verkäufers ausgeschlossen oder beschränkt ist, gilt dies auch für die Haftung seiner gesetzlichen Vertreter und Erfüllungsgehilfen.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">9. Eigentumsvorbehalt</h2>
              <p className="leading-relaxed mb-4">
                (1) Die gelieferte Ware bleibt bis zur vollständigen Bezahlung aller Forderungen aus der Geschäftsbeziehung Eigentum des Verkäufers.
              </p>
              <p className="leading-relaxed mb-4">
                (2) Der Käufer ist berechtigt, die vorbehaltene Ware im ordentlichen Geschäftsgang weiterzuveräußern. Er tritt bereits jetzt alle Forderungen in Höhe des Rechnungsbetrages ab, die ihm aus der Weiterveräußerung gegen seine Abnehmer oder Dritte erwachsen.
              </p>
              <p className="leading-relaxed">
                (3) Der Käufer ist nicht berechtigt, die vorbehaltene Ware zu verpfänden oder zur Sicherheit zu übereignen.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">10. Technische Daten und Dokumentation</h2>
              <p className="leading-relaxed mb-4">
                (1) Technische Daten, Zeichnungen, Abbildungen und sonstige Angaben in Prospekten, Katalogen, Datenblättern und anderen Unterlagen sind nur dann verbindlich, wenn sie ausdrücklich als verbindlich bezeichnet sind.
              </p>
              <p className="leading-relaxed mb-4">
                (2) Der Verkäufer behält sich Änderungen der Konstruktion, Form, Farbe und/oder Gewicht vor, soweit diese für den Käufer zumutbar sind und die vereinbarte Verwendbarkeit nicht beeinträchtigen.
              </p>
              <p className="leading-relaxed">
                (3) Alle technischen Dokumentationen, Zeichnungen und sonstigen Unterlagen bleiben geistiges Eigentum des Verkäufers und dürfen ohne dessen schriftliche Zustimmung nicht Dritten zugänglich gemacht werden.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">11. Rückgabe und Umtausch</h2>
              <p className="leading-relaxed mb-4">
                (1) Eine Rückgabe oder ein Umtausch von Waren ist nur nach vorheriger schriftlicher Vereinbarung möglich.
              </p>
              <p className="leading-relaxed mb-4">
                (2) Kundenspezifische Entwicklungen und Sonderanfertigungen können grundsätzlich nicht zurückgegeben werden.
              </p>
              <p className="leading-relaxed">
                (3) Bei einer vereinbarten Rücknahme können Kosten für Prüfung, Aufbereitung und Transport dem Käufer in Rechnung gestellt werden.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">12. Datenschutz</h2>
              <p className="leading-relaxed mb-4">
                Der Verkäufer verarbeitet personenbezogene Daten des Käufers im Rahmen der gesetzlichen Bestimmungen. Nähere Informationen hierzu finden sich in der Datenschutzerklärung des Verkäufers.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">13. Schlussbestimmungen</h2>
              <p className="leading-relaxed mb-4">
                (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
              </p>
              <p className="leading-relaxed mb-4">
                (2) Erfüllungsort und Gerichtsstand für alle Streitigkeiten aus diesem Vertragsverhältnis ist, soweit der Käufer Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist, der Geschäftssitz des Verkäufers.
              </p>
              <p className="leading-relaxed mb-4">
                (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, so bleibt die Wirksamkeit der übrigen Bestimmungen hiervon unberührt. Die unwirksame Bestimmung soll durch eine wirksame ersetzt werden, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.
              </p>
              <p className="leading-relaxed">
                (4) Änderungen und Ergänzungen dieser AGB bedürfen der Schriftform. Dies gilt auch für die Aufhebung dieser Schriftformklausel.
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

