
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { HeadingCount, headingCountOptions } from '@/context/articleWriter/ArticleWriterContext';

interface HeadingCountSelectorProps {
  value: HeadingCount;
  onChange: (value: HeadingCount) => void;
  disabled?: boolean;
}

const HeadingCountSelector: React.FC<HeadingCountSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <RadioGroup
      value={value}
      onValueChange={(val) => onChange(val as HeadingCount)}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      disabled={disabled}
    >
      {headingCountOptions.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem value={option.value} id={`heading-count-${option.value}`} />
          <Label 
            htmlFor={`heading-count-${option.value}`}
            className="flex flex-col cursor-pointer"
          >
            <span className="font-medium">{option.label}</span>
            <span className="text-xs text-gray-500">{option.wordCount}</span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default HeadingCountSelector;
