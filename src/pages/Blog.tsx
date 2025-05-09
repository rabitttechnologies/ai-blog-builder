
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogHero from "@/components/blog/page/BlogHero";
import FeaturedPost from "@/components/blog/page/FeaturedPost";
import BlogGrid from "@/components/blog/page/BlogGrid";
import NewsletterSection from "@/components/blog/page/NewsletterSection";
import { useLanguage } from "@/context/language/LanguageContext";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Toaster } from "@/components/ui/toaster";
import { useLocalizedUrl } from "@/hooks/useLocalizedUrl";
import { supabase } from "@/integrations/supabase/client";
import { TranslationWorkflow } from "@/types/blog";
import { TranslationManager } from '@/components/blog/translation/TranslationManager';
import { generateHrefLangTags, updateLanguageMeta } from "@/utils/languageUtils";

const seoMetadata = {
  en: {
    title: "Blog | Insight Writer AI",
    description: "Explore the latest insights, tips, and strategies for AI-powered content creation, SEO optimization, and blogging success.",
  },
  es: {
    title: "Blog | Insight Writer AI",
    description: "Explora las últimas ideas, consejos y estrategias para la creación de contenido con IA, optimización SEO y éxito en blogging.",
  },
  fr: {
    title: "Blog | Insight Writer AI",
    description: "Découvrez les dernières perspectives, conseils et stratégies pour la création de contenu IA, l'optimisation SEO et le succès en blogging.",
  },
  de: {
    title: "Blog | Insight Writer AI",
    description: "Entdecken Sie die neuesten Einblicke, Tipps und Strategien für KI-gestützte Content-Erstellung, SEO-Optimierung und Blogging-Erfolg.",
  },
  zh: {
    title: "博客 | Insight Writer AI",
    description: "探索AI驱动的内容创作、SEO优化和博客成功的最新见解、技巧和策略。",
  }
};

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const { currentLanguage } = useLanguage();
  const { posts, isLoading } = useBlogPosts();
  const { updateUrlLanguage } = useLocalizedUrl();
  
  const featuredPost = posts?.find(post => 
    post.is_original && 
    (post.categories?.includes('featured') || post.category === 'featured')
  );
  
  const regularPosts = posts?.filter(post => 
    !(post.categories?.includes('featured') || post.category === 'featured')
  );
  
  const filteredPosts = regularPosts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesCategory = selectedCategory === "All Categories" || 
                          (post.categories?.includes(selectedCategory) || post.category === selectedCategory);
    
    return matchesSearch && matchesCategory;
  }) || [];

  const handleLoadMore = () => {
    // Implement load more logic here
    console.log("Load more clicked");
  };

  const showTranslationControls = currentLanguage === 'en' && posts?.some(post => post.is_original);

  const currentMetadata = seoMetadata[currentLanguage as keyof typeof seoMetadata] || seoMetadata.en;

  // Add translation progress tracking
  const [translationProgress, setTranslationProgress] = useState<Record<string, number>>({});

  // Update language meta tags when language changes
  useEffect(() => {
    updateLanguageMeta(currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    if (posts?.some(post => post.is_original)) {
      const channel = supabase
        .channel('translation-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'translation_workflows'
          },
          (payload) => {
            if (payload.new) {
              const workflow = payload.new as TranslationWorkflow;
              const progress = (workflow.completed_languages.length / workflow.requested_languages.length) * 100;
              setTranslationProgress(prev => ({
                ...prev,
                [workflow.blog_id]: progress
              }));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [posts]);

  // Fetch initial translation progress data
  useEffect(() => {
    const fetchTranslationProgress = async () => {
      if (!posts?.some(post => post.is_original)) return;
      
      const blogIds = posts
        .filter(post => post.is_original)
        .map(post => post.id);
        
      if (blogIds.length === 0) return;
      
      const { data, error } = await supabase
        .from('translation_workflows')
        .select('*')
        .in('blog_id', blogIds);
        
      if (error) {
        console.error('Error fetching translation progress:', error);
        return;
      }
      
      const progressMap: Record<string, number> = {};
      
      data.forEach(workflow => {
        progressMap[workflow.blog_id] = (workflow.completed_languages.length / workflow.requested_languages.length) * 100;
      });
      
      setTranslationProgress(progressMap);
    };
    
    fetchTranslationProgress();
  }, [posts]);

  // Generate base URL for hreflang tags
  const baseUrl = 'https://insightwriter.ai';

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{currentMetadata.title}</title>
        <meta name="description" content={currentMetadata.description} />
        <meta name="language" content={currentLanguage} />
        
        {/* Generate hreflang tags for SEO */}
        {generateHrefLangTags(baseUrl, '/blog').map(({ hrefLang, href }) => (
          <link 
            key={hrefLang}
            rel="alternate" 
            hrefLang={hrefLang} 
            href={href} 
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://insightwriter.ai/blog" />
        
        {/* Open Graph tags for better social sharing */}
        <meta property="og:title" content={currentMetadata.title} />
        <meta property="og:description" content={currentMetadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={currentLanguage} />
        <meta property="og:url" content={`${baseUrl}${currentLanguage === 'en' ? '' : `/${currentLanguage}`}/blog`} />
        
        {/* Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={currentMetadata.title} />
        <meta name="twitter:description" content={currentMetadata.description} />
      </Helmet>
      
      <Header />
      
      <main className="flex-1">
        <BlogHero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          language={currentLanguage}
        />
        
        {showTranslationControls && featuredPost && (
          <div className="container-wide py-4">
            <TranslationManager 
              blogId={featuredPost.id || ''} 
              currentLanguage={currentLanguage}
              onProgressUpdate={(progress) => 
                setTranslationProgress(prev => ({
                  ...prev,
                  [featuredPost.id || '']: progress
                }))
              }
              translationProgress={translationProgress[featuredPost.id]}
            />
          </div>
        )}
        
        {featuredPost && searchQuery === "" && selectedCategory === "All Categories" && (
          <FeaturedPost 
            post={featuredPost} 
            translationProgress={translationProgress[featuredPost.id]}
          />
        )}
        
        <BlogGrid 
          posts={filteredPosts} 
          onLoadMore={handleLoadMore} 
          translationProgress={translationProgress}
        />
        
        <NewsletterSection />
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default Blog;
