import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturesSection from "@/components/home/FeaturesSection";
import TryItNowSection from "@/components/home/TryItNowSection";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";

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
        <Hero />
        <HowItWorks />
        <FeaturesSection />
        <TryItNowSection onKeywordSubmit={handleKeywordSubmit} />
        <Testimonials />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
