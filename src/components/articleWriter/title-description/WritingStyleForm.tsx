
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { WritingStyle } from '@/context/articleWriter/ArticleWriterContext';
import WritingStyleSelector from './WritingStyleSelector';

interface WritingStyleFormProps {
  styles: WritingStyle[];
  selectedStyleId?: string;
  customStyle: string;
  onSelectStyle: (styleId: string) => void;
  onCustomStyleChange: (value: string) => void;
  onCreateStyle: (style: Omit<WritingStyle, 'id'>) => void;
  disabled?: boolean;
}

const WritingStyleForm: React.FC<WritingStyleFormProps> = ({
  styles,
  selectedStyleId,
  customStyle,
  onSelectStyle,
  onCustomStyleChange,
  onCreateStyle,
  disabled = false
}) => {
  // Get the selected style if there is one
  const selectedStyle = selectedStyleId 
    ? styles.find(style => style.id === selectedStyleId) 
    : undefined;
  
  return (
    <div className="space-y-4">
      <WritingStyleSelector
        styles={styles}
        selectedStyleId={selectedStyleId}
        customStyle={customStyle}
        onSelectStyle={onSelectStyle}
        onCustomStyleChange={onCustomStyleChange}
        onCreateStyle={onCreateStyle}
        disabled={disabled}
      />
      
      <div className="space-y-2">
        <Label htmlFor="writing-style">
          {selectedStyle ? "Selected Style" : "Define Writing Style"}
        </Label>
        <Textarea
          id="writing-style"
          placeholder="Describe your preferred tone, style, and voice for this article..."
          value={selectedStyle ? selectedStyle.description : customStyle}
          onChange={(e) => {
            if (!selectedStyle) {
              onCustomStyleChange(e.target.value);
            }
          }}
          className="min-h-[120px]"
          disabled={disabled || !!selectedStyle}
        />
        {selectedStyle && (
          <p className="text-sm text-muted-foreground">
            Using saved style: "{selectedStyle.name}". To customize, clear the selection above.
          </p>
        )}
      </div>
    </div>
  );
};

export default WritingStyleForm;
