
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface SimpleCustomizationOptionsProps {
  humanized: boolean;
  comparison: boolean;
  expertQuotes: boolean;
  onHumanizedChange: (value: boolean) => void;
  onComparisonChange: (value: boolean) => void;
  onExpertQuotesChange: (value: boolean) => void;
}

const SimpleCustomizationOptions: React.FC<SimpleCustomizationOptionsProps> = ({
  humanized,
  comparison,
  expertQuotes,
  onHumanizedChange,
  onComparisonChange,
  onExpertQuotesChange
}) => {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-lg font-medium mb-2">Basic Options</h3>
      
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Generate Humanised Article</Label>
            <p className="text-sm text-muted-foreground">Create content with a more conversational tone</p>
          </div>
          <Switch checked={humanized} onCheckedChange={onHumanizedChange} />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Generate Comparison Table</Label>
            <p className="text-sm text-muted-foreground">Include a comparison table in your article</p>
          </div>
          <Switch checked={comparison} onCheckedChange={onComparisonChange} />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Include Expert Quotes</Label>
            <p className="text-sm text-muted-foreground">Add expert opinions and citations</p>
          </div>
          <Switch checked={expertQuotes} onCheckedChange={onExpertQuotesChange} />
        </div>
      </div>
    </div>
  );
};

export default SimpleCustomizationOptions;
