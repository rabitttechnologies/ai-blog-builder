
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { isItemSelected, toggleItemSelection } from '@/utils/selectionUtils';

// Maximum number of items that can be selected
export const MAX_SELECTIONS = 30;

export interface SelectionItem {
  [key: string]: any;
}

export type SelectionsState = Record<string, any[]>;

export const useKeywordSelections = () => {
  const [selections, setSelections] = useState<SelectionsState>({});

  // Calculate total selections across all categories
  const totalSelections = Object.values(selections).reduce(
    (total, items) => total + items.length, 0
  );

  const handleToggleSelection = (heading: string, item: any) => {
    // Check if item is already selected (always allow deselection)
    if (isItemSelected(selections, heading, item)) {
      toggleItemSelection(selections, heading, item, setSelections);
      return;
    }
    
    // Check if adding would exceed max selections
    if (totalSelections >= MAX_SELECTIONS) {
      toast({
        title: "Selection limit reached",
        description: `You can select a maximum of ${MAX_SELECTIONS} keywords.`,
        variant: "destructive"
      });
      return;
    }
    
    // If we're under the limit, allow the selection
    toggleItemSelection(selections, heading, item, setSelections);
  };

  return {
    selections,
    setSelections,
    totalSelections,
    handleToggleSelection
  };
};
