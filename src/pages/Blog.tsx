import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogHero from "@/components/blog/page/BlogHero";
import FeaturedPost from "@/components/blog/page/FeaturedPost";
import BlogGrid from "@/components/blog/page/BlogGrid";
import NewsletterSection from "@/components/blog/page/NewsletterSection";
import { useLanguage } from "@/context/language/LanguageContext";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { TranslationRequestDialog } from "@/components/blog/translation/TranslationRequestDialog";
import { TranslationStatusBadge } from "@/components/blog/translation/TranslationStatus";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const { currentLanguage } = useLanguage();
  const { posts, isLoading } = useBlogPosts();
  
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

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Blog | Insight Writer AI</title>
        <meta 
          name="description" 
          content="Explore the latest insights, tips, and strategies for AI-powered content creation, SEO optimization, and blogging success." 
        />
        <meta name="language" content={currentLanguage} />
        <link rel="alternate" hrefLang="en" href="https://insightwriter.ai/blog" />
        <link rel="alternate" hrefLang="es" href="https://insightwriter.ai/es/blog" />
        <link rel="alternate" hrefLang="fr" href="https://insightwriter.ai/fr/blog" />
        <link rel="alternate" hrefLang="de" href="https://insightwriter.ai/de/blog" />
        <link rel="alternate" hrefLang="zh" href="https://insightwriter.ai/zh/blog" />
        <link rel="alternate" hrefLang="x-default" href="https://insightwriter.ai/blog" />
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
        
        {showTranslationControls && (
          <div className="container-wide py-4">
            <div className="flex justify-end space-x-4">
              <TranslationRequestDialog 
                blogId={featuredPost?.id || ''} 
                currentLanguage={currentLanguage}
              />
            </div>
          </div>
        )}
        
        {featuredPost && searchQuery === "" && selectedCategory === "All Categories" && (
          <FeaturedPost post={featuredPost} />
        )}
        
        <BlogGrid posts={filteredPosts} onLoadMore={handleLoadMore} />
        
        <NewsletterSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
