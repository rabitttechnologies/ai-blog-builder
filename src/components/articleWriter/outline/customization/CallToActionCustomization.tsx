
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
      description="Add a compelling call to action at the end of your article"
      isEnabled={isEnabled}
      onToggle={onToggle}
    >
      <div className="space-y-2">
        <Label>Call to Action Text</Label>
        <Textarea
          value={ctaText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Enter your call to action text"
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Examples: "Sign up for our newsletter", "Contact us for a consultation"
        </p>
      </div>
    </CustomizationSection>
  );
};

export default CallToActionCustomization;
