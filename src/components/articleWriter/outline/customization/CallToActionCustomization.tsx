
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import CustomizationSection from './CustomizationSection';

interface CallToActionCustomizationProps {
  isEnabled: boolean;
  ctaText: string;
  onToggle: (enabled: boolean) => void;
  onTextChange: (text: string) => void;
}

const CallToActionCustomization: React.FC<CallToActionCustomizationProps> = ({
  isEnabled,
  ctaText,
  onToggle,
  onTextChange
}) => {
  return (
    <CustomizationSection
      title="Include Call to Action"
      description="Add a call to action at the end of your article"
      isEnabled={isEnabled}
      onToggle={onToggle}
    >
      <div className="space-y-2">
        <Label htmlFor="cta-text">Call to Action Text</Label>
        <Textarea
          id="cta-text"
          value={ctaText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Enter your call to action text"
          className="min-h-[100px] resize-y"
        />
        <p className="text-xs text-muted-foreground">
          Write a compelling call to action that encourages readers to take the next step.
        </p>
      </div>
    </CustomizationSection>
  );
};

export default CallToActionCustomization;
