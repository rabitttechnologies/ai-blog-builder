
import React from "react";
import { Button } from "@/components/ui/Button";

interface SuccessMessageProps {
  selectedTitle: string;
  onCreateAnother: () => void;
  onBackToDashboard: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  selectedTitle,
  onCreateAnother,
  onBackToDashboard
}) => {
  return (
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
          onClick={onBackToDashboard} 
          variant="outline"
        >
          Back to Dashboard
        </Button>
        <Button 
          onClick={onCreateAnother}
        >
          Create Another Blog
        </Button>
      </div>
    </div>
  );
};

export default SuccessMessage;
