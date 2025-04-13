
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import KeywordInput from "@/components/blog/KeywordInput";
import TitleSelection from "@/components/blog/TitleSelection";
import ContentGeneration from "@/components/blog/ContentGeneration";
import ReviewBlog from "@/components/blog/ReviewBlog";
import SuccessMessage from "@/components/blog/SuccessMessage";
import BlogProgressIndicator from "@/components/blog/BlogProgressIndicator";
import { useBlogCreation } from "@/hooks/useBlogCreation";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const BlogCreate = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
    currentStep,
    keywords,
    generatedTitles,
    selectedTitle,
    handleKeywordsSubmit,
    handleTitleSelect,
    handleContentNext,
    handleReviewComplete,
    resetBlogCreation,
    navigate: blogNavigate
  } = useBlogCreation();

  // Better trial check with safeguard for undefined values
  const isTrialExhausted = () => {
    return user && (user.trialBlogsRemaining === 0 || user.trialBlogsRemaining === undefined);
  };

  // Add this effect to handle auth changes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("BlogCreate - User not authenticated, redirecting to login");
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading while auth state is being determined
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container max-w-4xl py-8">
          <Skeleton className="h-12 w-64 mb-6" />
          <Skeleton className="h-8 w-full mb-8" />
          <div className="glass p-6 rounded-xl">
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // If not authenticated, return null as the useEffect will handle redirection
  if (!isAuthenticated) {
    return null;
  }

  // Check for trial exhaustion only after confirming user is authenticated
  if (isTrialExhausted()) {
    console.log("BlogCreate - Trial limit reached, redirecting to pricing");
    toast({
      title: "Trial limit reached",
      description: "Please upgrade to continue creating blogs.",
      variant: "destructive",
    });
    return <Navigate to="/pricing" />;
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Create Blog - BlogCraft</title>
      </Helmet>
      
      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-6">Create New Blog</h1>
        
        {/* Progress indicator */}
        <BlogProgressIndicator currentStep={currentStep} />
        
        <div className="glass p-6 rounded-xl">
          {currentStep === "keywords" && (
            <KeywordInput onSubmit={handleKeywordsSubmit} initialKeywords={keywords} />
          )}
          
          {currentStep === "titles" && (
            <TitleSelection 
              titles={generatedTitles} 
              onSelectTitle={handleTitleSelect} 
              onBack={() => blogNavigate("/dashboard")}
            />
          )}
          
          {currentStep === "content" && (
            <ContentGeneration
              selectedTitle={selectedTitle}
              onBack={() => blogNavigate("/blog/create?step=titles")}
              onNext={handleContentNext}
            />
          )}
          
          {currentStep === "review" && (
            <ReviewBlog
              selectedTitle={selectedTitle}
              keywords={keywords}
              onBack={() => blogNavigate("/blog/create?step=content")}
              onPublish={handleReviewComplete}
            />
          )}
          
          {currentStep === "complete" && (
            <SuccessMessage
              selectedTitle={selectedTitle}
              onCreateAnother={resetBlogCreation}
              onBackToDashboard={() => blogNavigate("/dashboard")}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BlogCreate;
