
import React from 'react';
import { WritingStyle } from '@/context/articleWriter/ArticleWriterContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface WritingStyleSelectorProps {
  styles: WritingStyle[];
  selectedStyleId: string | undefined;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

const WritingStyleSelector: React.FC<WritingStyleSelectorProps> = ({
  styles,
  selectedStyleId,
  onSelect,
  disabled = false
}) => {
  if (styles.length === 0) {
    return null;
  }

  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <h4 className="font-medium text-sm mb-3">Saved Writing Styles</h4>
      <RadioGroup 
        value={selectedStyleId}
        onValueChange={onSelect}
        className="space-y-2"
        disabled={disabled}
      >
        {styles.map((style) => (
          <div key={style.id} className="flex items-start space-x-2">
            <RadioGroupItem 
              value={style.id} 
              id={`style-${style.id}`} 
              className="mt-1"
            />
            <Label 
              htmlFor={`style-${style.id}`}
              className="flex flex-col cursor-pointer"
            >
              <span className="font-medium">{style.name}</span>
              <span className="text-xs text-gray-600">{style.description}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default WritingStyleSelector;
