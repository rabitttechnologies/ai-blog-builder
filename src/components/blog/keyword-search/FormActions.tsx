
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  isLoading: boolean;
  timeoutReached: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ isLoading, timeoutReached, onCancel }) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
      {timeoutReached ? (
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          Try Again
        </Button>
      ) : (
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            'Search'
          )}
        </Button>
      )}
    </div>
  );
};

export default FormActions;
