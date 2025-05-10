
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface LoadingOverlayProps {
  message?: string;
  subMessage?: string;
  progress?: number;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = "Loading...",
  subMessage = "This may take up to a minute",
  progress
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center min-w-[280px] max-w-[90vw]">
      <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
      <p className="text-lg font-medium">{message}</p>
      <p className="text-sm text-muted-foreground mb-4">{subMessage}</p>
      
      {typeof progress === 'number' && (
        <div className="mt-4 space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">{progress}% complete</p>
        </div>
      )}
    </div>
  </div>
);

export default LoadingOverlay;
