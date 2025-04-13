
import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";

interface ContentGenerationProps {
  onBack: () => void;
  onNext: () => void;
  selectedTitle: string;
}

const ContentGeneration: React.FC<ContentGenerationProps> = ({ 
  onBack, 
  onNext,
  selectedTitle 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState("");
  const { toast } = useToast();
  
  const handleGenerateContent = () => {
    if (!selectedTitle) {
      toast({
        title: "Missing title",
        description: "Please select or create a title first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate content generation - in a real app, this would be an API call
    setTimeout(() => {
      try {
        const mockContent = `# ${selectedTitle}\n\n## Introduction\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam ultricies.\n\n## Main Points\n1. First important point about the topic.\n2. Second critical concept to understand.\n3. Practical applications and examples.\n\n## Conclusion\nIn conclusion, this article has covered the key aspects of ${selectedTitle.toLowerCase()}. By implementing these strategies, you can improve your results significantly.`;
        setContent(mockContent);
        setIsGenerating(false);
      } catch (error) {
        console.error("Error generating content:", error);
        toast({
          title: "Generation failed",
          description: "There was an error generating your content. Please try again.",
          variant: "destructive",
        });
        setIsGenerating(false);
      }
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

export default ContentGeneration;
