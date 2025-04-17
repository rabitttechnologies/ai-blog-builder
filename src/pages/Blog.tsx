
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogHero from "@/components/blog/page/BlogHero";
import FeaturedPost from "@/components/blog/page/FeaturedPost";
import BlogGrid from "@/components/blog/page/BlogGrid";
import NewsletterSection from "@/components/blog/page/NewsletterSection";
import { blogPosts, getTranslatedBlogPosts } from "@/data/blogPosts";
import { useLanguage } from "@/context/language/LanguageContext";
import { formatLocalizedDate } from "@/utils/languageUtils";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const { currentLanguage } = useLanguage();
  const [translatedPosts, setTranslatedPosts] = useState(blogPosts);
  
  // Update posts when language changes
  useEffect(() => {
    setTranslatedPosts(getTranslatedBlogPosts(currentLanguage));
  }, [currentLanguage]);
  
  const featuredPost = translatedPosts.find(post => post.featured);
  const regularPosts = translatedPosts.filter(post => !post.featured);
  
  const filteredPosts = regularPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleLoadMore = () => {
    // Load more posts logic would go here
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Blog | Insight Writer AI</title>
        <meta 
          name="description" 
          content="Explore the latest insights, tips, and strategies for AI-powered content creation, SEO optimization, and blogging success." 
        />
        <meta name="language" content={currentLanguage} />
        {/* Add hrefLang tags for SEO */}
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
