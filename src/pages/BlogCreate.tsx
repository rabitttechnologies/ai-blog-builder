
import React from "react";
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

const BlogCreate = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
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
    navigate
  } = useBlogCreation();

  // Better trial check with safeguard for undefined values
  const isTrialExhausted = () => {
    return user && (user.trialBlogsRemaining === 0 || user.trialBlogsRemaining === undefined);
  }

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }

  if (isTrialExhausted()) {
    console.log("Trial limit reached, redirecting to pricing");
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
              onBack={() => navigate("/dashboard")}
            />
          )}
          
          {currentStep === "content" && (
            <ContentGeneration
              selectedTitle={selectedTitle}
              onBack={() => navigate("/blog/create?step=titles")}
              onNext={handleContentNext}
            />
          )}
          
          {currentStep === "review" && (
            <ReviewBlog
              selectedTitle={selectedTitle}
              keywords={keywords}
              onBack={() => navigate("/blog/create?step=content")}
              onPublish={handleReviewComplete}
            />
          )}
          
          {currentStep === "complete" && (
            <SuccessMessage
              selectedTitle={selectedTitle}
              onCreateAnother={resetBlogCreation}
              onBackToDashboard={() => navigate("/dashboard")}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BlogCreate;
