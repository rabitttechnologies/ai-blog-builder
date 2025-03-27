
import React from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { 
  Check, 
  Lightbulb, 
  TrendingUp, 
  Search, 
  Edit3, 
  Layout, 
  FileText, 
  Zap,
  Layers,
  Shield,
  ActivitySquare,
  BookOpen
} from "lucide-react";

const Features = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Features | Insight Writer AI</title>
        <meta name="description" content="Explore the powerful features of Insight Writer AI, the most advanced AI content creation platform for bloggers, marketers, and businesses." />
      </Helmet>
      
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container-wide text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Powerful Features for Every Content Creator
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-10">
              Our AI-powered platform offers everything you need to create high-ranking, engaging content that stands out from the competition.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <a href="/signup">Start Free Trial</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#core-features">Explore Features</a>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Feature highlight */}
        <section className="py-20">
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 mb-6">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  AI-Powered Writing
                </div>
                <h2 className="text-3xl font-bold mb-6">Write Content That Ranks and Converts</h2>
                <p className="text-lg text-foreground/80 mb-6">
                  Our advanced AI understands your target audience, analyzes top-ranking content, and creates articles that meet both user intent and search engine requirements.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "SEO-optimized content based on real search data",
                    "Engaging, natural-sounding writing that readers love",
                    "Customizable tone and style to match your brand voice",
                    "Fact-checked content with accurate information"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild>
                  <a href="/signup">Try the AI Writer</a>
                </Button>
              </div>
              <div className="bg-blue-50 p-8 rounded-2xl">
                <div className="aspect-video rounded-xl bg-white shadow-lg overflow-hidden">
                  <img 
                    src="/placeholder.svg" 
                    alt="AI Writer Interface" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Core features */}
        <section id="core-features" className="py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="container-wide">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Features</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Everything you need to create, optimize, and analyze your content
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Edit3 className="h-6 w-6 text-primary" />,
                  title: "AI Content Generator",
                  description: "Create full-length articles, blog posts, and web copy tailored to your specific niche and audience."
                },
                {
                  icon: <Search className="h-6 w-6 text-primary" />,
                  title: "Keyword Research",
                  description: "Discover high-potential keywords with integrated research tools that show volume, competition, and trending topics."
                },
                {
                  icon: <Layout className="h-6 w-6 text-primary" />,
                  title: "Content Outlines",
                  description: "Generate comprehensive article outlines based on top-ranking content for your target keywords."
                },
                {
                  icon: <TrendingUp className="h-6 w-6 text-primary" />,
                  title: "SEO Optimization",
                  description: "AI-powered recommendations for title tags, meta descriptions, headings, and content structure."
                },
                {
                  icon: <FileText className="h-6 w-6 text-primary" />,
                  title: "Content Editor",
                  description: "Powerful WYSIWYG editor with real-time SEO suggestions and readability analysis."
                },
                {
                  icon: <Zap className="h-6 w-6 text-primary" />,
                  title: "Content Repurposing",
                  description: "Transform existing content into different formats like social posts, email newsletters, and more."
                }
              ].map((feature, index) => (
                <div key={index} className="glass p-8 rounded-xl">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-foreground/70">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Advanced features */}
        <section className="py-20">
          <div className="container-wide">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Capabilities</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Powerful tools for professionals and businesses
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                {
                  icon: <Layers className="h-6 w-6 text-primary" />,
                  title: "Workflow Automation",
                  description: "Create custom content workflows from ideation to publication, with team collaboration features."
                },
                {
                  icon: <Shield className="h-6 w-6 text-primary" />,
                  title: "Plagiarism Protection",
                  description: "Built-in plagiarism detection ensures your content is 100% original and safe to publish."
                },
                {
                  icon: <ActivitySquare className="h-6 w-6 text-primary" />,
                  title: "Performance Analytics",
                  description: "Track how your content performs with detailed analytics on traffic, engagement, and conversions."
                },
                {
                  icon: <BookOpen className="h-6 w-6 text-primary" />,
                  title: "Content Library",
                  description: "Organize and manage all your content assets in one centralized, searchable repository."
                }
              ].map((feature, index) => (
                <div key={index} className="glass p-8 rounded-xl flex">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-6 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-foreground/70">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Pricing CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="container-wide text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Content?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Choose the plan that's right for you and start creating amazing content today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-white text-blue-600 hover:bg-white/90" size="lg" asChild>
                <a href="/pricing">View Pricing</a>
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10" size="lg" asChild>
                <a href="/contact">Contact Sales</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Features;
