
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, BookmarkPlus } from 'lucide-react';
import CustomizationSection from './CustomizationSection';

interface GuidanceCustomizationProps {
  isEnabled: boolean;
  guidanceText: string;
  savedGuidance: string[];
  onToggle: (enabled: boolean) => void;
  onTextChange: (text: string) => void;
  onSaveGuidance: (guidance: string) => void;
}

const GuidanceCustomization: React.FC<GuidanceCustomizationProps> = ({
  isEnabled,
  guidanceText,
  savedGuidance,
  onToggle,
  onTextChange,
  onSaveGuidance
}) => {
  const [selectedGuidance, setSelectedGuidance] = useState<string>('');

  const handleSaveGuidance = () => {
    if (guidanceText.trim()) {
      onSaveGuidance(guidanceText.trim());
    }
  };

  const handleSelectGuidance = (value: string) => {
    setSelectedGuidance(value);
    onTextChange(value);
  };

  return (
    <CustomizationSection
      title="General Guidance for Writing"
      description="Add specific instructions for article creation"
      isEnabled={isEnabled}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        {savedGuidance && savedGuidance.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="saved-guidance">Use Saved Guidance</Label>
            <Select 
              value={selectedGuidance} 
              onValueChange={handleSelectGuidance}
            >
              <SelectTrigger id="saved-guidance">
                <SelectValue placeholder="Select saved guidance" />
              </SelectTrigger>
              <SelectContent>
                {savedGuidance.map((guidance, index) => (
                  <SelectItem key={index} value={guidance}>
                    {guidance.length > 50 ? `${guidance.substring(0, 50)}...` : guidance}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="guidance-text">Guidance Text</Label>
          <Textarea
            id="guidance-text"
            value={guidanceText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Enter guidance for article creation"
            className="min-h-[150px] resize-y"
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSaveGuidance}
            disabled={!guidanceText.trim()}
          >
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Save Guidance for Later
          </Button>
        </div>
      </div>
    </CustomizationSection>
  );
};

export default GuidanceCustomization;
