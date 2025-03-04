
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import { Button } from "@/components/ui/Button";
import KeywordInput from "@/components/blog/KeywordInput";
import SignupForm from "@/components/auth/SignupForm";
import { ArrowRight, CheckCircle, Sparkles, Clock, Target, BarChart } from "lucide-react";

const Index = () => {
  const handleKeywordSubmit = (niche: string, keywords: string[]) => {
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
              </div>
              
              <div className="glass p-6 rounded-xl card-hover">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Content Creation</h3>
                <p className="text-foreground/70">
                  Generate SEO-optimized blog content using advanced language models tailored to your specific industry.
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl card-hover">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Human Approval</h3>
                <p className="text-foreground/70">
                  Review and approve AI-generated content at every stage, ensuring quality and brand consistency.
                </p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
                Explore All Features
              </Button>
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
                    src="https://placehold.co/600x400/e2e8f0/a3afc0?text=Keywords+Input"
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
                    src="https://placehold.co/600x400/e2e8f0/a3afc0?text=Title+Selection"
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
                    src="https://placehold.co/600x400/e2e8f0/a3afc0?text=Content+Approval"
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
                Start your 14-day free trial with 2 blog credits. No credit card required.
              </p>
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
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
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
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
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
                  <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
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
        
        {/* Pricing Section */}
        <section className="py-20 bg-white">
          <div className="container-tight">
            <div className="text-center mb-16">
              <div className="badge badge-primary mb-3">Pricing</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Choose the plan that fits your content needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-xl">
                <div className="badge mb-4">Free Trial</div>
                <h3 className="text-2xl font-bold mb-2">Try it free</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-foreground/70 ml-2">/ 14 days</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span>2 full blog posts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Keyword research</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Title generation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Google Docs export</span>
                  </li>
                </ul>
                
                <Button fullWidth>Get Started</Button>
              </div>
              
              <div className="glass p-8 rounded-xl border-2 border-primary">
                <div className="badge badge-primary mb-4">Most Popular</div>
                <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-foreground/70 ml-2">/ month</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span>10 blog posts per month</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Advanced keyword research</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Priority generation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Google Docs & Airtable integration</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span>API access</span>
                  </li>
                </ul>
                
                <Button variant="primary" fullWidth>Subscribe Now</Button>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <p className="text-foreground/70">
                Need more blogs? <a href="#" className="text-primary font-medium">Contact us</a> about our Enterprise plan.
              </p>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="container-tight text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Content Strategy?</h2>
            <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
              Start creating high-quality, SEO-optimized blog content today with our 14-day free trial.
            </p>
            <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Start Your Free Trial
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
