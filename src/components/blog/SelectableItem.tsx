
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Check, X, Edit2 } from 'lucide-react';

interface SelectableItemProps {
  item: any;
  isSelected: boolean;
  onToggle: () => void;
  index: number;
  heading: string;
  disabled?: boolean;
  editable?: boolean;
}

const SelectableItem: React.FC<SelectableItemProps> = ({ 
  item, 
  isSelected, 
  onToggle, 
  index,
  heading,
  disabled = false,
  editable = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  
  // Helper to extract item text based on content type
  const getItemText = () => {
    if (typeof item === 'string') return item;
    
    // For organic results
    if (heading === 'Top in SERP' && item.title) {
      return `${item.title} (${item.url?.split('/')[2] || ''})`;
    }
    
    // Try to extract common properties
    if (item.title) return item.title;
    if (item.text) return item.text;
    if (item.question) return item.question;
    if (item.keyword) return item.keyword;
    
    // Fallback
    return JSON.stringify(item).substring(0, 100);
  };

  const handleStartEdit = () => {
    setEditValue(getItemText());
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue('');
  };

  const handleSaveEdit = () => {
    if (editValue.trim()) {
      // Update the item text
      if (typeof item === 'string') {
        item = editValue;
      } else if (typeof item === 'object' && item !== null) {
        if (item.title) item.title = editValue;
        if (item.text) item.text = editValue;
        if (item.question) item.question = editValue;
        if (item.keyword) item.keyword = editValue;
      }
    }
    setIsEditing(false);
  };

  return (
    <div className={`
      p-3 rounded-md transition-colors flex items-start gap-3
      ${isSelected ? 'bg-primary/10' : 'bg-muted/30'}
      ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-muted/50'}
    `}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="h-5 w-5 mt-0.5 cursor-pointer"
        disabled={disabled}
      />
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <Input 
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleCancelEdit}
                className="h-8 px-2"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleSaveEdit}
                className="h-8 px-2"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center gap-2">
            <p className={`${isSelected ? 'font-medium' : 'font-normal'} text-left whitespace-nowrap overflow-x-auto scrollbar-thin pb-1`}>
              {getItemText()}
            </p>
            {editable && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleStartEdit}
                className="h-8 px-2 flex-shrink-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        
        {/* Only show URL if it exists and the heading is 'Top in SERP' */}
        {heading === 'Top in SERP' && item.url && !isEditing && (
          <p className="text-xs text-muted-foreground truncate mt-1">
            {item.url}
          </p>
        )}
        
        {/* Show snippet if it exists and not editing */}
        {item.snippet && !isEditing && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {item.snippet}
          </p>
        )}
      </div>
    </div>
  );
};

export default SelectableItem;
