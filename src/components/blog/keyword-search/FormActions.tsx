
import React from 'react';
import { Button } from '@/components/ui/Button';

interface FormActionsProps {
  isLoading: boolean;
  timeoutReached: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isLoading, 
  timeoutReached,
  onCancel 
}) => {
  return (
    <div className="flex justify-between pt-2">
      <Button 
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        size="md"
      >
        Cancel
      </Button>
      
      <Button 
        type="submit" 
        disabled={isLoading}
        size="md"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </Button>
    </div>
  );
};

export default FormActions;
