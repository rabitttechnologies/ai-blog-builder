
import React from 'react';
import { Button } from '@/components/ui/Button';

interface SelectionCounterProps {
  selectedCount: number;
  onGenerateTitles: () => void;
}

const SelectionCounter: React.FC<SelectionCounterProps> = ({ 
  selectedCount,
  onGenerateTitles
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10 shadow-lg flex flex-col items-center bg-white rounded-lg p-4 border">
      <div className="flex items-center justify-center gap-3">
        <p className="text-sm font-medium">
          {selectedCount} keywords selected
        </p>
      </div>
    </div>
  );
};

export default SelectionCounter;
