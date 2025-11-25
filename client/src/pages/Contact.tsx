import { useState } from "react";
import { Mail, Phone, MapPin, Send, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
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
      <section className="relative bg-primary text-primary-foreground py-24 mt-20">
        <div className="container">
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
                      {isEnglish ? "Custom solutions" : "Individuelle Lösungen"}
                    </h3>
                    <p className="text-muted-foreground">
                      {isEnglish
                        ? "We develop customised products tailored to your requirements."
                        : "Wir entwickeln kundenspezifische Produkte nach Ihren Anforderungen."}
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
