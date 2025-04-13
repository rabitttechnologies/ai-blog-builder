
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import KeywordInput from "@/components/blog/KeywordInput";
import TitleSelection from "@/components/blog/TitleSelection";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

type Step = "keywords" | "titles" | "content" | "review" | "complete";

// New component for content generation step
const ContentGeneration = ({ onBack, onNext, selectedTitle }: { 
  onBack: () => void, 
  onNext: () => void,
  selectedTitle: string
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState("");
  
  const handleGenerateContent = () => {
    setIsGenerating(true);
    // Simulate content generation
    setTimeout(() => {
      const mockContent = `# ${selectedTitle}\n\n## Introduction\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam ultricies.\n\n## Main Points\n1. First important point about the topic.\n2. Second critical concept to understand.\n3. Practical applications and examples.\n\n## Conclusion\nIn conclusion, this article has covered the key aspects of ${selectedTitle.toLowerCase()}. By implementing these strategies, you can improve your results significantly.`;
      setContent(mockContent);
      setIsGenerating(false);
    }, 2000);
  };
  
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Generate Content</h3>
      <p className="text-sm text-foreground/70 mb-6">
        Our AI will generate SEO-optimized content based on your selected title.
      </p>
      
      {!content ? (
        <div className="text-center py-8">
          <Button 
            onClick={handleGenerateContent}
            disabled={isGenerating}
            className="mb-4"
          >
            {isGenerating ? "Generating..." : "Generate Content"}
          </Button>
          {isGenerating && (
            <div className="mt-4">
              <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin mx-auto"></div>
              <p className="text-sm mt-2 text-foreground/70">This may take a few moments...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-6">
          <div className="bg-background border rounded-md p-4 h-60 overflow-y-auto mb-4 whitespace-pre-line">
            {content}
          </div>
          <div className="flex justify-between mt-6">
            <Button
              onClick={onBack}
              variant="outline"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Titles
            </Button>
            <Button
              onClick={onNext}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Review & Publish
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// New component for review step
const ReviewBlog = ({ onBack, onPublish, selectedTitle, keywords }: {
  onBack: () => void,
  onPublish: () => void,
  selectedTitle: string,
  keywords: string[]
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Review Your Blog</h3>
      <p className="text-sm text-foreground/70 mb-6">
        Review your blog details before publishing.
      </p>
      
      <div className="space-y-4 mb-6">
        <div className="p-4 bg-secondary/50 rounded-lg">
          <h4 className="font-medium text-sm text-foreground/70 mb-1">Title</h4>
          <p className="font-medium">{selectedTitle}</p>
        </div>
        
        <div className="p-4 bg-secondary/50 rounded-lg">
          <h4 className="font-medium text-sm text-foreground/70 mb-1">Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <span key={index} className="px-2 py-1 bg-background rounded-md text-sm">
                {keyword}
              </span>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-secondary/50 rounded-lg">
          <h4 className="font-medium text-sm text-foreground/70 mb-1">Content Preview</h4>
          <p className="text-foreground/70 text-sm">Full content generated (approx. 800 words)</p>
        </div>
        
        <div className="p-4 bg-secondary/50 rounded-lg">
          <h4 className="font-medium text-sm text-foreground/70 mb-1">SEO Score</h4>
          <div className="flex items-center">
            <div className="w-24 h-2 bg-background rounded-full overflow-hidden mr-2">
              <div className="h-full bg-green-500 w-4/5"></div>
            </div>
            <span className="text-green-500 font-medium">85/100</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Content
        </Button>
        <Button
          onClick={onPublish}
          rightIcon={<Check className="h-4 w-4" />}
        >
          Publish Blog
        </Button>
      </div>
    </div>
  );
};

const BlogCreate = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState<Step>("keywords");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [niche, setNiche] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  
  // Mock generated titles
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);

  // Extract keyword from URL if present with robust error handling
  useEffect(() => {
    try {
      const keywordParam = searchParams.get('keyword');
      
      if (keywordParam) {
        // Sanitize and validate the keyword
        const sanitizedKeyword = keywordParam.trim();
        
        if (sanitizedKeyword) {
          console.log("BlogCreate - Initialized with keyword from URL:", sanitizedKeyword);
          setKeywords([sanitizedKeyword]);
        } else {
          console.log("BlogCreate - Empty keyword in URL after sanitization");
        }
      } else {
        console.log("BlogCreate - No keyword in URL");
      }
    } catch (error) {
      console.error("Error processing URL parameters:", error);
      // Don't break the experience if parameter parsing fails
    }
  }, [searchParams]);

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }

  if (user?.trialBlogsRemaining === 0) {
    console.log("Trial limit reached, redirecting to pricing");
    toast({
      title: "Trial limit reached",
      description: "Please upgrade to continue creating blogs.",
      variant: "destructive",
    });
    return <Navigate to="/pricing" />;
  }

  const handleKeywordsSubmit = (keywords: string[], niche: string) => {
    console.log("Keywords submitted:", keywords, "niche:", niche);
    setKeywords(keywords);
    setNiche(niche);
    
    // In a real app, this would call an API to generate titles based on keywords
    console.log("Generating titles for keywords:", keywords, "niche:", niche);
    
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
    console.log("Selected title:", title);
    // Move to content step instead of completion
    setCurrentStep("content");
  };
  
  const handleContentNext = () => {
    setCurrentStep("review");
  };
  
  const handleReviewComplete = () => {
    // Simulate a successful blog creation
    toast({
      title: "Blog published successfully",
      description: "Your blog has been published and is now live.",
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
            <KeywordInput onSubmit={handleKeywordsSubmit} initialKeywords={keywords} />
          )}
          
          {currentStep === "titles" && (
            <TitleSelection 
              titles={generatedTitles} 
              onSelectTitle={handleTitleSelect} 
              onBack={() => setCurrentStep("keywords")}
            />
          )}
          
          {currentStep === "content" && (
            <ContentGeneration
              selectedTitle={selectedTitle}
              onBack={() => setCurrentStep("titles")}
              onNext={handleContentNext}
            />
          )}
          
          {currentStep === "review" && (
            <ReviewBlog
              selectedTitle={selectedTitle}
              keywords={keywords}
              onBack={() => setCurrentStep("content")}
              onPublish={handleReviewComplete}
            />
          )}
          
          {currentStep === "complete" && (
            <div className="text-center py-8 space-y-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Blog Published Successfully!</h3>
              <p className="text-foreground/70 max-w-sm mx-auto">
                Your blog "{selectedTitle}" has been published and is now available to your audience.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <Button 
                  onClick={() => navigate("/dashboard")} 
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
