
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import type { OutlinePromptResponse, OutlinePromptFormData } from '@/hooks/clustering/useOutlinePrompt';

interface OutlinePromptEditorProps {
  data: OutlinePromptResponse;
  formData: OutlinePromptFormData;
  onUpdateField: (field: keyof OutlinePromptFormData, value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const OutlinePromptEditor: React.FC<OutlinePromptEditorProps> = ({
  data,
  formData,
  onUpdateField,
  onBack,
  onSubmit,
  isLoading
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        
        <h2 className="text-2xl font-semibold">Outline and Prompt for Body</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Non-editable info */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Primary Keyword</Label>
                <p className="font-medium">{data["Primary Keyword"]}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Keyword</Label>
                <p className="font-medium">{data.Keyword}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Blog ID</Label>
                <p className="font-medium">{data["Blog id"]}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Key Takeaways</Label>
                <p className="whitespace-pre-line">{data.key_takeaways}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Editable fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-muted-foreground">(editable)</span>
            </Label>
            <Input 
              id="title"
              value={formData.title}
              onChange={(e) => onUpdateField('title', e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="alternateTitle" className="text-sm font-medium">
              Alternate Title <span className="text-muted-foreground">(editable)</span>
            </Label>
            <Input 
              id="alternateTitle"
              value={formData.alternateTitle}
              onChange={(e) => onUpdateField('alternateTitle', e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="targetAudience" className="text-sm font-medium">
              Target Audience <span className="text-muted-foreground">(editable)</span>
            </Label>
            <Input 
              id="targetAudience"
              value={formData.targetAudience}
              onChange={(e) => onUpdateField('targetAudience', e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="goal" className="text-sm font-medium">
              Goal <span className="text-muted-foreground">(editable)</span>
            </Label>
            <Input 
              id="goal"
              value={formData.goal}
              onChange={(e) => onUpdateField('goal', e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Full width fields */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="outline" className="text-sm font-medium">
            Outline <span className="text-muted-foreground">(editable)</span>
          </Label>
          <Textarea 
            id="outline"
            value={formData.outline}
            onChange={(e) => onUpdateField('outline', e.target.value)}
            className="min-h-[200px] w-full"
          />
        </div>
        
        <div>
          <Label htmlFor="promptForBody" className="text-sm font-medium">
            Prompt for Writing Body <span className="text-muted-foreground">(editable)</span>
          </Label>
          <Textarea 
            id="promptForBody"
            value={formData.promptForBody}
            onChange={(e) => onUpdateField('promptForBody', e.target.value)}
            className="min-h-[200px] w-full"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-4 pb-8">
        <Button 
          onClick={onSubmit} 
          disabled={isLoading}
          size="lg"
        >
          Get the Blog Body
        </Button>
      </div>
    </div>
  );
};

export default OutlinePromptEditor;
