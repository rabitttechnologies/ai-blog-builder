
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import { Button } from "@/components/ui/Button";
import KeywordInput from "@/components/blog/KeywordInput";
import SignupForm from "@/components/auth/SignupForm";
import { ArrowRight, CheckCircle, Sparkles, Clock, Target, BarChart } from "lucide-react";
import { Link } from "react-router-dom";
import { TRIAL_LENGTH_DAYS, TRIAL_SUBSCRIPTION_LENGTH_DAYS } from "@/constants/pricing";

const Index = () => {
  const handleKeywordSubmit = (keywords: string[], niche: string) => {
    console.log("Niche:", niche);
    console.log("Keywords:", keywords);
    // This would normally trigger the keyword research process
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container-wide">
            <div className="text-center mb-16">
              <div className="badge badge-primary mb-3">The Platform</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How BlogCraft Works</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Our AI-powered platform combines the efficiency of automation with the quality of human oversight.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass p-6 rounded-xl card-hover">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Keyword Research</h3>
                <p className="text-foreground/70">
                  Our AI analyzes search trends to find the most relevant keywords for your niche using Tavily SERP data.
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                  alt="Keyword research visualization" 
                  className="w-full h-auto rounded-lg mt-4 object-cover"
                />
              </div>
              
              <div className="glass p-6 rounded-xl card-hover">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Content Creation</h3>
                <p className="text-foreground/70">
                  Generate SEO-optimized blog content using advanced language models tailored to your specific industry.
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                  alt="AI content creation" 
                  className="w-full h-auto rounded-lg mt-4 object-cover"
                />
              </div>
              
              <div className="glass p-6 rounded-xl card-hover">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Human Approval</h3>
                <p className="text-foreground/70">
                  Review and approve AI-generated content at every stage, ensuring quality and brand consistency.
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
                  alt="Human review process" 
                  className="w-full h-auto rounded-lg mt-4 object-cover"
                />
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Link to="/signup">
                <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Explore All Features
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="container-wide">
            <div className="text-center mb-16">
              <div className="badge badge-primary mb-3">Workflow</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple 3-Step Process</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                From keywords to published content in minutes, not days.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
              <div className="relative">
                <div className="glass p-6 rounded-xl h-full">
                  <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-primary text-white font-bold flex items-center justify-center">1</div>
                  <h3 className="text-xl font-semibold mb-3 pt-1">Enter Your Keywords</h3>
                  <p className="text-foreground/70 mb-4">
                    Provide your niche and 3-5 keywords to define your content focus.
                  </p>
                  <img
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                    alt="Keywords Input"
                    className="rounded-lg w-full aspect-video object-cover"
                  />
                </div>
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <ArrowRight className="h-8 w-8 text-primary/30" />
                </div>
              </div>
              
              <div className="relative">
                <div className="glass p-6 rounded-xl h-full">
                  <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-primary text-white font-bold flex items-center justify-center">2</div>
                  <h3 className="text-xl font-semibold mb-3 pt-1">Select Blog Titles</h3>
                  <p className="text-foreground/70 mb-4">
                    Choose from AI-generated title options or create your own custom title.
                  </p>
                  <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                    alt="Title Selection"
                    className="rounded-lg w-full aspect-video object-cover"
                  />
                </div>
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <ArrowRight className="h-8 w-8 text-primary/30" />
                </div>
              </div>
              
              <div className="relative">
                <div className="glass p-6 rounded-xl h-full">
                  <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-primary text-white font-bold flex items-center justify-center">3</div>
                  <h3 className="text-xl font-semibold mb-3 pt-1">Approve & Export</h3>
                  <p className="text-foreground/70 mb-4">
                    Review the AI-generated content, make edits if needed, and export to your preferred format.
                  </p>
                  <img
                    src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                    alt="Content Approval"
                    className="rounded-lg w-full aspect-video object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Try It Now Section */}
        <section className="py-20 bg-white">
          <div className="container-tight">
            <div className="text-center mb-10">
              <div className="badge badge-primary mb-3">Get Started</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Try It For Free</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Start your {TRIAL_LENGTH_DAYS}-day free trial with 2 blog credits. No credit card required.
              </p>
            </div>

            <div className="glass p-6 rounded-xl text-center mb-10 border border-blue-100 bg-blue-50/50">
              <h3 className="text-xl font-semibold mb-2">Free {TRIAL_LENGTH_DAYS}-Day Trial</h3>
              <p className="mb-4">Get full access to BlogCraft for {TRIAL_LENGTH_DAYS} days with 2 free blog posts</p>
              <div className="flex justify-center space-x-6 mb-6">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Full access</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Cancel anytime</span>
                </div>
              </div>
              <Link to="/signup">
                <Button size="lg">
                  Start Free Trial
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <KeywordInput onSubmit={handleKeywordSubmit} />
              <SignupForm />
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 bg-secondary">
          <div className="container-wide">
            <div className="text-center mb-16">
              <div className="badge badge-primary mb-3">Testimonials</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Join thousands of content creators who have streamlined their workflow with BlogCraft.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80" 
                    alt="Sarah Johnson" 
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-foreground/70">Content Marketer</p>
                  </div>
                </div>
                <p className="text-foreground/80">
                  "BlogCraft has cut my content creation time in half while improving the quality of my blogs. The keyword research feature is especially valuable."
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" 
                    alt="Michael Chen" 
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Michael Chen</h4>
                    <p className="text-sm text-foreground/70">SEO Specialist</p>
                  </div>
                </div>
                <p className="text-foreground/80">
                  "The SEO optimization is fantastic. Our organic traffic has increased by 40% since we started using BlogCraft for our content strategy."
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" 
                    alt="Emily Rodriguez" 
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Emily Rodriguez</h4>
                    <p className="text-sm text-foreground/70">Small Business Owner</p>
                  </div>
                </div>
                <p className="text-foreground/80">
                  "As someone who isn't a natural writer, BlogCraft has been a game-changer for my business blog. It's like having a content team at a fraction of the cost."
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="container-tight text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Content Strategy?</h2>
            <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
              Start creating high-quality, SEO-optimized blog content today with our {TRIAL_LENGTH_DAYS}-day free trial.
            </p>
            <Link to="/signup">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
