import { useState } from "react";
import { Mail, Phone, MapPin, Send, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Contact() {
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
    toast.success("Vielen Dank für Ihre Nachricht! Wir werden uns schnellstmöglich bei Ihnen melden.");
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
              <span>Kontakt</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Kontaktieren Sie uns
            </h1>
            <p className="text-xl opacity-90">
              Wir freuen uns auf Ihre Anfrage und beraten Sie gerne zu unseren Produkten und Lösungen.
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
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">Telefon</h3>
                <p className="text-muted-foreground mb-2">Montag - Freitag, 8:00 - 17:00 Uhr</p>
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
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">E-Mail</h3>
                <p className="text-muted-foreground mb-2">Wir antworten innerhalb von 24 Stunden</p>
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
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">Standort</h3>
                <p className="text-muted-foreground mb-2">BLAU Optoelektronik GmbH</p>
                <p className="text-primary font-medium">
                  Deutschland
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">Senden Sie uns eine Nachricht</h2>
              <p className="text-muted-foreground mb-8">
                Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen. Für dringende Anfragen rufen Sie uns bitte direkt an.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Ihr Name"
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                      E-Mail *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="ihre.email@beispiel.de"
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2 text-foreground">
                      Unternehmen
                    </label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Ihr Unternehmen"
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2 text-foreground">
                      Telefon
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
                    Betreff *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Worum geht es?"
                    className="bg-background"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
                    Nachricht *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Ihre Nachricht an uns..."
                    className="bg-background resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90">
                  Nachricht senden
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">Warum BLAU Optoelektronik?</h2>
              <p className="text-muted-foreground mb-8">
                Mit über 30 Jahren Erfahrung in der Entwicklung und Fertigung von Optoelektronik sind wir Ihr zuverlässiger Partner.
              </p>

              <div className="space-y-6">
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-card-foreground">Schnelle Reaktionszeit</h3>
                    <p className="text-muted-foreground">
                      Wir beantworten Ihre Anfragen in der Regel innerhalb von 24 Stunden.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-card-foreground">Kompetente Beratung</h3>
                    <p className="text-muted-foreground">
                      Unser Expertenteam berät Sie umfassend zu allen technischen Fragen.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-card-foreground">Individuelle Lösungen</h3>
                    <p className="text-muted-foreground">
                      Wir entwickeln kundenspezifische Produkte nach Ihren Anforderungen.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-card-foreground">Made in Germany</h3>
                    <p className="text-muted-foreground">
                      Entwicklung und Produktion am Standort Deutschland garantieren höchste Qualität.
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
