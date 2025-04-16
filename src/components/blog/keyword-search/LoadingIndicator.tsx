
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  isLoading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="mt-4 text-center">
      <div className="flex justify-center mb-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
      <p className="text-sm text-muted-foreground">
        Fetching search data... This may take up to 60 seconds.
      </p>
    </div>
  );
};

export default LoadingIndicator;
