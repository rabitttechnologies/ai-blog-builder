
import React from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CustomOutlineEditorProps {
  value: string;
  onChange: (value: string) => void;
  isSelected: boolean;
  onSelect: () => void;
}

const CustomOutlineEditor: React.FC<CustomOutlineEditorProps> = ({
  value,
  onChange,
  isSelected,
  onSelect
}) => {
  return (
    <Card 
      className={`p-4 border-2 ${isSelected ? "border-primary bg-primary/5" : "border-gray-200"}`}
      onClick={onSelect}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="custom-outline" className="font-semibold text-lg">Create Custom Outline</Label>
        </div>
        
        <Textarea
          id="custom-outline"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[200px] resize-y"
          placeholder="Create your own outline structure here. Use ## for main headings and ### for subheadings."
          onClick={(e) => e.stopPropagation()}
        />
        
        <p className="text-sm text-muted-foreground">
          Use markdown syntax for headings (## for main headings, ### for subheadings). 
          Each heading will be a section in your article.
        </p>
      </div>
    </Card>
  );
};

export default CustomOutlineEditor;
