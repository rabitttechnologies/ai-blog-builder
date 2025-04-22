
import React from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturesSection from "@/components/home/FeaturesSection";
import FreeAITools from "@/components/home/FreeAITools";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>AI Agent Writer - AI Blog Writer & Article Generator for Blogger</title>
        <meta name="description" content="Use our efficient AI article writer and blog writer for superior article writing and efficient blog writing, helping every blogger create high-quality articles and elevate their blogging presence. Explore AI-powered writing today!" />
        <link rel="canonical" href="https://agiagentworld.com" />
        <meta name="keywords" content="AI blog writer, article generator, content creation, SEO writing, blogging tools" />
        <meta property="og:title" content="Rank #1 with AI Blogging Tools - AI Agent Writer" />
        <meta property="og:description" content="Use our efficient AI article writer and blog writer for superior article writing and efficient blog writing, helping every blogger create high-quality articles and elevate their blogging presence." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://agiagentworld.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rank #1 with AI Blogging Tools - AI Agent Writer" />
        <meta name="twitter:description" content="Use our efficient AI article writer and blog writer for superior article writing and efficient blog writing, helping every blogger create high-quality articles and elevate their blogging presence." />
      </Helmet>
      
      <Header />
      
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <FeaturesSection />
        <FreeAITools />
        <Testimonials />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
