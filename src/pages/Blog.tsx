
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogHero from "@/components/blog/page/BlogHero";
import FeaturedPost from "@/components/blog/page/FeaturedPost";
import BlogGrid from "@/components/blog/page/BlogGrid";
import NewsletterSection from "@/components/blog/page/NewsletterSection";
import { blogPosts } from "@/data/blogPosts";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);
  
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
      </Helmet>
      
      <Header />
      
      <main className="flex-1">
        <BlogHero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
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

