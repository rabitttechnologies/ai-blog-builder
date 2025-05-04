
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Textarea from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { WritingStyle } from '@/context/articleWriter/ArticleWriterContext';
import WritingStyleSelector from './WritingStyleSelector';
import WritingStyleCreator from './WritingStyleCreator';

interface WritingStyleFormProps {
  styles: WritingStyle[];
  selectedStyleId: string | undefined;
  customStyle: string;
  onSelectStyle: (id: string) => void;
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
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="space-y-4">
      {styles.length > 0 && (
        <div className="space-y-2">
          <WritingStyleSelector
            styles={styles}
            selectedStyleId={selectedStyleId}
            onSelect={onSelectStyle}
            disabled={disabled}
          />
          <div className="text-xs text-gray-500">
            Or write your own style below
          </div>
        </div>
      )}
      
      {!isCreating ? (
        <div className="space-y-4">
          <Textarea
            placeholder="Write the tone and style for your article..."
            value={customStyle}
            onChange={(e) => onCustomStyleChange(e.target.value)}
            className="min-h-[100px]"
            disabled={disabled}
          />
          
          {customStyle && !selectedStyleId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreating(true)}
              className="flex items-center"
              disabled={disabled}
            >
              <Plus className="h-4 w-4 mr-1" />
              Save as Writing Style
            </Button>
          )}
        </div>
      ) : (
        <WritingStyleCreator
          description={customStyle}
          onCancel={() => setIsCreating(false)}
          onSave={(name) => {
            onCreateStyle({ name, description: customStyle });
            setIsCreating(false);
          }}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default WritingStyleForm;
