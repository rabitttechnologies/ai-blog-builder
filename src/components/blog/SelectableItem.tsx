
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ExternalLink } from 'lucide-react';

interface SelectableItemProps {
  item: any;
  isSelected: boolean;
  onToggle: () => void;
  index: number;
  heading: string;
}

const SelectableItem = ({ item, isSelected, onToggle, index, heading }: SelectableItemProps) => {
  const renderContent = () => {
    if (typeof item === 'string') {
      return <div className="ml-2">{item}</div>;
    }
    
    if (item.title && item.url) {
      return (
        <div className="ml-2">
          <p className="font-semibold">{item.title}</p>
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 text-sm flex items-center hover:underline"
          >
            {item.url.substring(0, 50)}...
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
          {item.snippet && <p className="text-sm text-gray-600 mt-1">{item.snippet}</p>}
        </div>
      );
    }
    
    if (typeof item === 'object') {
      return (
        <div className="ml-2">
          {Object.entries(item).map(([key, value]) => (
            <div key={key} className="text-sm">
              <span className="font-medium">{key}: </span>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div 
      className="flex items-start p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
    >
      <Checkbox 
        id={`${heading}-${index}`}
        checked={isSelected}
        onCheckedChange={onToggle}
        className="mt-1"
      />
      {renderContent()}
    </div>
  );
};

export default SelectableItem;
