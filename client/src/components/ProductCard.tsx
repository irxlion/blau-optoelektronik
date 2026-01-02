import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
}

export default function ProductCard({ title, description, image, href }: ProductCardProps) {
  const { language } = useLanguage();
  const isEnglish = language === "en";

  return (
    <Link href={href} className="block">
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 cursor-pointer h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={image}
            alt={`${title} - BLAU Optoelektronik`}
            loading="lazy"
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-card-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm mb-4 line-clamp-2 flex-1">
            {description}
          </p>
          <div className="mt-auto">
            <Button variant="ghost" className="group/btn p-0 h-auto font-medium text-primary hover:bg-transparent min-h-[44px]">
              {isEnglish ? "Learn more" : "Mehr erfahren"}
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
