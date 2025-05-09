
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ArticleLoadingOverlayProps {
  message?: string;
  subMessage?: string;
}

const ArticleLoadingOverlay: React.FC<ArticleLoadingOverlayProps> = ({ 
  message = "Processing your request...",
  subMessage = "This may take a minute or two"
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md mx-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
      <p className="text-xl font-medium">{message}</p>
      <p className="text-sm text-muted-foreground mt-2">{subMessage}</p>
    </div>
  </div>
);

export default ArticleLoadingOverlay;
