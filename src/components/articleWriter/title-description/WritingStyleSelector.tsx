
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WritingStyle } from '@/context/articleWriter/ArticleWriterContext';
import WritingStyleCreator from './WritingStyleCreator';

interface WritingStyleSelectorProps {
  styles: WritingStyle[];
  selectedStyleId?: string;
  customStyle: string;
  onSelectStyle: (styleId: string) => void;
  onCustomStyleChange: (value: string) => void;
  onCreateStyle: (style: Omit<WritingStyle, 'id'>) => void;
  disabled?: boolean;
}

const WritingStyleSelector: React.FC<WritingStyleSelectorProps> = ({
  styles,
  selectedStyleId,
  customStyle,
  onSelectStyle,
  onCustomStyleChange,
  onCreateStyle,
  disabled = false
}) => {
  // If we have saved styles, show them in a dropdown
  if (styles.length > 0) {
    return (
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
          <Select
            value={selectedStyleId || ''}
            onValueChange={onSelectStyle}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a writing style" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Saved Styles</SelectLabel>
                {styles.map((style) => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <WritingStyleCreator onSave={onCreateStyle} disabled={disabled} />
      </div>
    );
  }

  // If no saved styles, just show the create button
  return <WritingStyleCreator onSave={onCreateStyle} disabled={disabled} />;
};

export default WritingStyleSelector;
