
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = 'Processing your request...'
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full mx-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <h3 className="text-xl font-semibold mb-2">Please wait</h3>
        <p className="text-gray-600">{message}</p>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full animate-pulse w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
