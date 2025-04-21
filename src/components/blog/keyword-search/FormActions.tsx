
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
    <div className="flex justify-end space-x-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
      
      <Button
        type="submit"
        disabled={isLoading}
      >
        Search
      </Button>
    </div>
  );
};

export default FormActions;
