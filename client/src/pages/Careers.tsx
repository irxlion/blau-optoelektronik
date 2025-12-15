import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchCareers, Career } from "@/lib/api";
import { MapPin, Briefcase, Mail, ExternalLink, Loader2, Calendar } from "lucide-react";
import SEO from "@/components/SEO";
import { Link } from "wouter";

export default function Careers() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const [careersData, setCareersData] = useState<{ de: Career[]; en: Career[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareers()
      .then((data) => {
        setCareersData(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const careers = useMemo(() => {
    if (!careersData) return [];
    return careersData[language].filter((c) => c.isPublished);
  }, [careersData, language]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BLAU Optoelektronik",
    url: "https://www.blau-optoelektronik.de/karriere",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={isEnglish ? "Careers - BLAU Optoelektronik" : "Karriere - BLAU Optoelektronik"}
        description={isEnglish
          ? "Join our team and help shape the future of optoelectronics. Current job openings and career opportunities at BLAU Optoelektronik."
          : "Werden Sie Teil unseres Teams und helfen Sie dabei, die Zukunft der Optoelektronik zu gestalten. Aktuelle Stellenausschreibungen und Karrieremöglichkeiten bei BLAU Optoelektronik."}
        structuredData={structuredData}
      />
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {isEnglish ? "Join Our Team" : "Werden Sie Teil unseres Teams"}
            </h1>
            <p className="text-xl text-muted-foreground">
              {isEnglish
                ? "Help shape the future of optoelectronics with innovative solutions"
                : "Helfen Sie mit, die Zukunft der Optoelektronik mit innovativen Lösungen zu gestalten"}
            </p>
          </div>
        </div>
      </section>

      {/* Careers List */}
      <section className="py-16">
        <div className="container">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : careers.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                {isEnglish ? "No open positions at the moment" : "Aktuell keine offenen Stellen"}
              </p>
              <p className="text-muted-foreground mb-8">
                {isEnglish
                  ? "We're always looking for talented people. Feel free to send us an unsolicited application."
                  : "Wir sind immer auf der Suche nach talentierten Menschen. Gerne können Sie uns auch eine Initiativbewerbung senden."}
              </p>
              <Button asChild>
                <Link href="/kontakt">
                  <Mail className="mr-2 h-4 w-4" />
                  {isEnglish ? "Contact us" : "Kontakt aufnehmen"}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 max-w-4xl mx-auto">
              {careers.map((career) => (
                <Card key={career.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{career.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {career.department && (
                            <Badge variant="secondary">
                              <Briefcase className="h-3 w-3 mr-1" />
                              {career.department}
                            </Badge>
                          )}
                          {career.location && (
                            <Badge variant="secondary">
                              <MapPin className="h-3 w-3 mr-1" />
                              {career.location}
                            </Badge>
                          )}
                          {career.employmentType && (
                            <Badge variant="outline">{career.employmentType}</Badge>
                          )}
                          {career.salaryRange && (
                            <Badge variant="outline">{career.salaryRange}</Badge>
                          )}
                        </div>
                        {career.shortDescription && (
                          <CardDescription className="text-base">{career.shortDescription}</CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none mb-6">
                      <div
                        className="text-muted-foreground whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: career.description.replace(/\n/g, "<br />") }}
                      />
                    </div>
                    
                    {(career.requirements || career.benefits) && (
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {career.requirements && (
                          <div>
                            <h4 className="font-semibold mb-2">
                              {isEnglish ? "Requirements" : "Anforderungen"}
                            </h4>
                            <div
                              className="text-sm text-muted-foreground whitespace-pre-line"
                              dangerouslySetInnerHTML={{ __html: career.requirements.replace(/\n/g, "<br />") }}
                            />
                          </div>
                        )}
                        {career.benefits && (
                          <div>
                            <h4 className="font-semibold mb-2">
                              {isEnglish ? "Benefits" : "Vorteile"}
                            </h4>
                            <div
                              className="text-sm text-muted-foreground whitespace-pre-line"
                              dangerouslySetInnerHTML={{ __html: career.benefits.replace(/\n/g, "<br />") }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      {career.applicationUrl ? (
                        <Button asChild className="flex-1">
                          <a href={career.applicationUrl} target="_blank" rel="noopener noreferrer">
                            {isEnglish ? "Apply now" : "Jetzt bewerben"}
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      ) : career.applicationEmail ? (
                        <Button asChild className="flex-1">
                          <a href={`mailto:${career.applicationEmail}?subject=${encodeURIComponent(`Bewerbung: ${career.title}`)}`}>
                            <Mail className="mr-2 h-4 w-4" />
                            {isEnglish ? "Apply via email" : "Per E-Mail bewerben"}
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

