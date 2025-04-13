
import React from "react";

type Step = "keywords" | "titles" | "content" | "review" | "complete";

interface BlogProgressIndicatorProps {
  currentStep: Step;
}

const BlogProgressIndicator: React.FC<BlogProgressIndicatorProps> = ({ currentStep }) => {
  return (
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
  );
};

export default BlogProgressIndicator;
