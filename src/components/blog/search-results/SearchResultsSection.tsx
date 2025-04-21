
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Edit, Check, X } from 'lucide-react';
import { isItemSelected } from '@/utils/selectionUtils';
import SelectableItem from '../SelectableItem';

interface SearchResultsSectionProps {
  heading: string;
  description: string;
  data: any[];
  selections: Record<string, any[]>;
  totalSelections: number;
  maxSelections: number;
  onToggleSelection: (heading: string, item: any) => void;
  editableKeywords?: Record<string, boolean>;
  keywordValues?: Record<string, string>;
  onStartEditing?: (heading: string, item: any) => void;
  onStopEditing?: (heading: string, item: any, save: boolean) => void;
  onUpdateKeyword?: (heading: string, item: any, value: string) => void;
}

const SearchResultsSection: React.FC<SearchResultsSectionProps> = ({
  heading,
  description,
  data,
  selections,
  totalSelections,
  maxSelections,
  onToggleSelection,
  editableKeywords = {},
  keywordValues = {},
  onStartEditing,
  onStopEditing,
  onUpdateKeyword
}) => {
  if (!data || data.length === 0) {
    return null;
  }

  const renderKeyword = (item: any, index: number) => {
    const keyword = typeof item === 'string' ? item : item.keyword;
    const isEditing = editableKeywords[`${heading}-${keyword}`];
    const editValue = keywordValues[`${heading}-${keyword}`] || keyword;
    
    return (
      <div className="flex items-center gap-2" key={index}>
        <SelectableItem
          heading={heading}
          item={item}
          isSelected={isItemSelected(selections, heading, item)}
          onToggle={onToggleSelection}
          disabled={!isItemSelected(selections, heading, item) && totalSelections >= maxSelections}
        />
        
        {isEditing ? (
          <div className="flex-1 flex items-center gap-1">
            <Input
              value={editValue}
              onChange={(e) => onUpdateKeyword?.(heading, item, e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onStopEditing?.(heading, item, true)}
              className="h-8 w-8 p-0"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onStopEditing?.(heading, item, false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-between gap-2">
            <span>{keyword}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onStartEditing?.(heading, item)}
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{heading}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {data.map((item, index) => renderKeyword(item, index))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchResultsSection;
