import React from 'react';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchResultsSectionProps {
  heading: string;
  description: string;
  data: any[];
  selections: Record<string, boolean>;
  totalSelections: number;
  maxSelections: number;
  onToggleSelection: (heading: string, item: any) => void;
  editableKeywords?: Record<string, boolean>;
  keywordValues?: Record<string, string>;
  onStartEditing?: (heading: string, item: any) => void;
  onStopEditing?: (heading: string, item: any, save?: boolean) => void;
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
  onStartEditing = () => {},
  onStopEditing = () => {},
  onUpdateKeyword = () => {}
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">{heading}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => {
          const keyId = `${heading}-${item.keyword || item}`;
          const isSelected = selections[keyId] || false;
          const isEditing = editableKeywords[keyId] || false;
          const keywordValue = keywordValues[keyId] || item.keyword || item;

          return (
            <div 
              key={index} 
              className="glass p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`select-${keyId}`}
                    checked={isSelected}
                    disabled={totalSelections >= maxSelections && !isSelected}
                    onCheckedChange={() => onToggleSelection(heading, item)}
                  />
                  <label
                    htmlFor={`select-${keyId}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {isEditing ? (
                      <Input
                        type="text"
                        value={keywordValue}
                        onChange={(e) => onUpdateKeyword(heading, item, e.target.value)}
                        onBlur={() => onStopEditing(heading, item, false)}
                        className="text-sm"
                      />
                    ) : (
                      keywordValue
                    )}
                  </label>
                </div>

                <div>
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onStopEditing(heading, item, true)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onStopEditing(heading, item, false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onStartEditing(heading, item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              {item.volume && (
                <p className="text-xs text-muted-foreground">
                  Volume: {item.volume}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResultsSection;
