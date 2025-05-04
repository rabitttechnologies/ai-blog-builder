
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { headingsOptions } from '@/types/articleWriter';

interface HeadingsCountSelectorProps {
  value: string | null;
  onChange: (value: string) => void;
}

const HeadingsCountSelector: React.FC<HeadingsCountSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">Number of Headings</Label>
      <RadioGroup
        value={value || ''}
        onValueChange={onChange}
        className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2 lg:grid-cols-3"
      >
        {headingsOptions.map((option) => (
          <div key={option.id} className="flex items-center">
            <RadioGroupItem value={option.id} id={`headings-${option.id}`} className="peer sr-only" />
            <Label
              htmlFor={`headings-${option.id}`}
              className="flex flex-1 cursor-pointer items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="flex flex-col gap-1">
                <div className="text-sm font-medium leading-none">{option.label}</div>
                <div className="text-xs text-muted-foreground">{option.wordCount}</div>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default HeadingsCountSelector;
