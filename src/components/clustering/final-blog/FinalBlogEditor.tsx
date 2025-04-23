
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import type { FinalBlogResponse, FinalBlogFormData } from '@/hooks/clustering/useFinalBlogCreation';

interface FinalBlogEditorProps {
  data: FinalBlogResponse;
  formData: FinalBlogFormData;
  onUpdateField: (field: keyof FinalBlogFormData, value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const FinalBlogEditor: React.FC<FinalBlogEditorProps> = ({
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
        
        <h2 className="text-2xl font-semibold">Final Blog Content</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Non-editable info */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Primary Keyword</Label>
                <p className="font-medium">{data["original Keyword"]}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Keywords</Label>
                <p className="font-medium">{data.Keywords}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Blog ID</Label>
                <p className="font-medium">{data.BlogId}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Meta Description</Label>
                <p className="whitespace-pre-line">{data["Meta description"]}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Image Prompt</Label>
                <p className="whitespace-pre-line">{data["Image Prompt"]}</p>
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
        </div>
      </div>

      {/* Full width article field */}
      <div>
        <Label htmlFor="finalArticle" className="text-sm font-medium">
          Final Article <span className="text-muted-foreground">(editable)</span>
        </Label>
        <Textarea 
          id="finalArticle"
          value={formData.finalArticle}
          onChange={(e) => onUpdateField('finalArticle', e.target.value)}
          className="min-h-[500px] w-full"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-4 pb-8">
        <Button 
          onClick={onSubmit} 
          disabled={isLoading}
          size="lg"
        >
          Save The Blog
        </Button>
      </div>
    </div>
  );
};

export default FinalBlogEditor;
