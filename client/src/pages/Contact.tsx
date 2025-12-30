import { useState } from "react";
import { Mail, Phone, MapPin, Send, ChevronRight, Building2, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import ParallaxSection from "@/components/ParallaxSection";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Contact() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      isEnglish
        ? "Thank you for your message! We will get back to you as soon as possible."
        : "Vielen Dank für Ihre Nachricht! Wir werden uns schnellstmöglich bei Ihnen melden."
    );
    setFormData({
      name: "",
      email: "",
      company: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-24 mt-20 overflow-hidden">
        {/* Background Video with Parallax */}
        <ParallaxSection speed={0.3} className="absolute inset-0 z-0">
          <video
            src="/hearo.mov"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
        </ParallaxSection>

        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm mb-4 opacity-90">
              <span>Home</span>
              <ChevronRight className="h-4 w-4" />
              <span>{isEnglish ? "Contact" : "Kontakt"}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {isEnglish ? "Get in touch" : "Kontaktieren Sie uns"}
            </h1>
            <p className="text-xl opacity-90">
              {isEnglish
                ? "We are looking forward to your enquiry and will gladly advise you on our products and solutions."
                : "Wir freuen uns auf Ihre Anfrage und beraten Sie gerne zu unseren Produkten und Lösungen."}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                  {isEnglish ? "Phone" : "Telefon"}
                </h3>
                <p className="text-muted-foreground mb-2">
                  {isEnglish ? "Monday – Friday, 8:00 am – 5:00 pm" : "Montag - Freitag, 8:00 - 17:00 Uhr"}
                </p>
                <a href="tel:+497551937480" className="text-primary hover:underline font-medium">
                 +49 (0) 7551 93748-0
                </a>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                  E-mail
                </h3>
                <p className="text-muted-foreground mb-2">
                  {isEnglish ? "We typically reply within 24 hours" : "Wir antworten innerhalb von 24 Stunden"}
                </p>
                <a href="mailto:info@blauoptoelektronik.de" className="text-primary hover:underline font-medium">
                  info@blauoptoelektronik.de
                </a>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                  {isEnglish ? "Location" : "Standort"}
                </h3>
                <p className="text-muted-foreground mb-2">BLAU Optoelektronik GmbH</p>
                <p className="text-primary font-medium">
                  {isEnglish ? "Germany" : "Deutschland"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Distribution Partner Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              {isEnglish ? "Distribution Partner" : "Vertriebspartner"}
            </h2>
            <Card className="border-border/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-8 w-8 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground mb-6">
                      {isEnglish
                        ? "Since 2010, we have been distributing a portion of our laser modules ourselves. You can obtain another portion of our products exclusively through our distribution partner Laser Components. We will be happy to provide you with the right contact person."
                        : "Seit 2010 vertreiben wir einen Teil unserer Lasermodule selbst. Einen weiteren Teil unserer Produkte erhalten Sie exklusiv über unseren Vertriebspartner Laser Components. Wir nennen Ihnen gerne den richtigen Ansprechpartner."}
                    </p>
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                          Laser Components Germany GmbH
                        </h3>
                        <div className="space-y-2 text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Werner-von-Siemens-Str. 15, 82140 Olching, Deutschland
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <a href="mailto:info@lasercomponents.com" className="text-primary hover:underline">
                              info@lasercomponents.com
                            </a>
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <a href="tel:+49814228640" className="text-primary hover:underline">
                              +49 8142 2864-0
                            </a>
                          </p>
                          <p>
                            <a href="https://www.lasercomponents.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              https://www.lasercomponents.com/
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                {isEnglish ? "Send us a message" : "Senden Sie uns eine Nachricht"}
              </h2>
              <p className="text-muted-foreground mb-8">
                {isEnglish
                  ? "Fill out the form and we will get back to you as soon as possible. For urgent requests please call us directly."
                  : "Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen. Für dringende Anfragen rufen Sie uns bitte direkt an."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
                      {isEnglish ? "Name *" : "Name *"}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder={isEnglish ? "Your name" : "Ihr Name"}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                      E-mail *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder={isEnglish ? "your.email@example.com" : "ihre.email@beispiel.de"}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2 text-foreground">
                      {isEnglish ? "Company" : "Unternehmen"}
                    </label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder={isEnglish ? "Your company" : "Ihr Unternehmen"}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2 text-foreground">
                      {isEnglish ? "Phone" : "Telefon"}
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+49 (0) 7551 93748-0"
                      className="bg-background"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2 text-foreground">
                      {isEnglish ? "Subject *" : "Betreff *"}
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                      placeholder={isEnglish ? "What is it about?" : "Worum geht es?"}
                    className="bg-background"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
                      {isEnglish ? "Message *" : "Nachricht *"}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                      placeholder={isEnglish ? "Your message to us..." : "Ihre Nachricht an uns..."}
                    className="bg-background resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90">
                  {isEnglish ? "Send message" : "Nachricht senden"}
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                {isEnglish ? "Why BLAU Optoelektronik?" : "Warum BLAU Optoelektronik?"}
              </h2>
              <p className="text-muted-foreground mb-8">
                {isEnglish
                  ? "With more than 30 years of experience in developing and manufacturing optoelectronics we are your reliable partner."
                  : "Mit über 30 Jahren Erfahrung in der Entwicklung und Fertigung von Optoelektronik sind wir Ihr zuverlässiger Partner."}
              </p>

              <div className="space-y-6">
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                      {isEnglish ? "Fast response time" : "Schnelle Reaktionszeit"}
                    </h3>
                    <p className="text-muted-foreground">
                      {isEnglish
                        ? "We usually reply to enquiries within 24 hours."
                        : "Wir beantworten Ihre Anfragen in der Regel innerhalb von 24 Stunden."}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                      {isEnglish ? "Expert consulting" : "Kompetente Beratung"}
                    </h3>
                    <p className="text-muted-foreground">
                      {isEnglish
                        ? "Our experts provide comprehensive guidance on every technical question."
                        : "Unser Expertenteam berät Sie umfassend zu allen technischen Fragen."}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                      {isEnglish ? "Made in Germany" : "Made in Germany"}
                    </h3>
                    <p className="text-muted-foreground">
                      {isEnglish
                        ? "Development and production in Germany guarantee the highest quality."
                        : "Entwicklung und Produktion am Standort Deutschland garantieren höchste Qualität."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Directions Warning Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              {isEnglish ? "Important Directions Information" : "Wichtige Hinweise zur Anfahrt"}
            </h2>
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-lg font-semibold mb-2">
                {isEnglish ? "Important Notice" : "Wichtiger Hinweis"}
              </AlertTitle>
              <AlertDescription className="space-y-4">
                <p>
                  {isEnglish
                    ? "Please note when arriving or delivering to Askaniaweg 4 that you will cross a third-party property for which we can only grant you passage."
                    : "Bitte beachten Sie bei der Anfahrt oder Anlieferung zum Askaniaweg 4, dass Sie dabei ein fremdes Grundstück überqueren für das wir Ihnen lediglich die Durchfahrt gewähren dürfen."}
                </p>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-3">
                  <p className="font-semibold">
                    {isEnglish
                      ? "According to the judgment of the Konstanz Regional Court of August 30, 2022, Case No. C4 O 332/21, our landlords have been ordered to refrain from:"
                      : "Gem. Urteil des Landgerichts Konstanz vom 30.08.2022, Az: C4 O 332/21, sind unsere Vermieter verurteilt worden, es zu unterlassen:"}
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      {isEnglish
                        ? "Stopping, parking, turning, or unloading on the plaintiff's property (Plot 2888/38)"
                        : "Auf dem Grundstück der Kläger (Flurstück 2888/38) zu halten, zu parken, zu wenden, zu entladen oder dies ihren Mietern, Besuchern, Arbeitnehmern oder Lieferanten etc. zu gestatten."}
                    </li>
                    <li>
                      {isEnglish
                        ? "Allowing their tenants, visitors, employees, or suppliers to do the same"
                        : "Dies ihren Mietern, Besuchern, Arbeitnehmern oder Lieferanten etc. zu gestatten"}
                    </li>
                  </ul>
                  <p>
                    {isEnglish
                      ? "We/You may continue to drive across the plaintiff's property on the right of way, which results from the attached site plan. Nothing more."
                      : "Wir/Sie dürfen weiterhin auf dem Geh- und Fahrrecht, welches sich aus dem beiliegenden Lageplan ergibt, das Grundstück der Kläger überfahren. Mehr aber auch nicht."}
                  </p>
                  <p className="font-semibold text-destructive">
                    {isEnglish
                      ? "The sanction against us in case of a violation is a fine of up to EUR 250,000 or alternatively imprisonment of up to 6 months."
                      : "Die Sanktion gegen uns bei einem Verstoß ist ein Ordnungsgeld bis zu EUR 250.000 oder ersatzweise Ordnungshaft bis zu 6 Monate."}
                  </p>
                  <p>
                    {isEnglish
                      ? "We therefore urgently request that you only drive across the property in the area of the right of way and refrain from the above prohibited actions (stopping, parking, turning, unloading, or allowing tenants, visitors, employees, or suppliers to do so). If you do not comply with our request and violate the court injunction, we will hold you responsible for any resulting damage in the form of a recourse claim."
                      : "Wir fordern Sie daher dringend auf, das Grundstück im Bereich des Geh- und Fahrrechts nur zu überfahren und die obigen verbotenen Handlungen (zu halten, zu parken, zu wenden, zu entladen oder dies Mietern, Besuchern, Arbeitnehmern oder Lieferanten zu gestatten) zu unterlassen. Sollten Sie unserer Bitte nicht nachkommen und gegen das gerichtliche Unterlassungsverbot verstoßen, machen wir Sie für den daraus entstehenden Schaden verantwortlich in Form des Regressanspruches."}
                  </p>
                  <p className="font-semibold">
                    {isEnglish
                      ? "We therefore urgently request your attention, also in your own interest."
                      : "Wir bitten daher dringend um Beachtung auch in Ihrem eigenen Interesse."}
                  </p>
                </div>
                <p className="mt-4">
                  <strong>{isEnglish ? "Address:" : "Adresse:"}</strong> Askaniaweg 4
                </p>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
