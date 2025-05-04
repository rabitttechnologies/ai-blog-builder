
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { pointOfViewOptions, ArticlePointOfView } from '@/types/articleWriter';

interface PointOfViewSelectorProps {
  value: ArticlePointOfView;
  onChange: (value: ArticlePointOfView) => void;
}

const PointOfViewSelector: React.FC<PointOfViewSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">Article Point of View</Label>
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as ArticlePointOfView)}
        className="grid grid-cols-1 gap-3 pt-2"
      >
        {pointOfViewOptions.map((option) => (
          <div key={option.id} className="flex items-center">
            <RadioGroupItem value={option.value} id={`pov-${option.id}`} className="peer sr-only" />
            <Label
              htmlFor={`pov-${option.id}`}
              className="flex flex-1 cursor-pointer items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="flex flex-col gap-1">
                <div className="text-sm font-medium leading-none">{option.label}</div>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default PointOfViewSelector;
