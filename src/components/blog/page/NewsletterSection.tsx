
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/language/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

const newsletterContent = {
  en: {
    title: "Get the Latest Content Tips",
    description: "Subscribe to our newsletter for weekly insights on AI content creation, SEO, and more.",
    placeholder: "Enter your email",
    buttonText: "Subscribe"
  },
  es: {
    title: "Recibe los Últimos Consejos de Contenido",
    description: "Suscríbete a nuestro boletín para recibir información semanal sobre creación de contenido con IA, SEO y más.",
    placeholder: "Introduce tu correo electrónico",
    buttonText: "Suscribirse"
  },
  fr: {
    title: "Obtenez les Derniers Conseils de Contenu",
    description: "Abonnez-vous à notre newsletter pour des informations hebdomadaires sur la création de contenu IA, le SEO et plus encore.",
    placeholder: "Entrez votre email",
    buttonText: "S'abonner"
  },
  de: {
    title: "Erhalten Sie die neuesten Content-Tipps",
    description: "Abonnieren Sie unseren Newsletter für wöchentliche Einblicke zu KI-Inhaltserstellung, SEO und mehr.",
    placeholder: "Geben Sie Ihre E-Mail-Adresse ein",
    buttonText: "Abonnieren"
  },
  zh: {
    title: "获取最新内容提示",
    description: "订阅我们的通讯，每周获取关于AI内容创作、SEO等方面的见解。",
    placeholder: "输入您的电子邮箱",
    buttonText: "订阅"
  }
};

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const { currentLanguage } = useLanguage();
  const { translatedContent: content } = useTranslation(newsletterContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic would go here
    setEmail('');
  };

  return (
    <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <div className="container-wide text-center">
        <h2 className="text-3xl font-bold mb-4">
          {content?.title || "Get the Latest Content Tips"}
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          {content?.description || "Subscribe to our newsletter for weekly insights on AI content creation, SEO, and more."}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input 
            type="email" 
            placeholder={content?.placeholder || "Enter your email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/20 text-white placeholder:text-white/60 border-white/30 focus-visible:ring-white"
          />
          <Button className="bg-white text-blue-600 hover:bg-white/90" type="submit">
            {content?.buttonText || "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
