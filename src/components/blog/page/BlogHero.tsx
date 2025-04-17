
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSelector } from '@/components/common/LanguageSelector';

interface BlogHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  language?: string;
}

const categoriesTranslations = {
  en: {
    "All Categories": "All Categories",
    "AI Technology": "AI Technology",
    "SEO": "SEO",
    "Content Strategy": "Content Strategy",
    "Case Studies": "Case Studies",
    "Content Ethics": "Content Ethics",
    "Tutorials": "Tutorials",
    "Content Analysis": "Content Analysis",
    "Content Optimization": "Content Optimization"
  },
  es: {
    "All Categories": "Todas las Categorías",
    "AI Technology": "Tecnología de IA",
    "SEO": "SEO",
    "Content Strategy": "Estrategia de Contenido",
    "Case Studies": "Casos de Estudio",
    "Content Ethics": "Ética de Contenido",
    "Tutorials": "Tutoriales",
    "Content Analysis": "Análisis de Contenido",
    "Content Optimization": "Optimización de Contenido"
  },
  fr: {
    "All Categories": "Toutes les Catégories",
    "AI Technology": "Technologie IA",
    "SEO": "SEO",
    "Content Strategy": "Stratégie de Contenu",
    "Case Studies": "Études de Cas",
    "Content Ethics": "Éthique du Contenu",
    "Tutorials": "Tutoriels",
    "Content Analysis": "Analyse de Contenu",
    "Content Optimization": "Optimisation de Contenu"
  },
  de: {
    "All Categories": "Alle Kategorien",
    "AI Technology": "KI-Technologie",
    "SEO": "SEO",
    "Content Strategy": "Content-Strategie",
    "Case Studies": "Fallstudien",
    "Content Ethics": "Inhaltsethik",
    "Tutorials": "Tutorials",
    "Content Analysis": "Inhaltsanalyse",
    "Content Optimization": "Inhaltsoptimierung"
  },
  zh: {
    "All Categories": "所有类别",
    "AI Technology": "人工智能技术",
    "SEO": "搜索引擎优化",
    "Content Strategy": "内容策略",
    "Case Studies": "案例研究",
    "Content Ethics": "内容伦理",
    "Tutorials": "教程",
    "Content Analysis": "内容分析",
    "Content Optimization": "内容优化"
  }
};

const heroContent = {
  en: {
    title: "Insights & Resources",
    description: "The latest strategies, guides, and insights on AI content creation and SEO optimization.",
    searchPlaceholder: "Search articles..."
  },
  es: {
    title: "Perspectivas y Recursos",
    description: "Las últimas estrategias, guías y perspectivas sobre la creación de contenido con IA y la optimización SEO.",
    searchPlaceholder: "Buscar artículos..."
  },
  fr: {
    title: "Perspectives et Ressources",
    description: "Les dernières stratégies, guides et idées sur la création de contenu IA et l'optimisation SEO.",
    searchPlaceholder: "Rechercher des articles..."
  },
  de: {
    title: "Erkenntnisse & Ressourcen",
    description: "Die neuesten Strategien, Leitfäden und Einblicke zur KI-Inhaltserstellung und SEO-Optimierung.",
    searchPlaceholder: "Artikel suchen..."
  },
  zh: {
    title: "洞察与资源",
    description: "关于AI内容创作和SEO优化的最新策略、指南和见解。",
    searchPlaceholder: "搜索文章..."
  }
};

const defaultCategories = [
  "All Categories",
  "AI Technology",
  "SEO",
  "Content Strategy",
  "Case Studies",
  "Content Ethics",
  "Tutorials",
  "Content Analysis",
  "Content Optimization"
];

const BlogHero: React.FC<BlogHeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  language = 'en'
}) => {
  const { translatedContent: content } = useTranslation(heroContent);
  
  // Get translated category names
  const getTranslatedCategory = (category: string) => {
    return categoriesTranslations[language as keyof typeof categoriesTranslations]?.[category] || category;
  };

  // Get all categories in the current language
  const categories = defaultCategories.map(category => ({
    original: category,
    translated: getTranslatedCategory(category)
  }));

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container-wide">
        <div className="flex justify-end mb-4">
          <LanguageSelector showLabel={true} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          {content?.title || "Insights & Resources"}
        </h1>
        
        <p className="text-xl text-foreground/70 max-w-3xl mx-auto text-center mb-10">
          {content?.description || "The latest strategies, guides, and insights on AI content creation and SEO optimization."}
        </p>
        
        <div className="max-w-3xl mx-auto">
          <div className="relative mb-8">
            <Search className="absolute left-3 top-3 text-foreground/40" />
            <Input
              type="text"
              placeholder={content?.searchPlaceholder || "Search articles..."}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.original}
                onClick={() => onCategoryChange(category.original)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.original
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-foreground/70 hover:bg-gray-200"
                }`}
              >
                {category.translated}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
