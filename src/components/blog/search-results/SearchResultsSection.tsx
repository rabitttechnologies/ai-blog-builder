
import React from 'react';
import { SelectionsState } from '@/hooks/useKeywordSelections';
import SelectableItem from '../SelectableItem';

interface SearchResultsSectionProps {
  heading: string;
  description: string;
  data: any[];
  selections: SelectionsState;
  totalSelections: number;
  maxSelections: number;
  onToggleSelection: (heading: string, item: any) => void;
  editable?: boolean;
}

const SearchResultsSection: React.FC<SearchResultsSectionProps> = ({
  heading,
  description,
  data,
  selections,
  totalSelections,
  maxSelections,
  onToggleSelection,
  editable = false
}) => {
  // Skip rendering if no data
  if (!data || data.length === 0) {
    return null;
  }
  
  // Determine if more selections would exceed the maximum
  const isMaxedOut = totalSelections >= maxSelections;
  
  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-lg font-semibold">{heading}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {data.map((item, index) => {
          // Get current selections for this heading
          const headingSelections = selections[heading] || [];
          
          // Check if this item is selected
          const isSelected = headingSelections.some(selectedItem => {
            // Handle different item formats
            if (typeof item === 'string' && typeof selectedItem === 'string') {
              return item === selectedItem;
            }
            
            if (typeof item === 'object' && item !== null && 
                typeof selectedItem === 'object' && selectedItem !== null) {
              // Compare by common identifiers
              if (item.id && selectedItem.id) return item.id === selectedItem.id;
              if (item.title && selectedItem.title) return item.title === selectedItem.title;
              if (item.text && selectedItem.text) return item.text === selectedItem.text;
              if (item.keyword && selectedItem.keyword) return item.keyword === selectedItem.keyword;
            }
            
            // Fallback to string comparison
            return JSON.stringify(item) === JSON.stringify(selectedItem);
          });
          
          return (
            <SelectableItem
              key={index}
              item={item}
              isSelected={isSelected}
              onToggle={() => onToggleSelection(heading, item)}
              index={index}
              heading={heading}
              disabled={!isSelected && isMaxedOut}
              editable={editable}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SearchResultsSection;
