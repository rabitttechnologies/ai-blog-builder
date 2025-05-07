
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CustomizationSection from './CustomizationSection';

interface LinksCustomizationProps {
  isInternalEnabled: boolean;
  internalLinkCount: number;
  internalLinkUrls: string[];
  isExternalEnabled: boolean;
  externalLinkCount: number;
  onInternalToggle: (enabled: boolean) => void;
  onInternalCountChange: (count: number) => void;
  onInternalLinkUpdate: (index: number, url: string) => void;
  onExternalToggle: (enabled: boolean) => void;
  onExternalCountChange: (count: number) => void;
}

const LinksCustomization: React.FC<LinksCustomizationProps> = ({
  isInternalEnabled,
  internalLinkCount,
  internalLinkUrls,
  isExternalEnabled,
  externalLinkCount,
  onInternalToggle,
  onInternalCountChange,
  onInternalLinkUpdate,
  onExternalToggle,
  onExternalCountChange
}) => {
  return (
    <div className="space-y-6">
      {/* Internal Links Section */}
      <CustomizationSection
        title="Internal Links"
        description="Add links to your own content"
        isEnabled={isInternalEnabled}
        onToggle={onInternalToggle}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="internal-link-count">Number of Internal Links</Label>
            <Select 
              value={internalLinkCount.toString()} 
              onValueChange={(value) => onInternalCountChange(parseInt(value))}
            >
              <SelectTrigger id="internal-link-count">
                <SelectValue placeholder="Select count" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Internal Link URLs</Label>
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
              {internalLinkUrls.map((url, index) => (
                <Input
                  key={`internal-link-${index}`}
                  placeholder={`URL for link ${index + 1}`}
                  value={url}
                  onChange={(e) => onInternalLinkUpdate(index, e.target.value)}
                />
              ))}
            </div>
          </div>
        </div>
      </CustomizationSection>
      
      {/* External Links Section */}
      <CustomizationSection
        title="External Links"
        description="Add links to external resources"
        isEnabled={isExternalEnabled}
        onToggle={onExternalToggle}
      >
        <div className="space-y-2">
          <Label htmlFor="external-link-count">Number of External Links</Label>
          <Select 
            value={externalLinkCount.toString()} 
            onValueChange={(value) => onExternalCountChange(parseInt(value))}
          >
            <SelectTrigger id="external-link-count">
              <SelectValue placeholder="Select count" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CustomizationSection>
    </div>
  );
};

export default LinksCustomization;
