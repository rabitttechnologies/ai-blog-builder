
import React from 'react';
import { Button } from '@/components/ui/Button';

interface SelectionCounterProps {
  selectedCount: number;
  onGenerateTitles: () => void;
}

const SelectionCounter: React.FC<SelectionCounterProps> = ({ selectedCount, onGenerateTitles }) => {
  return (
    <div className="sticky bottom-4 left-0 right-0 z-10 flex justify-center">
      <div className="bg-background border rounded-full shadow-lg px-4 py-2 flex items-center">
        <span className="font-medium mr-4">
          {selectedCount}/10 keywords selected
        </span>
        <Button 
          onClick={onGenerateTitles} 
          disabled={selectedCount < 10}
          size="sm"
        >
          Create Title and Description
        </Button>
      </div>
    </div>
  );
};

export default SelectionCounter;
