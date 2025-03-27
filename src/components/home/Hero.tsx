
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { TRIAL_LENGTH_DAYS } from "@/constants/pricing";
import BenefitsSlider from "./BenefitsSlider";

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50 to-transparent opacity-70" />
        <div className="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-40" />
        <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full bg-purple-100 blur-3xl opacity-30" />
      </div>

      <div className="container-tight text-center relative z-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-8 animate-fade-in">
          <span className="badge badge-primary mr-2">New</span>
          <span className="text-sm">Introducing Insight Writer AI</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in [animation-delay:150ms]">
          Use AI Blogger to Empower Your Blogging with AI & Search Data to Rank #1
        </h1>

        <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-10 animate-fade-in [animation-delay:300ms]">
          Transform your blogging with our AI platform. Get an intelligent article writer and blog writer to streamline your blog writing and create standout articles for every blogger
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in [animation-delay:450ms]">
          <Link to="/signup">
            <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Start {TRIAL_LENGTH_DAYS}-Day Free Trial
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            See How It Works
          </Button>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg max-w-md mx-auto mb-10 animate-fade-in [animation-delay:400ms]">
          <p className="text-sm text-blue-800">
            <strong>No credit card required.</strong> Get a full {TRIAL_LENGTH_DAYS}-day free trial with 2 blog posts.
          </p>
        </div>
        
        <BenefitsSlider />

        <div className="relative mx-auto max-w-4xl rounded-xl overflow-hidden shadow-2xl animate-fade-in [animation-delay:600ms] mt-8">
          <img 
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
            alt="Person using Insight Writer AI on laptop" 
            className="w-full h-auto rounded-t-xl object-cover"
          />
          
          {/* Mock Browser UI */}
          <div className="relative bg-white rounded-xl overflow-hidden">
            <div className="h-10 bg-gray-100 flex items-center px-4 border-b">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="mx-auto w-80 h-6 rounded-full bg-white flex items-center px-3 text-xs text-gray-400">
                insightwriter.ai/dashboard
              </div>
            </div>
            
            <div className="bg-white p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="h-8 w-64 bg-gray-100 rounded-md animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-4 w-4/5 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="h-5 w-24 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-100 rounded mr-3"></div>
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-100 rounded mr-3"></div>
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-100 rounded mr-3"></div>
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
