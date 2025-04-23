
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  onClose: () => void;
  initialData?: any;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onClose,
  initialData
}) => {
  return (
    <div className="text-center p-8 max-w-lg mx-auto">
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-red-100 p-3">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">An error occurred</h3>
      <p className="text-muted-foreground mb-4">{error}</p>
      <div className="flex gap-2 justify-center">
        {onRetry && (
          <Button 
            variant="outline" 
            onClick={onRetry}
            size="md"
          >
            Try Again
          </Button>
        )}
        <Button onClick={onClose} size="md">Close</Button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
