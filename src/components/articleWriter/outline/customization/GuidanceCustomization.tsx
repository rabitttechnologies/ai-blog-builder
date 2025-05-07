
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { Check, Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import CustomizationSection from './CustomizationSection';

interface GuidanceCustomizationProps {
  isEnabled: boolean;
  guidanceText: string;
  savedGuidance: string[];
  onToggle: (enabled: boolean) => void;
  onTextChange: (text: string) => void;
  onSaveGuidance: (text: string) => void;
}

const GuidanceCustomization: React.FC<GuidanceCustomizationProps> = ({
  isEnabled,
  guidanceText,
  savedGuidance,
  onToggle,
  onTextChange,
  onSaveGuidance
}) => {
  const [saveForLater, setSaveForLater] = useState(false);
  const [selectedSaved, setSelectedSaved] = useState<number | null>(null);
  
  const handleSelectSaved = (index: number, text: string) => {
    setSelectedSaved(index);
    onTextChange(text);
  };
  
  const handleSaveGuidance = () => {
    if (guidanceText.trim()) {
      onSaveGuidance(guidanceText);
      setSaveForLater(false);
    }
  };
  
  return (
    <CustomizationSection
      title="General Guidance for Writing"
      description="Add specific instructions for the AI writer"
      isEnabled={isEnabled}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Writing Guidance</Label>
          <Textarea
            value={guidanceText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Enter guidance for the AI writer (e.g., tone, perspective, emphasis)"
            rows={4}
          />
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={saveForLater}
                onCheckedChange={setSaveForLater}
                id="save-guidance"
              />
              <Label htmlFor="save-guidance" className="text-sm cursor-pointer">
                Save for later use
              </Label>
            </div>
            
            {saveForLater && (
              <Button 
                size="sm" 
                onClick={handleSaveGuidance}
                disabled={!guidanceText.trim()}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            )}
          </div>
        </div>
        
        {savedGuidance.length > 0 && (
          <div className="space-y-2">
            <Label>Saved Guidance</Label>
            <ScrollArea className="h-48 rounded-md border p-2">
              <div className="space-y-2">
                {savedGuidance.map((guidance, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "p-2 rounded-md cursor-pointer flex items-center justify-between",
                      selectedSaved === index ? "bg-primary/10" : "hover:bg-muted"
                    )}
                    onClick={() => handleSelectSaved(index, guidance)}
                  >
                    <p className="text-sm line-clamp-2">{guidance}</p>
                    {selectedSaved === index && (
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </CustomizationSection>
  );
};

export default GuidanceCustomization;
