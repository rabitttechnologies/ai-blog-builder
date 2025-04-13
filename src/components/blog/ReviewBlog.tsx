
import React from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ReviewBlogProps {
  onBack: () => void;
  onPublish: () => void;
  selectedTitle: string;
  keywords: string[];
}

const ReviewBlog: React.FC<ReviewBlogProps> = ({
  onBack,
  onPublish,
  selectedTitle,
  keywords
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

export default ReviewBlog;
