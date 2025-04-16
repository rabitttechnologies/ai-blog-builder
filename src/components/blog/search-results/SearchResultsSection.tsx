
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SearchSectionHeader from '../SearchSectionHeader';
import SelectableItem from '../SelectableItem';

interface SearchResultsSectionProps {
  heading: string;
  description: string;
  data: any[];
  selections: Record<string, any[]>;
  totalSelections: number;
  maxSelections: number;
  onToggleSelection: (heading: string, item: any) => void;
}

const SearchResultsSection: React.FC<SearchResultsSectionProps> = ({
  heading,
  description,
  data,
  selections,
  totalSelections,
  maxSelections,
  onToggleSelection
}) => {
  // Helper to check if an item is selected
  const isSelected = (item: any) => {
    if (!selections[heading]) return false;
    return selections[heading].some((selectedItem: any) => 
      JSON.stringify(selectedItem) === JSON.stringify(item)
    );
  };

  return (
    <Card>
      <SearchSectionHeader heading={heading} description={description} />
      <CardContent>
        <div className="space-y-2">
          {data.map((item, index) => (
            <SelectableItem
              key={index}
              item={item}
              isSelected={isSelected(item)}
              onToggle={() => onToggleSelection(heading, item)}
              index={index}
              heading={heading}
              disabled={!isSelected(item) && totalSelections >= maxSelections}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchResultsSection;
