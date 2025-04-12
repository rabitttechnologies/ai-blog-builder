
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Bookmark, FileText, Search, Clock, BookOpen } from "lucide-react";

const guides = [
  {
    id: 1,
    title: "Getting Started with Insight Writer AI",
    description: "Learn the basics of the platform and how to create your first AI-generated article.",
    category: "Beginner",
    readTime: "10 min read",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Advanced Keyword Research Techniques",
    description: "Go beyond basic keyword research and discover untapped opportunities for your content.",
    category: "Intermediate",
    readTime: "15 min read",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Mastering SEO Content Optimization",
    description: "Learn how to optimize your AI-generated content for maximum search engine visibility.",
    category: "Advanced",
    readTime: "20 min read",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    title: "Creating Engaging Blog Post Introductions",
    description: "Techniques for writing captivating introductions that keep readers engaged.",
    category: "Intermediate",
    readTime: "12 min read",
    image: "/placeholder.svg",
  },
  {
    id: 5,
    title: "Using AI for Content Repurposing",
    description: "Turn one piece of content into multiple formats with our AI tools.",
    category: "Intermediate",
    readTime: "14 min read",
    image: "/placeholder.svg",
  },
  {
    id: 6,
    title: "Building a Content Calendar with AI",
    description: "Streamline your content planning process using our AI-powered calendar tools.",
    category: "Beginner",
    readTime: "8 min read",
    image: "/placeholder.svg",
  },
  {
    id: 7,
    title: "AI Content and E-E-A-T: Best Practices",
    description: "How to ensure your AI content meets Google's Experience, Expertise, Authoritativeness, and Trustworthiness standards.",
    category: "Advanced",
    readTime: "25 min read",
    image: "/placeholder.svg",
  },
  {
    id: 8,
    title: "Technical SEO for Content Creators",
    description: "Essential technical SEO knowledge every content creator should understand.",
    category: "Advanced",
    readTime: "18 min read",
    image: "/placeholder.svg",
  },
  {
    id: 9,
    title: "Measuring Content Performance",
    description: "Learn how to track and analyze the performance of your AI-generated content.",
    category: "Intermediate",
    readTime: "16 min read",
    image: "/placeholder.svg",
  }
];

const categories = ["All", "Beginner", "Intermediate", "Advanced"];

const Guides = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();
  
  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || guide.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Guides & Tutorials | Insight Writer AI</title>
        <meta name="description" content="Comprehensive guides and tutorials to help you master AI content creation and SEO optimization with Insight Writer AI." />
      </Helmet>
      
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Guides & Tutorials
              </h1>
              <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
                Master AI content creation with our comprehensive guides and step-by-step tutorials
              </p>
            </div>
            
            {/* Search and filter */}
            <div className="max-w-3xl mx-auto">
              <div className="relative mb-8">
                <Search className="absolute left-3 top-3 text-foreground/40" />
                <Input
                  type="text"
                  placeholder="Search guides..."
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
        
        {/* Featured Resources */}
        <section className="py-12">
          <div className="container-wide">
            <h2 className="text-2xl font-bold mb-8">Featured Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass rounded-xl overflow-hidden border border-blue-100">
                <div className="aspect-video bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white">
                  <BookOpen className="h-12 w-12 opacity-75" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Content Creator's Handbook</h3>
                  <p className="text-foreground/70 mb-4">
                    Your comprehensive guide to creating high-quality content that ranks and converts.
                  </p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/guides/handbook")}>
                    Download PDF <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="glass rounded-xl overflow-hidden border border-purple-100">
                <div className="aspect-video bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white">
                  <FileText className="h-12 w-12 opacity-75" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">2025 SEO Checklist</h3>
                  <p className="text-foreground/70 mb-4">
                    The ultimate checklist to ensure your content meets the latest SEO requirements.
                  </p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/guides/seo-checklist")}>
                    Download PDF <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="glass rounded-xl overflow-hidden border border-green-100">
                <div className="aspect-video bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white">
                  <Bookmark className="h-12 w-12 opacity-75" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">AI Writing Templates</h3>
                  <p className="text-foreground/70 mb-4">
                    A collection of ready-to-use templates for different types of content.
                  </p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/guides/templates")}>
                    Browse Templates <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Guides Grid */}
        <section className="py-12">
          <div className="container-wide">
            <h2 className="text-2xl font-bold mb-8">Guides & Tutorials</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGuides.map((guide) => (
                <article key={guide.id} className="glass rounded-xl overflow-hidden transition-all hover:shadow-md">
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={guide.image}
                      alt={guide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full
                        ${guide.category === 'Beginner' ? 'bg-green-100 text-green-700' : 
                          guide.category === 'Intermediate' ? 'bg-blue-100 text-blue-700' : 
                          'bg-purple-100 text-purple-700'}`}
                      >
                        {guide.category}
                      </span>
                      <span className="text-sm text-foreground/60 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {guide.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">
                      <a href={`/guides/${guide.id}`} className="hover:text-primary transition-colors">
                        {guide.title}
                      </a>
                    </h3>
                    <p className="text-foreground/70 mb-4">
                      {guide.description}
                    </p>
                    <a 
                      href={`/guides/${guide.id}`} 
                      className="text-primary font-medium flex items-center hover:text-primary/80 transition-colors"
                    >
                      Read Guide <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
            
            {filteredGuides.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-4">No guides found</h3>
                <p className="text-foreground/70 mb-6">Try adjusting your search or filter criteria</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Video Tutorials */}
        <section className="py-12 bg-gradient-to-b from-white to-blue-50">
          <div className="container-wide">
            <h2 className="text-2xl font-bold mb-8">Video Tutorials</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  id: 1,
                  title: "Getting Started with Insight Writer AI",
                  duration: "12:34",
                },
                {
                  id: 2,
                  title: "Creating Your First AI Article",
                  duration: "15:21",
                },
                {
                  id: 3,
                  title: "Advanced SEO Settings Tutorial",
                  duration: "18:45",
                }
              ].map((video) => (
                <div key={video.id} className="glass rounded-xl overflow-hidden">
                  <div className="aspect-video bg-gray-800 relative flex items-center justify-center">
                    <img
                      src="/placeholder.svg"
                      alt={video.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center pl-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold">{video.title}</h3>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button variant="outline" onClick={() => navigate("/tutorials/videos")}>
                View All Video Tutorials <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        
        {/* Webinars */}
        <section className="py-12">
          <div className="container-wide">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Upcoming Webinars</h2>
              <a href="/webinars" className="text-primary font-medium flex items-center hover:text-primary/80 transition-colors">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  id: 1,
                  title: "AI-Powered Content Strategy for 2025",
                  date: "June 15, 2025",
                  time: "11:00 AM ET",
                  host: "Alex Morgan",
                  description: "Learn how to build a comprehensive content strategy that leverages AI tools for maximum efficiency and results."
                },
                {
                  id: 2,
                  title: "Mastering E-E-A-T with AI Content",
                  date: "June 22, 2025",
                  time: "2:00 PM ET",
                  host: "Sam Chen",
                  description: "Discover strategies to ensure your AI-generated content meets Google's Experience, Expertise, Authoritativeness, and Trustworthiness standards."
                }
              ].map((webinar) => (
                <div key={webinar.id} className="glass p-6 rounded-xl border border-blue-100">
                  <div className="mb-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Webinar</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{webinar.title}</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-sm">
                      <div className="font-medium">{webinar.date}</div>
                      <div className="text-foreground/60">{webinar.time}</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">Host</div>
                      <div className="text-foreground/60">{webinar.host}</div>
                    </div>
                  </div>
                  <p className="text-foreground/70 mb-4">{webinar.description}</p>
                  <Button size="sm" onClick={() => navigate(`/webinars/${webinar.id}`)}>
                    Register Now
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Help Center */}
        <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="container-wide text-center">
            <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Visit our help center for frequently asked questions, troubleshooting tips, and direct support.
            </p>
            <Button className="bg-white text-blue-600 hover:bg-white/90" size="lg" onClick={() => navigate("/help-center")}>
              Visit Help Center
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Guides;
