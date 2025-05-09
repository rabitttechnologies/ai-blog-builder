
import React from 'react';
import { OutlineOption } from '@/types/outlineCustomize';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Edit, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface OutlineDisplayProps {
  outline: OutlineOption;
  isEditing: boolean;
  editedContent: string;
  onEdit: () => void;
  onEditChange: (content: string) => void;
  onSelect: () => void;
  isSelected?: boolean;
  index: number;
}

const OutlineDisplay: React.FC<OutlineDisplayProps> = ({
  outline,
  isEditing,
  editedContent,
  onEdit,
  onEditChange,
  onSelect,
  isSelected = false,
  index
}) => {
  return (
    <Card className={`border-2 transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/40'}`}>
      <CardContent className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <Label htmlFor={`edit-outline-${outline.id}`}>Edit Outline</Label>
            <Textarea
              id={`edit-outline-${outline.id}`}
              value={editedContent}
              onChange={(e) => onEditChange(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Enter your outline in markdown format. Use ## for main headings and ### for subheadings."
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onEdit}>
                Cancel
              </Button>
              <Button onClick={onSelect}>
                Save & Use This Outline
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">Outline {index + 1}</h3>
                {isSelected && (
                  <span className="bg-primary text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <Check className="h-3 w-3 mr-1" /> Selected
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {outline.parsed.headings.length > 0 ? (
                  outline.parsed.headings.map((heading, idx) => (
                    <div 
                      key={idx} 
                      className="text-sm"
                      style={{
                        paddingLeft: `${(heading.level - 1) * 16}px`,
                        fontWeight: heading.level === 2 ? 600 : heading.level === 1 ? 700 : 400
                      }}
                    >
                      {heading.title}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">
                    No headings found in outline. Click "Edit Outline" to modify.
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Outline
              </Button>
              <Button 
                onClick={onSelect}
                variant={isSelected ? "secondary" : "default"}
              >
                {isSelected ? "Selected" : "Use This Outline"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OutlineDisplay;
