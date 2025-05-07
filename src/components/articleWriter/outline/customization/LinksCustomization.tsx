
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
    <>
      <CustomizationSection
        title="Internal Links"
        description="Add links to other pages on your website"
        isEnabled={isInternalEnabled}
        onToggle={onInternalToggle}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Number of Links</Label>
            <Select 
              value={internalLinkCount.toString()} 
              onValueChange={(value) => onInternalCountChange(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select number of links" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({length: 10}, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'link' : 'links'}
                  </SelectItem>
                ))}
                <SelectItem value="15">15 links</SelectItem>
                <SelectItem value="20">20 links</SelectItem>
                <SelectItem value="25">25 links</SelectItem>
                <SelectItem value="30">30 links</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Link URLs</Label>
            <div className="space-y-2">
              {internalLinkUrls.map((url, index) => (
                <Input
                  key={index}
                  value={url}
                  onChange={(e) => onInternalLinkUpdate(index, e.target.value)}
                  placeholder={`Link ${index + 1} URL`}
                  className="max-w-md"
                />
              ))}
            </div>
          </div>
        </div>
      </CustomizationSection>
      
      <CustomizationSection
        title="External Links"
        description="Add links to external websites"
        isEnabled={isExternalEnabled}
        onToggle={onExternalToggle}
      >
        <div className="space-y-2">
          <Label>Number of Links</Label>
          <Select 
            value={externalLinkCount.toString()} 
            onValueChange={(value) => onExternalCountChange(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select number of links" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({length: 10}, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'link' : 'links'}
                </SelectItem>
              ))}
              <SelectItem value="15">15 links</SelectItem>
              <SelectItem value="20">20 links</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CustomizationSection>
    </>
  );
};

export default LinksCustomization;
