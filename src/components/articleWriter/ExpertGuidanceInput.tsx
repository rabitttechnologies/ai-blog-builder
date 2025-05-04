
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface ExpertGuidanceInputProps {
  value: string;
  onChange: (value: string) => void;
  saveForLater: boolean;
  onToggleSave: (value: boolean) => void;
  savedGuidance: string[];
  onSelectSaved: (guidance: string) => void;
}

const ExpertGuidanceInput: React.FC<ExpertGuidanceInputProps> = ({
  value,
  onChange,
  saveForLater,
  onToggleSave,
  savedGuidance,
  onSelectSaved
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Expert Guidance (Optional)</Label>
        <div className="flex items-center space-x-2">
          <Switch
            id="save-guidance"
            checked={saveForLater}
            onCheckedChange={onToggleSave}
          />
          <Label htmlFor="save-guidance" className="text-sm">Save for Future Use</Label>
        </div>
      </div>
      
      <Textarea
        placeholder="Provide specific instructions for the AI to follow when writing your article..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="resize-y min-h-[100px]"
      />
      
      {savedGuidance.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm">Saved Guidance</Label>
          <div className="flex flex-wrap gap-2">
            {savedGuidance.map((guidance, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onSelectSaved(guidance)}
                className="inline-block px-3 py-1 text-xs rounded-full bg-secondary/50 hover:bg-secondary transition-colors truncate max-w-[200px]"
                title={guidance}
              >
                {guidance.length > 30 ? `${guidance.substring(0, 30)}...` : guidance}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertGuidanceInput;
