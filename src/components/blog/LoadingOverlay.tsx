
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = "Loading..." 
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center min-w-[280px]">
      <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
      <p className="text-lg font-medium">{message}</p>
      <p className="text-sm text-muted-foreground">This may take up to a minute</p>
    </div>
  </div>
);

export default LoadingOverlay;
