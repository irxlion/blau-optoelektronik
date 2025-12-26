import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, Download, Check, ChevronRight, Loader2, Calculator, LineChart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/data/products";
import SEO from "@/components/SEO";
import NotFound from "./NotFound";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProductDetail() {
  const params = useParams();
  const requestedId = params.id;
  const productId = requestedId === "machine-vision-laser" ? "machine-vision" : requestedId;
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleDownload = (download: { name: string; type: string; url: string }) => {
    if (!download.url || download.url === "#") {
      // Wenn keine URL vorhanden ist, könnte man hier eine Fehlermeldung anzeigen
      console.warn(`Download "${download.name}" hat keine gültige URL`);
      return;
    }

    // PDFs in neuem Tab öffnen, andere Dateien herunterladen
    if (download.type === "PDF" || download.url.toLowerCase().endsWith(".pdf")) {
      window.open(download.url, "_blank");
    } else {
      // Andere Dateien herunterladen
      const link = document.createElement("a");
      link.href = download.url;
      link.download = download.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        const found = data[language].find((p) => p.id === productId);
        setProduct(found);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId, language]);

  // SEO-Head HTML (aus Dashboard) in <head> einfügen
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!product?.seoHeadHtml) return;

    const containerId = "product-seo-head-html";
    // remove any previous container
    const existing = document.getElementById(containerId);
    if (existing) existing.remove();

    const container = document.createElement("div");
    container.id = containerId;
    // mark as managed
    container.setAttribute("data-managed", "true");
    container.innerHTML = product.seoHeadHtml;
    document.head.appendChild(container);

    return () => {
      container.remove();
    };
  }, [product?.seoHeadHtml]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return <NotFound />;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `https://www.blau-optoelektronik.de${product.image}`,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: "BLAU Optoelektronik",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "EUR",
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={`${product.name} - BLAU Optoelektronik`}
        description={product.description}
        image={`https://www.blau-optoelektronik.de${product.image}`}
        structuredData={structuredData}
      />
      <Header />

      {/* Breadcrumb */}
      <div className="bg-muted py-4 mt-20">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/produkte" className="hover:text-foreground transition-colors">
              {isEnglish ? "Products" : "Produkte"}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Header */}
      <section className="py-12">
        <div className="container">
          <Link href="/produkte">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isEnglish ? "Back to overview" : "Zurück zur Übersicht"}
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
                          ? "border-primary"
                          : "border-transparent hover:border-muted-foreground/30"
                        }`}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}

              {/* CTA (unter Galerie/Features) */}
              <div className="flex">
                <Link href="/kontakt">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 mt-[50px] mb-[50px]">
                    {isEnglish ? "Send inquiry" : "Anfrage senden"}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
                {product.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{product.name}</h1>
              <p className="text-xl text-muted-foreground mb-6">{product.description}</p>
              <div
                className="text-foreground mb-8 leading-relaxed space-y-3 [&_p]:leading-relaxed [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: product.longDescription || "" }}
              />

              {/* CTA wurde in die linke Spalte unter Galerie/Features verschoben */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-foreground">
            {isEnglish ? "All features" : "Alle Features"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.features.map((feature, idx) => (
              <Card key={idx} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Check className="h-5 w-5 text-secondary" />
                    </div>
                    <p className="text-card-foreground">{feature}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {/* Tools Buttons */}
            {product.tools && product.tools.length > 0 && (
              <>
                {product.tools.includes("max-power-simulation") && (
                  <Card className="border-border/50 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <Link href={isEnglish ? "/tools/maximum-power-simulation" : "/tools/maximale-leistung-simulation"}>
                        <Button className="w-full" variant="outline">
                          <Calculator className="mr-2 h-5 w-5" />
                          {isEnglish ? "Maximum Power Simulation" : "Maximale Leistung Simulation"}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
                {product.tools.includes("line-thickness-simulation") && (
                  <Card className="border-border/50 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <Link href={isEnglish ? "/tools/line-thickness-simulation" : "/tools/liniendickensimulation"}>
                        <Button className="w-full" variant="outline">
                          <LineChart className="mr-2 h-5 w-5" />
                          {isEnglish ? "Line Thickness Simulation" : "Liniendicken Simulation"}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-foreground">
            {isEnglish ? "Technical specifications" : "Technische Daten"}
          </h2>
          <Card className="border-border/50">
            <CardContent className="p-0">
              {product.technicalPropertiesHtml ? (
                <div className="p-6">
                  {product.technicalPropertiesHtml
                    .split("<!-- TECH_TABLE_SPLIT -->")
                    .map((b) => b.trim())
                    .filter(Boolean)
                    .map((block, i) => (
                      <div
                        key={i}
                        className="text-foreground [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_table]:my-[61px] [&_th]:text-left [&_th]:font-semibold [&_th]:p-3 [&_th]:border-b [&_td]:p-3 [&_td]:border-b [&_tr:hover]:bg-muted/50 [&_caption]:text-left [&_caption]:text-muted-foreground [&_caption]:mb-2 [&_caption]:text-sm"
                        dangerouslySetInnerHTML={{ __html: block }}
                      />
                    ))}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {Object.entries(product.specifications).map(([key, value], idx) => (
                    <div
                      key={idx}
                      className="grid md:grid-cols-2 gap-4 p-6 hover:bg-muted/50 transition-colors"
                    >
                      <div className="font-semibold text-foreground">{key}</div>
                      <div className="text-muted-foreground">{value}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Applications */}
      <section className="py-12 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-foreground">
            {isEnglish ? "Applications" : "Anwendungsbereiche"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.applications.map((application, idx) => (
              <Link key={idx} href="/technologie" className="h-full">
                <Card className="border-border/50 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                  <CardContent className="p-6 flex-1 flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0" />
                    <p className="text-card-foreground font-medium">{application}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-foreground">
            {isEnglish ? "Datasheets" : "Datenblätter"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.downloads
              .filter((download) => {
                // GLB-Dateien ausblenden
                const isGLB = 
                  download.type?.toLowerCase() === "glb" ||
                  download.name?.toLowerCase().includes(".glb") ||
                  download.url?.toLowerCase().includes(".glb");
                return !isGLB;
              })
              .map((download, idx) => (
              <Card 
                key={idx} 
                className="border-border/50 hover:shadow-lg transition-shadow group cursor-pointer"
                onClick={() => handleDownload(download)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-secondary font-medium mb-1">{download.type}</div>
                      <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                        {download.name}
                      </h3>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(download);
                      }}
                      title={isEnglish ? `Download ${download.name}` : `${download.name} herunterladen`}
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isEnglish ? `Interested in ${product.name}?` : `Interesse an ${product.name}?`}
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            {isEnglish
              ? "Contact us for further details, technical consulting or a tailored quotation."
              : "Kontaktieren Sie uns für weitere Informationen, technische Beratung oder ein individuelles Angebot."}
          </p>
          <Link href="/kontakt">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              {isEnglish ? "Talk to us now" : "Jetzt Kontakt aufnehmen"}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
