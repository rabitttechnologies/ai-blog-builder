
import React from 'react';

interface SelectableItemProps {
  item: any;
  isSelected: boolean;
  onToggle: () => void;
  index: number;
  heading: string;
  disabled?: boolean;
}

const SelectableItem: React.FC<SelectableItemProps> = ({ 
  item, 
  isSelected, 
  onToggle, 
  index,
  heading,
  disabled = false
}) => {
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
      <div className="flex-1">
        <p className={`${isSelected ? 'font-medium' : 'font-normal'}`}>
          {getItemText()}
        </p>
        
        {/* Only show URL if it exists and the heading is 'Top in SERP' */}
        {heading === 'Top in SERP' && item.url && (
          <p className="text-xs text-muted-foreground truncate mt-1">
            {item.url}
          </p>
        )}
        
        {/* Show snippet if it exists */}
        {item.snippet && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {item.snippet}
          </p>
        )}
      </div>
    </div>
  );
};

export default SelectableItem;
