
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Tag, Calendar, Clock } from "lucide-react";

const blogPosts = [
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

const categories = [
  "All Categories",
  "AI Technology",
  "SEO",
  "Content Strategy",
  "Case Studies",
  "Content Ethics",
  "Tutorials"
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

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Blog | Insight Writer AI</title>
        <meta name="description" content="Explore the latest insights, tips, and strategies for AI-powered content creation, SEO optimization, and blogging success." />
      </Helmet>
      
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="container-wide">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              Insights & Resources
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto text-center mb-10">
              The latest strategies, guides, and insights on AI content creation and SEO optimization.
            </p>
            
            {/* Search and filter */}
            <div className="max-w-3xl mx-auto">
              <div className="relative mb-8">
                <Search className="absolute left-3 top-3 text-foreground/40" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-foreground/70 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Post */}
        {featuredPost && searchQuery === "" && selectedCategory === "All Categories" && (
          <section className="py-12">
            <div className="container-wide">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 glass p-6 rounded-xl">
                <div className="lg:col-span-3 order-2 lg:order-1">
                  <div className="badge badge-primary mb-4">Featured</div>
                  <h2 className="text-3xl font-bold mb-4">
                    <a href={`/blog/${featuredPost.id}`} className="hover:text-primary transition-colors">
                      {featuredPost.title}
                    </a>
                  </h2>
                  <p className="text-foreground/70 text-lg mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-4 items-center mb-6">
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                      <Calendar className="h-4 w-4" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                      <Clock className="h-4 w-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                      <Tag className="h-4 w-4" />
                      <span>{featuredPost.category}</span>
                    </div>
                  </div>
                  <Button asChild>
                    <a href={`/blog/${featuredPost.id}`}>
                      Read Article <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
                <div className="lg:col-span-2 order-1 lg:order-2">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Articles Grid */}
        <section className="py-12">
          <div className="container-wide">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="glass rounded-xl overflow-hidden transition-all hover:shadow-md">
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-primary rounded-full">
                        {post.category}
                      </span>
                      <span className="text-sm text-foreground/60 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">
                      <a href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </a>
                    </h3>
                    <p className="text-foreground/70 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground/60">
                        {post.date} • {post.author}
                      </span>
                      <a 
                        href={`/blog/${post.id}`} 
                        className="text-primary font-medium text-sm flex items-center hover:text-primary/80 transition-colors"
                      >
                        Read more <ArrowRight className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-4">No articles found</h3>
                <p className="text-foreground/70 mb-6">Try adjusting your search or filter criteria</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Categories");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
            
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>
          </div>
        </section>
        
        {/* Newsletter */}
        <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="container-wide text-center">
            <h2 className="text-3xl font-bold mb-4">Get the Latest Content Tips</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Subscribe to our newsletter for weekly insights on AI content creation, SEO, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/20 text-white placeholder:text-white/60 border-white/30 focus-visible:ring-white"
              />
              <Button className="bg-white text-blue-600 hover:bg-white/90">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
