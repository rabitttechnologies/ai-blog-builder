
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type Step = "keywords" | "titles" | "content" | "review" | "complete";

export const useBlogCreation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState<Step>("keywords");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [niche, setNiche] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
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

  const handleKeywordsSubmit = (newKeywords: string[], newNiche: string) => {
    if (!newKeywords.length) {
      toast({
        title: "Keywords required",
        description: "Please enter at least one keyword.",
        variant: "destructive",
      });
      return;
    }

    console.log("Keywords submitted:", newKeywords, "niche:", newNiche);
    setKeywords(newKeywords);
    setNiche(newNiche);
    
    // In a real app, this would call an API to generate titles based on keywords
    console.log("Generating titles for keywords:", newKeywords, "niche:", newNiche);
    
    // Make templates more robust by using the available keywords
    const primaryKeyword = newKeywords[0] || "SEO";
    const secondaryKeyword = newKeywords[1] || (newKeywords[0] || "Content Marketing");
    
    // For now, we'll mock this with some sample titles
    setGeneratedTitles([
      `10 Ways to Optimize Your ${newNiche} Strategy Using ${primaryKeyword}`,
      `The Ultimate Guide to ${newNiche}: Leveraging ${primaryKeyword} and ${secondaryKeyword}`,
      `How ${primaryKeyword} is Transforming the ${newNiche} Industry in 2023`,
      `${primaryKeyword} vs ${secondaryKeyword}: Which is Better for ${newNiche}?`,
      `Why Every ${newNiche} Professional Should Know About ${primaryKeyword}`
    ]);
    
    setCurrentStep("titles");
  };

  const handleTitleSelect = (title: string) => {
    if (!title.trim()) {
      toast({
        title: "Invalid title",
        description: "Please select or enter a valid title.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedTitle(title);
    console.log("Selected title:", title);
    setCurrentStep("content");
  };
  
  const handleContentNext = () => {
    setCurrentStep("review");
  };
  
  const handleReviewComplete = () => {
    // In a real app, this would call an API to save the blog post
    
    // Simulate a successful blog creation
    toast({
      title: "Blog published successfully",
      description: "Your blog has been published and is now live.",
    });
    
    // Update the user's trial count - this would normally happen on the backend
    // For now we just display the success message and complete the flow
    
    setCurrentStep("complete");
  };

  const resetBlogCreation = () => {
    setKeywords([]);
    setNiche("");
    setSelectedTitle("");
    setGeneratedTitles([]);
    setCurrentStep("keywords");
  };

  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

  return {
    currentStep,
    keywords,
    niche,
    selectedTitle,
    generatedTitles,
    handleKeywordsSubmit,
    handleTitleSelect,
    handleContentNext,
    handleReviewComplete,
    resetBlogCreation,
    goToStep,
    navigate
  };
};
