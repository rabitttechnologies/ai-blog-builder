
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PointOfView, pointOfViewOptions } from '@/context/articleWriter/ArticleWriterContext';

interface PointOfViewSelectorProps {
  value: PointOfView;
  onChange: (value: PointOfView) => void;
  disabled?: boolean;
}

const PointOfViewSelector: React.FC<PointOfViewSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as PointOfView)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select article point of view" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {pointOfViewOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default PointOfViewSelector;
