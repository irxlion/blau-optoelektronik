/**
 * Moderner Header mit Full-Width Hero-Header und überlagerter Navigation
 * - Weiße, abgerundete Top-Navigation mit leichtem Shadow
 * - Orange als Akzentfarbe für aktive Elemente und CTA
 * - Dropdowns mit Sub-Dropdown für Machine Vision Lasermodule
 * - Responsive für Desktop, Tablet und Mobile
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, ShoppingCart, ChevronRight } from "lucide-react";
import { APP_LOGO_HEADER } from "@/const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ContactDialog } from "@/components/ContactDialog";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/data/products";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { language, setLanguage } = useLanguage();
  const { getTotalItems } = useCart();
  const isEnglish = language === "en";
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [menuItemsVisible, setMenuItemsVisible] = useState(false);
  const cartItemCount = getTotalItems();
  const [productsData, setProductsData] = useState<{ de: Product[]; en: Product[] } | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

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
      if (subDropdownTimeoutRef.current) {
        clearTimeout(subDropdownTimeoutRef.current);
      }
    };
  }, []);

  // Animation für Menü-Items beim Öffnen
  useEffect(() => {
    if (isMobileMenuOpen) {
      const timer = setTimeout(() => {
        setMenuItemsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setMenuItemsVisible(false);
    }
  }, [isMobileMenuOpen]);

  // Produkte aus der Datenbank laden
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        const data = await fetchProducts();
        setProductsData(data);
      } catch (error) {
        console.error("Fehler beim Laden der Produkte für Header:", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  // Produkt-Kategorien mit Sub-Dropdown
  type DropdownItem = {
    name: string;
    href: string;
    hasSubDropdown?: boolean;
    subDropdownItems?: Array<{
      name: string;
      href: string;
      description?: string;
    }>;
  };

  // Kategorien und Produkte aus der Datenbank extrahieren
  const productCategories: DropdownItem[] = useMemo(() => {
    if (!productsData || loadingProducts) {
      // Fallback zu statischen Kategorien während des Ladens
      return isEnglish
        ? [
            { name: "Machine Vision Laser Modules", href: "/produkte/machine-vision" },
            { name: "Line Lasers", href: "/produkte/linienlaser" },
            { name: "Point Lasers", href: "/produkte/punktlaser" },
            { name: "Powell Lenses", href: "/produkte/powelllinsen" },
            { name: "OEM Modules", href: "/produkte/oem-module" },
          ]
        : [
            { name: "Machine Vision Lasermodule", href: "/produkte/machine-vision" },
            { name: "Linienlaser", href: "/produkte/linienlaser" },
            { name: "Punktlaser", href: "/produkte/punktlaser" },
            { name: "Powelllinsen", href: "/produkte/powelllinsen" },
            { name: "OEM Module", href: "/produkte/oem-module" },
          ];
    }

    const currentProducts = productsData[language];
    
    // Kategorien aus Produkten extrahieren
    const categories = Array.from(new Set(currentProducts.map((p) => p.category))).sort();
    
    // Kategorien mit ihren Produkten erstellen
    return categories.map((category) => {
      const categoryProducts = currentProducts.filter((p) => p.category === category);
      
      // Produkte für Sub-Dropdown vorbereiten
      const subDropdownItems = categoryProducts.map((product) => ({
        name: product.name,
        href: `/produkte/${product.id}`,
        description: product.description 
          ? (product.description.length > 60 
              ? product.description.substring(0, 60) + "..." 
              : product.description)
          : undefined,
      }));

      return {
        name: category,
        href: `/produkte?category=${encodeURIComponent(category)}`,
        hasSubDropdown: subDropdownItems.length > 0,
        subDropdownItems: subDropdownItems.length > 0 ? subDropdownItems : undefined,
      };
    });
  }, [productsData, language, loadingProducts, isEnglish]);

  const toolsCategories: DropdownItem[] = isEnglish
    ? [
        { name: "Maximum Power Simulation", href: "/tools/maximum-power-simulation" },
        { name: "Line Thickness Simulation", href: "/tools/line-thickness-simulation" },
      ]
    : [
        { name: "Maximale Leistung Simulation", href: "/tools/maximale-leistung-simulation" },
        { name: "Liniendicken Simulation", href: "/tools/liniendickensimulation" },
      ];

  const navItems = isEnglish
    ? [
        { name: "Home", href: "/" },
        { name: "About us", href: "/unternehmen" },
        { name: "Technology", href: "/technologie" },
        { name: "Careers", href: "/karriere" },
        {
          name: "Products",
          href: "/produkte",
          hasDropdown: true,
          dropdownItems: productCategories,
        },
        {
          name: "Tools",
          href: "/tools",
          hasDropdown: true,
          dropdownItems: toolsCategories,
        },
        { name: "Shop", href: "/shop" },
        { name: "Contact", href: "/kontakt" },
      ]
    : [
        { name: "Start", href: "/" },
        { name: "Über uns", href: "/unternehmen" },
        { name: "Technologie", href: "/technologie" },
        { name: "Karriere", href: "/karriere" },
        {
          name: "Produkte",
          href: "/produkte",
          hasDropdown: true,
          dropdownItems: productCategories,
        },
        {
          name: "Tools",
          href: "/tools",
          hasDropdown: true,
          dropdownItems: toolsCategories,
        },
        { name: "Shop", href: "/shop" },
        { name: "Kontakt", href: "/kontakt" },
      ];

  const desktopCta = isEnglish ? "Contact us" : "Kontakt Aufnehmen";
  const mobileNavLabel = isEnglish ? "Mobile navigation" : "Mobile Navigation";
  const mainNavLabel = isEnglish ? "Main navigation" : "Hauptnavigation";

  const isHome = location === "/";
  const showHeroHeader = isHome && !isScrolled;

  // Navigation-Styles basierend auf Seite
  const getNavBarClass = () => {
    if (showHeroHeader) {
      // Auf Homepage: Transparente Navigation über Hero
      return "bg-white/95 backdrop-blur-sm";
    }
    // Auf anderen Seiten: Weiße, abgerundete Navigation mit Shadow
    return "bg-white rounded-b-2xl shadow-md";
  };

  const getNavItemClass = (href: string) => {
    const isActive = location === href;
    if (isActive) {
      return "text-primary font-semibold";
    }
    return "text-foreground hover:text-primary transition-colors";
  };

  const handleDropdownEnter = (itemName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(itemName);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setActiveSubDropdown(null);
    }, 150);
  };

  const handleSubDropdownEnter = (itemName: string) => {
    if (subDropdownTimeoutRef.current) {
      clearTimeout(subDropdownTimeoutRef.current);
      subDropdownTimeoutRef.current = null;
    }
    setActiveSubDropdown(itemName);
  };

  const handleSubDropdownLeave = () => {
    subDropdownTimeoutRef.current = setTimeout(() => {
      setActiveSubDropdown(null);
    }, 150);
  };

  return (
    <>
      <header
        role="banner"
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-300",
          showHeroHeader ? "top-2 md:top-4" : "top-2 md:top-4"
        )}
      >
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <div className={cn("w-full rounded-lg md:rounded-xl", getNavBarClass(), showHeroHeader ? "" : "shadow-md")}>
            <div className="flex items-center justify-between h-14 md:h-16 px-3 sm:px-4 md:px-6">
            {/* Logo */}
            <Link
              href="/"
              onClick={(e) => {
                if (location === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0"
              aria-label={isEnglish ? "Go to homepage" : "Zur Startseite"}
            >
              <img src={APP_LOGO_HEADER} alt="BLAU Optoelektronik Logo" className="h-6 sm:h-7 md:h-8 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav role="navigation" aria-label={mainNavLabel} className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1 justify-center">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => {
                    if (item.hasDropdown) {
                      handleDropdownEnter(item.name);
                    }
                  }}
                  onMouseLeave={() => {
                    if (item.hasDropdown) {
                      handleDropdownLeave();
                    }
                  }}
                >
                  <Link href={item.href}>
                    <button
                      className={cn(
                        "text-xs xl:text-sm font-medium uppercase tracking-wide flex items-center gap-1 whitespace-nowrap",
                        getNavItemClass(item.href)
                      )}
                      aria-expanded={item.hasDropdown && activeDropdown === item.name}
                      aria-haspopup={item.hasDropdown}
                    >
                      {item.name}
                      {item.hasDropdown && (
                        <ChevronDown className="h-3 w-3 xl:h-4 xl:w-4" aria-hidden="true" />
                      )}
                    </button>
                  </Link>

                  {/* Invisible bridge to prevent gap */}
                  {item.hasDropdown && activeDropdown === item.name && (
                    <div className="absolute top-full left-0 w-full h-2" />
                  )}

                  {/* Dropdown Menu */}
                  {item.hasDropdown && activeDropdown === item.name && (
                    <div
                      role="menu"
                      className="absolute top-full left-0 pt-2 w-56 xl:w-64"
                      onMouseEnter={() => handleDropdownEnter(item.name)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div className="bg-card border border-border rounded-lg shadow-lg p-2">
                        <div className="space-y-1">
                          {item.dropdownItems?.map((dropdownItem) => (
                            <div
                              key={dropdownItem.name}
                              className="relative"
                              onMouseEnter={() => {
                                if (dropdownItem.hasSubDropdown) {
                                  handleSubDropdownEnter(dropdownItem.name);
                                }
                              }}
                              onMouseLeave={() => {
                                if (dropdownItem.hasSubDropdown) {
                                  handleSubDropdownLeave();
                                }
                              }}
                            >
                              <Link href={dropdownItem.href}>
                                <div
                                  role="menuitem"
                                  className={cn(
                                    "px-4 py-2 rounded-md text-sm transition-colors cursor-pointer flex items-center justify-between",
                                    location === dropdownItem.href
                                      ? "bg-primary/10 text-primary font-semibold"
                                      : "text-foreground hover:bg-muted hover:text-primary"
                                  )}
                                >
                                  <span>{dropdownItem.name}</span>
                                  {dropdownItem.hasSubDropdown && (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </div>
                              </Link>

                              {/* Sub-Dropdown Menu */}
                              {dropdownItem.hasSubDropdown &&
                                activeSubDropdown === dropdownItem.name && (
                                  <div
                                    role="menu"
                                    className="absolute left-full top-0 ml-2 w-56 xl:w-64"
                                    onMouseEnter={() =>
                                      handleSubDropdownEnter(dropdownItem.name)
                                    }
                                    onMouseLeave={handleSubDropdownLeave}
                                  >
                                    <div className="bg-card border border-border rounded-lg shadow-lg p-2">
                                      <div className="space-y-1">
                                        {dropdownItem.subDropdownItems?.map(
                                          (subItem) => (
                                            <Link
                                              key={subItem.href}
                                              href={subItem.href}
                                            >
                                              <div
                                                role="menuitem"
                                                className={cn(
                                                  "px-4 py-2 rounded-md text-sm transition-colors cursor-pointer",
                                                  location === subItem.href
                                                    ? "bg-primary/10 text-primary font-semibold"
                                                    : "text-foreground hover:bg-muted hover:text-primary"
                                                )}
                                              >
                                                <div className="font-medium">
                                                  {subItem.name}
                                                </div>
                                                {subItem.description && (
                                                  <div className="text-xs text-muted-foreground mt-1">
                                                    {subItem.description}
                                                  </div>
                                                )}
                                              </div>
                                            </Link>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA Button + Cart + Language Switcher */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-4 flex-shrink-0">
              {/* Language Switcher */}
              <div className="flex items-center gap-1 border border-border rounded-lg p-1">
                {SUPPORTED_LANGUAGES.map(({ code, label }) => (
                  <Button
                    key={code}
                    variant={language === code ? "default" : "ghost"}
                    size="sm"
                    className="h-7 px-2 text-xs font-medium"
                    onClick={() => setLanguage(code)}
                    aria-pressed={language === code}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              {/* Warenkorb-Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/shop/cart")}
                className="relative text-foreground hover:text-primary h-9 w-9 xl:h-10 xl:w-10"
                aria-label={isEnglish ? "Shopping cart" : "Warenkorb"}
              >
                <ShoppingCart className="h-4 w-4 xl:h-5 xl:w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-primary text-primary-foreground text-[10px]">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Badge>
                )}
              </Button>
              <Button
                onClick={() => setIsContactDialogOpen(true)}
                className="bg-secondary hover:bg-primary text-secondary-foreground hover:text-primary-foreground rounded-full px-3 xl:px-6 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold uppercase tracking-wide transition-colors whitespace-nowrap"
              >
                {desktopCta}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-foreground focus:outline-none flex-shrink-0"
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
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              )}
            </button>
            </div>
          </div>
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
                    <MobileNavItem
                      key={item.name}
                      item={item}
                      index={index}
                      menuItemsVisible={menuItemsVisible}
                      onClose={() => setIsMobileMenuOpen(false)}
                    />
                  ))}
                </div>
              </nav>

              {/* Fixed Footer */}
              <div
                className={cn(
                  "px-6 py-4 border-t bg-background transition-all duration-300 space-y-2",
                  menuItemsVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: "300ms" }}
              >
                {/* Warenkorb-Button für Mobile */}
                <Button
                  variant="outline"
                  className="w-full relative"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setLocation("/shop/cart");
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isEnglish ? "Shopping Cart" : "Warenkorb"}
                  {cartItemCount > 0 && (
                    <Badge className="ml-2 bg-primary text-primary-foreground">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </Badge>
                  )}
                </Button>
                <Button
                  className="w-full bg-secondary hover:bg-primary text-secondary-foreground hover:text-primary-foreground rounded-full"
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
      </header>

      {/* Contact Dialog */}
      <ContactDialog
        open={isContactDialogOpen}
        onOpenChange={setIsContactDialogOpen}
      />
    </>
  );
}

// Mobile Navigation Item Component
function MobileNavItem({
  item,
  index,
  menuItemsVisible,
  onClose,
}: {
  item: {
    name: string;
    href: string;
    hasDropdown?: boolean;
    dropdownItems?: Array<any>;
  };
  index: number;
  menuItemsVisible: boolean;
  onClose: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "mb-2 transition-all duration-300",
        menuItemsVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-4"
      )}
      style={{ transitionDelay: `${100 + index * 50}ms` }}
    >
      {item.hasDropdown ? (
        <>
                            <button
                              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-left font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span>{item.name}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-180"
              )}
            />
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {item.dropdownItems?.map((dropdownItem) => (
                <div key={dropdownItem.href}>
                  {dropdownItem.hasSubDropdown ? (
                    <MobileSubDropdown
                      item={dropdownItem}
                      onClose={onClose}
                    />
                  ) : (
                    <Link href={dropdownItem.href}>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="w-full justify-start text-left text-sm text-muted-foreground hover:text-primary"
                                          onClick={onClose}
                                        >
                                          {dropdownItem.name}
                                        </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
                          <Link href={item.href}>
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-left font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                              onClick={onClose}
                            >
                              {item.name}
                            </Button>
                          </Link>
      )}
    </div>
  );
}

// Mobile Sub-Dropdown Component
function MobileSubDropdown({
  item,
  onClose,
}: {
  item: {
    name: string;
    href: string;
    hasSubDropdown?: boolean;
    subDropdownItems?: Array<{
      name: string;
      href: string;
      description?: string;
    }>;
  };
  onClose: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <button
        className="w-full flex items-center justify-between px-3 py-2 rounded-md text-left text-sm text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>{item.name}</span>
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform",
            isExpanded && "rotate-90"
          )}
        />
      </button>
      {isExpanded && item.subDropdownItems && (
        <div className="ml-4 mt-1 space-y-1">
          {item.subDropdownItems.map((subItem) => (
            <Link key={subItem.href} href={subItem.href}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left text-xs text-muted-foreground hover:text-primary"
                onClick={onClose}
              >
                {subItem.name}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
