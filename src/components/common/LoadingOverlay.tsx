
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
  subMessage?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = "Processing your request...",
  subMessage = "This may take a moment"
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center min-w-[280px] max-w-[90vw]">
      <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
      <p className="text-lg font-medium">{message}</p>
      <p className="text-sm text-muted-foreground">{subMessage}</p>
    </div>
  </div>
);

export default LoadingOverlay;
