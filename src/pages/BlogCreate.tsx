
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import KeywordInput from "@/components/blog/KeywordInput";
import TitleSelection from "@/components/blog/TitleSelection";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/Button";

type Step = "keywords" | "titles" | "content" | "review" | "complete";

const BlogCreate = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>("keywords");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [niche, setNiche] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  
  // Mock generated titles
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.trialBlogsRemaining === 0) {
    toast({
      title: "Trial limit reached",
      description: "Please upgrade to continue creating blogs.",
      variant: "destructive",
    });
    return <Navigate to="/pricing" />;
  }

  const handleKeywordsSubmit = (keywords: string[], niche: string) => {
    setKeywords(keywords);
    setNiche(niche);
    
    // In a real app, this would call an API to generate titles based on keywords
    // For now, we'll mock this with some sample titles
    setGeneratedTitles([
      `10 Ways to Optimize Your ${niche} Strategy Using ${keywords[0]}`,
      `The Ultimate Guide to ${niche}: Leveraging ${keywords[0]} and ${keywords[1] || "SEO"}`,
      `How ${keywords[0]} is Transforming the ${niche} Industry in 2023`,
      `${keywords[0]} vs ${keywords[1] || "Traditional Methods"}: Which is Better for ${niche}?`,
      `Why Every ${niche} Professional Should Know About ${keywords[0]}`
    ]);
    
    setCurrentStep("titles");
  };

  const handleTitleSelect = (title: string) => {
    setSelectedTitle(title);
    // In a real app, we would now generate the content
    // But for this demo, we'll just simulate completion
    
    // Simulate a successful blog creation
    toast({
      title: "Blog created successfully",
      description: "Your blog has been saved to your account.",
    });
    
    setCurrentStep("complete");
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Create Blog - BlogCraft</title>
      </Helmet>
      
      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-6">Create New Blog</h1>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === "keywords" || currentStep === "titles" || currentStep === "content" || currentStep === "review" || currentStep === "complete" ? "bg-primary text-white" : "bg-gray-200"}`}>
              1
            </div>
            <div className={`h-1 w-16 ${currentStep === "titles" || currentStep === "content" || currentStep === "review" || currentStep === "complete" ? "bg-primary" : "bg-gray-200"}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === "titles" || currentStep === "content" || currentStep === "review" || currentStep === "complete" ? "bg-primary text-white" : "bg-gray-200"}`}>
              2
            </div>
            <div className={`h-1 w-16 ${currentStep === "content" || currentStep === "review" || currentStep === "complete" ? "bg-primary" : "bg-gray-200"}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === "content" || currentStep === "review" || currentStep === "complete" ? "bg-primary text-white" : "bg-gray-200"}`}>
              3
            </div>
            <div className={`h-1 w-16 ${currentStep === "review" || currentStep === "complete" ? "bg-primary" : "bg-gray-200"}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === "review" || currentStep === "complete" ? "bg-primary text-white" : "bg-gray-200"}`}>
              4
            </div>
          </div>
          <div className="flex justify-between text-sm mt-2 text-foreground/70">
            <span>Keywords</span>
            <span>Title</span>
            <span>Content</span>
            <span>Review</span>
          </div>
        </div>
        
        <div className="glass p-6 rounded-xl">
          {currentStep === "keywords" && (
            <KeywordInput onSubmit={handleKeywordsSubmit} />
          )}
          
          {currentStep === "titles" && (
            <TitleSelection 
              titles={generatedTitles} 
              onSelectTitle={handleTitleSelect} 
              onBack={() => setCurrentStep("keywords")}
            />
          )}
          
          {currentStep === "complete" && (
            <div className="text-center py-8 space-y-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Blog Created Successfully!</h3>
              <p className="text-foreground/70 max-w-sm mx-auto">
                Your blog "{selectedTitle}" has been created and saved to your account.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <Button 
                  onClick={() => window.location.href = "/dashboard"} 
                  variant="outline"
                >
                  Back to Dashboard
                </Button>
                <Button 
                  onClick={() => {
                    setKeywords([]);
                    setNiche("");
                    setSelectedTitle("");
                    setGeneratedTitles([]);
                    setCurrentStep("keywords");
                  }}
                >
                  Create Another Blog
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BlogCreate;
