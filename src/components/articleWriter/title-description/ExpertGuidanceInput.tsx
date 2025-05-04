
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ExpertGuidanceInputProps {
  value: string;
  onChange: (value: string) => void;
  saveForFuture: boolean;
  onSaveForFutureChange: (save: boolean) => void;
  disabled?: boolean;
}

const ExpertGuidanceInput: React.FC<ExpertGuidanceInputProps> = ({
  value,
  onChange,
  saveForFuture,
  onSaveForFutureChange,
  disabled = false
}) => {
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Add any specific instructions for the AI here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px]"
        disabled={disabled}
      />
      <div className="flex items-center space-x-2">
        <Switch
          id="save-guidance"
          checked={saveForFuture}
          onCheckedChange={onSaveForFutureChange}
          disabled={disabled}
        />
        <Label htmlFor="save-guidance" className="cursor-pointer">
          Save for Future Use
        </Label>
      </div>
    </div>
  );
};

export default ExpertGuidanceInput;
