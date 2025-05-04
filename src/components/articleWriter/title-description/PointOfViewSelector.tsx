
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
  // Using a basic select implementation for simplicity
  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value as PointOfView)}
      disabled={disabled}
      className="w-full border border-gray-300 rounded-md p-2"
    >
      {pointOfViewOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default PointOfViewSelector;
