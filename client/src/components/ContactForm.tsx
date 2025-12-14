import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface ContactFormProps {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
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
    onSuccess?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="dialog-name" className="block text-sm font-medium mb-2 text-foreground">
            {isEnglish ? "Name *" : "Name *"}
          </label>
          <Input
            id="dialog-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder={isEnglish ? "Your name" : "Ihr Name"}
            className="bg-background"
          />
        </div>
        <div>
          <label htmlFor="dialog-email" className="block text-sm font-medium mb-2 text-foreground">
            E-mail *
          </label>
          <Input
            id="dialog-email"
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
          <label htmlFor="dialog-company" className="block text-sm font-medium mb-2 text-foreground">
            {isEnglish ? "Company" : "Unternehmen"}
          </label>
          <Input
            id="dialog-company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder={isEnglish ? "Your company" : "Ihr Unternehmen"}
            className="bg-background"
          />
        </div>
        <div>
          <label htmlFor="dialog-phone" className="block text-sm font-medium mb-2 text-foreground">
            {isEnglish ? "Phone" : "Telefon"}
          </label>
          <Input
            id="dialog-phone"
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
        <label htmlFor="dialog-subject" className="block text-sm font-medium mb-2 text-foreground">
          {isEnglish ? "Subject *" : "Betreff *"}
        </label>
        <Input
          id="dialog-subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          placeholder={isEnglish ? "What is it about?" : "Worum geht es?"}
          className="bg-background"
        />
      </div>

      <div>
        <label htmlFor="dialog-message" className="block text-sm font-medium mb-2 text-foreground">
          {isEnglish ? "Message *" : "Nachricht *"}
        </label>
        <Textarea
          id="dialog-message"
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
  );
}
