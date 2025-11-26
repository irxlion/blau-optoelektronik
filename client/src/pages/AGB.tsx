import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AGB() {
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
              <span>{isEnglish ? "Terms & Conditions" : "AGB"}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {isEnglish ? "Terms & Conditions" : "Allgemeine Geschäftsbedingungen"}
            </h1>
            <p className="text-xl opacity-90">
              {isEnglish ? "General Terms and Conditions of BLAU Optoelektronik GmbH" : "AGB der BLAU Optoelektronik GmbH"}
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
                  <h2 className="text-3xl font-bold mb-4 text-foreground">1. Scope of Application</h2>
                  <p className="leading-relaxed mb-4">
                    (1) These General Terms and Conditions (GTC) apply to all deliveries and services of BLAU Optoelektronik GmbH (hereinafter referred to as "Seller") to its customers (hereinafter referred to as "Buyer").
                  </p>
                  <p className="leading-relaxed mb-4">
                    (2) Deviating, conflicting or supplementary GTC of the Buyer shall not become part of the contract unless their validity is expressly agreed to in writing.
                  </p>
                  <p className="leading-relaxed">
                    (3) These GTC also apply to all future business with the Buyer, even if they are not expressly agreed upon again.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">2. Subject Matter of the Contract</h2>
                  <p className="leading-relaxed mb-4">
                    (1) The subject matter of the contract is optoelectronic components and systems, in particular laser modules, line lasers, point lasers, Powell lenses, OEM modules and MVpulse products as well as customer-specific developments.
                  </p>
                  <p className="leading-relaxed mb-4">
                    (2) All services of the Seller are provided exclusively on the basis of these GTC.
                  </p>
                  <p className="leading-relaxed">
                    (3) Offers from the Seller are subject to change and non-binding unless expressly agreed otherwise.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">3. Conclusion of Contract</h2>
                  <p className="leading-relaxed mb-4">
                    (1) The contract is concluded by the Seller's written order confirmation or by delivery of the goods.
                  </p>
                  <p className="leading-relaxed mb-4">
                    (2) Verbal side agreements require written confirmation by the Seller to be effective.
                  </p>
                  <p className="leading-relaxed">
                    (3) The Buyer is bound by his order for 14 days, unless the Seller rejects the order within this period.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">4. Prices and Payment Terms</h2>
                  <p className="leading-relaxed mb-4">
                    (1) All prices are in euros plus statutory value added tax. Prices apply ex works or ex warehouse of the Seller, excluding packaging, shipping and freight costs.
                  </p>
                  <p className="leading-relaxed mb-4">
                    (2) Unless otherwise agreed, invoice amounts are due for payment within 30 days of the invoice date without deduction. In the event of late payment, default interest of 9 percentage points above the base rate will be charged.
                  </p>
                  <p className="leading-relaxed mb-4">
                    (3) The Buyer is only entitled to offset if his counterclaims have been legally established or are undisputed. The Buyer may only exercise a right of retention insofar as his counterclaim is based on the same contractual relationship.
                  </p>
                  <p className="leading-relaxed">
                    (4) In the event of late payment, the Seller reserves the right to withhold further deliveries or to make them only against advance payment.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">5. Delivery and Delivery Time</h2>
                  <p className="leading-relaxed mb-4">
                    (1) Delivery times and dates are only binding if they have been expressly confirmed in writing by the Seller. For customer-specific developments, delivery times may vary and will be agreed individually.
                  </p>
                  <p className="leading-relaxed mb-4">
                    (2) The delivery period begins on the date of the order confirmation, but not before clarification of all details of execution and not before receipt of an agreed down payment.
                  </p>
                  <p className="leading-relaxed mb-4">
                    (3) The delivery period is deemed to have been met if the goods have left the works or notification of readiness for dispatch has been given before its expiry.
                  </p>
                  <p className="leading-relaxed mb-4">
                    (4) The Seller is entitled to make partial deliveries insofar as this is reasonable for the Buyer.
                  </p>
                  <p className="leading-relaxed">
                    (5) In the event of force majeure, labor disputes, official measures, failure of means of transport, unforeseen obstacles at suppliers or other circumstances not attributable to the Seller, delivery periods will be extended accordingly.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">6. Transfer of Risk and Shipping</h2>
                  <p className="leading-relaxed mb-4">
                    (1) The risk of accidental loss and accidental deterioration of the goods passes to the Buyer upon handover, in the case of shipment upon handover to the forwarding agent, carrier or other person or institution designated to carry out the shipment.
                  </p>
                  <p className="leading-relaxed mb-4">
                    (2) The Seller determines the type and manner of shipment at its due discretion, unless otherwise agreed.
                  </p>
                  <p className="leading-relaxed">
                    (3) Packaging costs will be charged separately unless otherwise agreed.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">7. Warranty and Defect Liability</h2>
                  <p className="leading-relaxed mb-4">
                    (1) The Seller is liable for defects in the delivered goods in accordance with statutory provisions, unless otherwise stipulated below.
                  </p>
                  <p className="leading-relaxed mb-4">
                    (2) The warranty period is 24 months from delivery of the goods, unless they are used goods, for which the warranty period is 12 months.
                  </p>
                  <p className="leading-relaxed mb-4">
                    (3) The Buyer must inspect the delivered goods immediately upon delivery and report visible defects immediately, at the latest within 14 days of delivery, in writing. Hidden defects must be reported immediately upon discovery.
                  </p>
                  <p className="leading-relaxed mb-4">
                    (4) In the case of justified complaints about defects, the Seller initially has the right to subsequent performance by rectification or replacement delivery. If subsequent performance fails or is unreasonable for the Buyer, the Buyer may withdraw from the contract or reduce the price at his option.
                  </p>
                  <p className="leading-relaxed">
                    (5) The Seller's liability is excluded if the Buyer has not used the goods as intended or has handled them improperly.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">8. Liability</h2>
                  <p className="leading-relaxed mb-4">
                    (1) The Seller is liable without limitation for intent and gross negligence as well as in accordance with the Product Liability Act.
                  </p>
                  <p className="leading-relaxed mb-4">
                    (2) In the case of slight negligence, the Seller is only liable for breach of a material contractual obligation, the fulfillment of which enables the proper execution of the contract in the first place and on the observance of which the Buyer may regularly rely (cardinal obligation). In this case, liability is limited to foreseeable, typically occurring damage.
                  </p>
                  <p className="leading-relaxed mb-4">
                    (3) The above limitations of liability do not apply to injury to life, body and health.
                  </p>
                  <p className="leading-relaxed">
                    (4) Insofar as the Seller's liability is excluded or limited, this also applies to the liability of its legal representatives and vicarious agents.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">9. Retention of Title</h2>
                  <p className="leading-relaxed mb-4">
                    (1) The delivered goods remain the property of the Seller until full payment of all claims arising from the business relationship.
                  </p>
                  <p className="leading-relaxed mb-4">
                    (2) The Buyer is entitled to resell the goods subject to retention of title in the ordinary course of business. He hereby assigns all claims in the amount of the invoice amount that arise to him from the resale against his customers or third parties.
                  </p>
                  <p className="leading-relaxed">
                    (3) The Buyer is not entitled to pledge the goods subject to retention of title or to transfer them as security.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">10. Technical Data and Documentation</h2>
                  <p className="leading-relaxed mb-4">
                    (1) Technical data, drawings, illustrations and other information in brochures, catalogs, data sheets and other documents are only binding if they are expressly designated as binding.
                  </p>
                  <p className="leading-relaxed mb-4">
                    (2) The Seller reserves the right to make changes to the design, shape, color and/or weight insofar as these are reasonable for the Buyer and do not impair the agreed usability.
                  </p>
                  <p className="leading-relaxed">
                    (3) All technical documentation, drawings and other documents remain the intellectual property of the Seller and may not be made accessible to third parties without its written consent.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">11. Returns and Exchanges</h2>
                  <p className="leading-relaxed mb-4">
                    (1) Returns or exchanges of goods are only possible after prior written agreement.
                  </p>
                  <p className="leading-relaxed mb-4">
                    (2) Customer-specific developments and special productions cannot generally be returned.
                  </p>
                  <p className="leading-relaxed">
                    (3) In the case of an agreed return, costs for inspection, processing and transport may be charged to the Buyer.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">12. Data Protection</h2>
                  <p className="leading-relaxed mb-4">
                    The Seller processes the Buyer's personal data within the framework of statutory provisions. Further information can be found in the Seller's privacy policy.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">13. Final Provisions</h2>
                  <p className="leading-relaxed mb-4">
                    (1) The law of the Federal Republic of Germany applies, excluding the UN Convention on Contracts for the International Sale of Goods.
                  </p>
                  <p className="leading-relaxed mb-4">
                    (2) The place of performance and jurisdiction for all disputes arising from this contractual relationship is, insofar as the Buyer is a merchant, a legal entity under public law or a special fund under public law, the Seller's place of business.
                  </p>
                  <p className="leading-relaxed mb-4">
                    (3) Should individual provisions of these GTC be or become invalid, the validity of the remaining provisions shall remain unaffected. The invalid provision shall be replaced by a valid one that comes closest to the economic purpose of the invalid provision.
                  </p>
                  <p className="leading-relaxed">
                    (4) Amendments and supplements to these GTC require written form. This also applies to the cancellation of this written form clause.
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
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
