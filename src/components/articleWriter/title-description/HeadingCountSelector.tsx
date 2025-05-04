
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HeadingCount, HeadingCountOption, headingCountOptions } from '@/context/articleWriter/ArticleWriterContext';

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
    <Select
      value={value}
      onValueChange={(val) => onChange(val as HeadingCount)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select number of headings" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {headingCountOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex flex-col">
                <span>{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.wordCount}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default HeadingCountSelector;
