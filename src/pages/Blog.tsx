import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogHero from "@/components/blog/page/BlogHero";
import FeaturedPost from "@/components/blog/page/FeaturedPost";
import BlogGrid from "@/components/blog/page/BlogGrid";
import NewsletterSection from "@/components/blog/page/NewsletterSection";
import { BlogPost } from "@/types/blog";

// Mock data - keep the same structure as before
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "How AI is Revolutionizing Content Creation in 2025",
    excerpt: "Discover the latest AI advancements that are transforming how bloggers create and optimize content for search engines.",
    category: "AI Technology",
    author: "Alex Morgan",
    date: "May 15, 2025",
    readTime: "8 min read",
    image: "/placeholder.svg",
    featured: true,
    tags: ["AI Writing", "Content Strategy", "SEO"]
  },
  {
    id: 2,
    title: "10 SEO Tactics That Actually Work With AI-Generated Content",
    excerpt: "Learn the proven SEO strategies that work specifically with AI-written content to boost your search rankings.",
    category: "SEO",
    author: "Jamie Patel",
    date: "May 10, 2025",
    readTime: "6 min read",
    image: "/placeholder.svg",
    featured: false,
    tags: ["SEO", "Content Strategy"]
  },
  {
    id: 3,
    title: "The Ethical Considerations of AI in Content Marketing",
    excerpt: "We explore the important ethical questions around using AI to create content and how to navigate them responsibly.",
    category: "Content Ethics",
    author: "Jordan Lee",
    date: "May 5, 2025",
    readTime: "10 min read",
    image: "/placeholder.svg",
    featured: false,
    tags: ["Ethics", "AI Writing"]
  },
  {
    id: 4,
    title: "Case Study: How Company X Increased Traffic by 300% with AI Content",
    excerpt: "A detailed breakdown of how a mid-sized business used AI content tools to dramatically improve their organic search visibility.",
    category: "Case Study",
    author: "Casey Rivera",
    date: "April 28, 2025",
    readTime: "12 min read",
    image: "/placeholder.svg",
    featured: false,
    tags: ["Case Study", "Content Strategy", "Success Story"]
  },
  {
    id: 5,
    title: "Comparing Human vs. AI-Written Content: The 2025 Analysis",
    excerpt: "We put AI-generated content head-to-head with human writers to see how they compare in quality, SEO performance, and reader engagement.",
    category: "Content Analysis",
    author: "Taylor Kim",
    date: "April 20, 2025",
    readTime: "9 min read",
    image: "/placeholder.svg",
    featured: false,
    tags: ["AI Writing", "Content Quality"]
  },
  {
    id: 6,
    title: "The Ultimate Guide to Optimizing AI-Generated Content",
    excerpt: "Learn our proven system for taking AI content from good to great with the right editing and optimization techniques.",
    category: "Content Optimization",
    author: "Sam Chen",
    date: "April 15, 2025",
    readTime: "11 min read",
    image: "/placeholder.svg",
    featured: false,
    tags: ["AI Writing", "Content Strategy", "Optimization"]
  }
];

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
