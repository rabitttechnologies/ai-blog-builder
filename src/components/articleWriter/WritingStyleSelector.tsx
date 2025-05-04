
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WritingStyle } from '@/types/articleWriter';
import { PlusCircle, Save, X } from 'lucide-react';

interface WritingStyleSelectorProps {
  savedStyles: WritingStyle[];
  selectedStyle: WritingStyle | null;
  onSelectStyle: (style: WritingStyle | null) => void;
  onAddStyle: (style: WritingStyle) => void;
}

const WritingStyleSelector: React.FC<WritingStyleSelectorProps> = ({
  savedStyles,
  selectedStyle,
  onSelectStyle,
  onAddStyle
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [styleName, setStyleName] = useState('');
  const [styleDescription, setStyleDescription] = useState('');
  
  const handleCreateStyle = () => {
    if (styleName.trim() && styleDescription.trim()) {
      const newStyle: WritingStyle = {
        id: `style-${Date.now()}`,
        name: styleName.trim(),
        description: styleDescription.trim(),
        isSaved: true
      };
      
      onAddStyle(newStyle);
      onSelectStyle(newStyle);
      setDialogOpen(false);
      resetForm();
    }
  };
  
  const resetForm = () => {
    setStyleName('');
    setStyleDescription('');
  };
  
  const handleCustomStyle = () => {
    onSelectStyle(null);
    setDialogOpen(true);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label className="text-base font-medium">Writing Style</Label>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleCustomStyle}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Writing Style
        </Button>
      </div>
      
      {savedStyles.length > 0 ? (
        <RadioGroup
          value={selectedStyle?.id || ''}
          onValueChange={(value) => {
            const style = savedStyles.find(s => s.id === value);
            onSelectStyle(style || null);
          }}
          className="grid grid-cols-1 gap-3 pt-2"
        >
          {savedStyles.map((style) => (
            <div key={style.id} className="flex items-center">
              <RadioGroupItem value={style.id} id={`style-${style.id}`} className="peer sr-only" />
              <Label
                htmlFor={`style-${style.id}`}
                className="flex flex-1 cursor-pointer items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-medium leading-none">{style.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{style.description}</div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <div className="text-sm text-muted-foreground py-2">
          No saved writing styles. Create a custom writing style to get started.
        </div>
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Writing Style</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="style-name">Style Name</Label>
              <Input
                id="style-name"
                placeholder="e.g., Professional, Casual, Academic"
                value={styleName}
                onChange={(e) => setStyleName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="style-description">Style Description</Label>
              <Textarea
                id="style-description"
                placeholder="Describe the tone, language, and approach for this writing style..."
                rows={4}
                value={styleDescription}
                onChange={(e) => setStyleDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                resetForm();
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateStyle}
              disabled={!styleName.trim() || !styleDescription.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Style
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WritingStyleSelector;
