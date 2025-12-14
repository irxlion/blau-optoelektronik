import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { APP_LOGO } from "@/const";
import { Button } from "@/components/ui/button";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/contexts/LanguageContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ContactDialog } from "@/components/ContactDialog";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [location] = useLocation();
  const { language, setLanguage } = useLanguage();
  const isEnglish = language === "en";
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [menuItemsVisible, setMenuItemsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Animation für Menü-Items beim Öffnen
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Kurze Verzögerung für bessere Animation
      const timer = setTimeout(() => {
        setMenuItemsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setMenuItemsVisible(false);
    }
  }, [isMobileMenuOpen]);

  const productCategories = isEnglish
    ? [
      { name: "Machine Vision Laser Modules", href: "/produkte/machine-vision", description: "Lasers for industrial imaging" },
      { name: "Line Lasers", href: "/produkte/linienlaser", description: "Precision positioning" },
      { name: "Point Lasers", href: "/produkte/punktlaser", description: "Round or elliptical beam profiles" },
      { name: "Powell Lenses", href: "/produkte/powelllinsen", description: "Aspheric optics" },
      { name: "OEM Modules", href: "/produkte/oem-module", description: "Custom solutions" },
      { name: "MVpulse", href: "/produkte/mvpulse", description: "Eye safety & high performance" },
    ]
    : [
      { name: "Machine Vision Lasermodule", href: "/produkte/machine-vision", description: "Laser für industrielle Bildverarbeitung" },
      { name: "Linienlaser", href: "/produkte/linienlaser", description: "Präzise Positionierung" },
      { name: "Punktlaser", href: "/produkte/punktlaser", description: "Runde oder elliptische Strahlprofile" },
      { name: "Powelllinsen", href: "/produkte/powelllinsen", description: "Asphärische Linsen" },
      { name: "OEM Module", href: "/produkte/oem-module", description: "Kundenspezifische Lösungen" },
      { name: "MVpulse", href: "/produkte/mvpulse", description: "Augensicherheit & Hohe Leistung" },
    ];

  const toolsCategories = isEnglish
    ? [
      { name: "Maximum Power Simulation", href: "/tools/maximum-power-simulation", description: "Calculate maximum laser power" },
      { name: "Line Thickness Simulation", href: "/tools/line-thickness-simulation", description: "Calculate line thickness at focus distance" },
    ]
    : [
      { name: "Maximale Leistung Simulation", href: "/tools/maximale-leistung-simulation", description: "Maximale Laserleistung berechnen" },
      { name: "Liniendicken Simulation", href: "/tools/liniendickensimulation", description: "Liniendicke bei Fokusdistanz berechnen" },
    ];

  const navItems = isEnglish
    ? [
      {
        name: "Products",
        href: "/produkte",
        hasDropdown: true,
        dropdownItems: productCategories,
      },
      { name: "Technology", href: "/technologie" },
      { name: "Industries", href: "/branchen" },
      { name: "Company", href: "/unternehmen" },
      { name: "Resources", href: "/ressourcen" },
      {
        name: "Tools",
        href: "/tools",
        hasDropdown: true,
        dropdownItems: toolsCategories,
      },
      { name: "Contact", href: "/kontakt" },
    ]
    : [
      {
        name: "Produkte",
        href: "/produkte",
        hasDropdown: true,
        dropdownItems: productCategories,
      },
      { name: "Technologie", href: "/technologie" },
      { name: "Branchen", href: "/branchen" },
      { name: "Unternehmen", href: "/unternehmen" },
      { name: "Ressourcen", href: "/ressourcen" },
      {
        name: "Tools",
        href: "/tools",
        hasDropdown: true,
        dropdownItems: toolsCategories,
      },
      { name: "Kontakt", href: "/kontakt" },
    ];

  const desktopCta = isEnglish ? "Contact us" : "Kontakt aufnehmen";
  const mobileNavLabel = isEnglish ? "Mobile navigation" : "Mobile Navigation";
  const mainNavLabel = isEnglish ? "Main navigation" : "Hauptnavigation";
  const dropdownAriaLabel = isEnglish ? "submenu" : "Untermenü";

  const isHome = location === "/";
  const useLightNavColors = isHome && !isScrolled;

  const getNavItemClass = (href: string) => {
    const isActive = location === href;
    if (isActive) {
      return useLightNavColors ? "text-secondary" : "text-primary";
    }
    return useLightNavColors ? "text-white hover:text-white/80" : "text-foreground hover:text-primary";
  };

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
        }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            aria-label={isEnglish ? "Go to homepage" : "Zur Startseite"}
          >
            <img src={APP_LOGO} alt="BLAU Optoelektronik Logo" className="h-10 w-auto" />
            <div className="hidden md:block">
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav role="navigation" aria-label={mainNavLabel} className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => {
                  if (item.hasDropdown) {
                    if (dropdownTimeoutRef.current) {
                      clearTimeout(dropdownTimeoutRef.current);
                      dropdownTimeoutRef.current = null;
                    }
                    setActiveDropdown(item.name);
                  }
                }}
                onMouseLeave={() => {
                  if (item.hasDropdown) {
                    dropdownTimeoutRef.current = setTimeout(() => {
                      setActiveDropdown(null);
                    }, 150);
                  }
                }}
              >
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-1 transition-colors ${getNavItemClass(item.href)}`}
                    aria-expanded={item.hasDropdown && activeDropdown === item.name}
                    aria-haspopup={item.hasDropdown}
                  >
                    {item.name}
                    {item.hasDropdown && <ChevronDown className="h-4 w-4" aria-hidden="true" />}
                  </Button>
                </Link>

                {/* Invisible bridge to prevent gap */}
                {item.hasDropdown && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 w-full h-2" />
                )}

                {/* Mega Menu Dropdown */}
                {item.hasDropdown && activeDropdown === item.name && (
                  <div
                    role="menu"
                    aria-label={`${item.name} ${dropdownAriaLabel}`}
                    className="absolute top-full left-0 pt-2 w-96 bg-transparent"
                  >
                    <div className="bg-card border border-border rounded-lg shadow-xl p-4">
                    <div className="grid gap-2">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link key={dropdownItem.href} href={dropdownItem.href}>
                          <div role="menuitem" className="p-3 rounded-md hover:bg-accent transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary">
                            <div className="font-medium text-card-foreground">{dropdownItem.name}</div>
                            <div className="text-sm text-muted-foreground">{dropdownItem.description}</div>
                          </div>
                        </Link>
                      ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button + Language Switch */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex rounded-full border border-border overflow-hidden">
              {SUPPORTED_LANGUAGES.map(({ code, label }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLanguage(code)}
                  className={`px-3 py-1 text-xs font-semibold transition-colors ${language === code ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
                    }`}
                  aria-pressed={language === code}
                >
                  {label}
                </button>
              ))}
            </div>
            <Button 
              onClick={() => setIsContactDialogOpen(true)}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              {desktopCta}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 ${useLightNavColors ? "text-white" : "text-foreground"} focus:outline-none focus:ring-2 focus:ring-primary rounded`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={
              isMobileMenuOpen
                ? isEnglish
                  ? "Close menu"
                  : "Menü schließen"
                : isEnglish
                  ? "Open menu"
                  : "Menü öffnen"
            }
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Menu - Using Sheet Component */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="right" className="w-full sm:max-w-sm p-0">
            <SheetHeader className="px-6 pt-6 pb-4 border-b">
              <SheetTitle className="text-left">
                {isEnglish ? "Menu" : "Menü"}
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
              {/* Scrollable Content */}
              <nav 
                className="flex-1 overflow-y-auto px-6 py-4" 
                role="navigation" 
                aria-label={mobileNavLabel}
              >
                <div className="flex flex-col gap-2">
                  {/* Language Switcher */}
                  <div 
                    className={cn(
                      "flex items-center gap-2 mb-4 pb-4 border-b transition-all duration-300",
                      menuItemsVisible 
                        ? "opacity-100 translate-x-0" 
                        : "opacity-0 -translate-x-4"
                    )}
                    style={{ transitionDelay: "50ms" }}
                  >
                    {SUPPORTED_LANGUAGES.map(({ code, label, name }) => (
                      <Button
                        key={code}
                        variant={language === code ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => setLanguage(code)}
                        aria-pressed={language === code}
                        title={name}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Navigation Items */}
                  {navItems.map((item, index) => (
                    <div 
                      key={item.name} 
                      className={cn(
                        "mb-2 transition-all duration-300",
                        menuItemsVisible 
                          ? "opacity-100 translate-x-0" 
                          : "opacity-0 -translate-x-4"
                      )}
                      style={{ transitionDelay: `${100 + index * 50}ms` }}
                    >
                      <Link href={item.href}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left font-medium transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setIsMobileMenuOpen(false);
                            }
                          }}
                        >
                          {item.name}
                        </Button>
                      </Link>
                      {item.hasDropdown && (
                        <div className="ml-4 mt-1 flex flex-col gap-1">
                          {item.dropdownItems?.map((dropdownItem, subIndex) => (
                            <Link key={dropdownItem.href} href={dropdownItem.href}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "w-full justify-start text-left text-sm text-muted-foreground hover:text-foreground transition-all duration-300",
                                  menuItemsVisible 
                                    ? "opacity-100 translate-x-0" 
                                    : "opacity-0 -translate-x-4"
                                )}
                                style={{ transitionDelay: `${150 + index * 50 + subIndex * 30}ms` }}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {dropdownItem.name}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </nav>
              
              {/* Fixed Footer */}
              <div 
                className={cn(
                  "px-6 py-4 border-t bg-background transition-all duration-300",
                  menuItemsVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: "300ms" }}
              >
                <Button
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-transform hover:scale-[1.02]"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsContactDialogOpen(true);
                  }}
                >
                  {desktopCta}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Contact Dialog */}
      <ContactDialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen} />
    </header>
  );
}
