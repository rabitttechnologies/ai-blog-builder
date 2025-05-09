
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ExpertGuidanceInputProps {
  value: string;
  onChange: (value: string, shouldSave?: boolean) => void;
}

const ExpertGuidanceInput: React.FC<ExpertGuidanceInputProps> = ({ value, onChange }) => {
  // For demo purposes, some example guidance templates
  const exampleGuidance = [
    {
      id: 'beginner-friendly',
      title: 'Beginner Friendly',
      content: 'Keep the article beginner-friendly. Avoid jargon and technical terms without explanation. Include clear definitions for industry-specific concepts.'
    },
    {
      id: 'data-driven',
      title: 'Data-Driven',
      content: 'Include statistical data and research findings to support key points. Cite credible sources and include links to studies when possible.'
    },
    {
      id: 'actionable',
      title: 'Actionable Steps',
      content: 'Structure the article with clear, actionable steps the reader can follow. Include specific examples for each tip or recommendation.'
    }
  ];

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSelectTemplate = (content: string) => {
    onChange(content, true);
    setDialogOpen(false);
  };

  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Add specific instructions or expert guidance for this article..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px]"
      />
      <Button 
        type="button" 
        variant="outline" 
        size="sm"
        onClick={() => setDialogOpen(true)}
        className="mt-2"
      >
        Use Template
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Expert Guidance Templates</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-4 pt-2">
              {exampleGuidance.map((template) => (
                <div 
                  key={template.id} 
                  className="border rounded-md p-4 cursor-pointer hover:bg-accent/50"
                  onClick={() => handleSelectTemplate(template.content)}
                >
                  <h3 className="font-medium mb-2">{template.title}</h3>
                  <p className="text-sm text-muted-foreground">{template.content}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpertGuidanceInput;
