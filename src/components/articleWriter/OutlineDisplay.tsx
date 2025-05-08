
import React from 'react';
import { OutlineOption } from '@/types/outlineCustomize';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Edit } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface OutlineDisplayProps {
  outline: OutlineOption;
  isEditing: boolean;
  editedContent: string;
  onEdit: () => void;
  onEditChange: (content: string) => void;
  onSelect: () => void;
}

const OutlineDisplay: React.FC<OutlineDisplayProps> = ({
  outline,
  isEditing,
  editedContent,
  onEdit,
  onEditChange,
  onSelect
}) => {
  return (
    <Card className="border-2 hover:border-primary/40">
      <CardContent className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <Label htmlFor={`edit-outline-${outline.id}`}>Edit Outline</Label>
            <Textarea
              id={`edit-outline-${outline.id}`}
              value={editedContent}
              onChange={(e) => onEditChange(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onEdit}>
                Cancel
              </Button>
              <Button onClick={onSelect}>
                Use This Outline
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <h3 className="font-bold text-lg">Outline Preview</h3>
              <div className="space-y-2">
                {outline.parsed.headings.map((heading, idx) => (
                  <div key={idx} className={`pl-${heading.level * 4} ${heading.level === 1 ? 'font-bold text-base' : heading.level === 2 ? 'font-semibold text-sm' : 'text-sm'}`}>
                    {heading.title}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Outline
              </Button>
              <Button onClick={onSelect}>
                Use This Outline
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OutlineDisplay;
