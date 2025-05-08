
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/Button';
import { Plus, X } from 'lucide-react';
import { ArticleOutlineCustomization } from '@/types/outlineCustomize';
import { getSavedGeneralGuidance } from '@/services/outlineCustomizeService';

interface OutlineCustomizeFormProps {
  customization: ArticleOutlineCustomization;
  onChange: (field: keyof ArticleOutlineCustomization, value: any) => void;
}

const OutlineCustomizeForm: React.FC<OutlineCustomizeFormProps> = ({
  customization,
  onChange
}) => {
  const [savedGuidance] = useState<string[]>(getSavedGeneralGuidance());

  const handleCheckboxChange = (field: keyof ArticleOutlineCustomization) => {
    onChange(field, !customization[field]);
  };

  const renderImageOptions = () => {
    if (!customization.includeImagesInArticle) return null;
    
    return (
      <div className="ml-6 space-y-4 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="imageType">Image Type</Label>
            <Select
              value={customization.imageType || ''}
              onValueChange={(value) => onChange('imageType', value)}
            >
              <SelectTrigger id="imageType">
                <SelectValue placeholder="Select image type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Copyright Image">Copyright Image</SelectItem>
                <SelectItem value="Non-Copyright">Non-Copyright</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="imageCount">Number of Images</Label>
            <Select
              value={customization.imageCount?.toString() || ''}
              onValueChange={(value) => onChange('imageCount', parseInt(value))}
            >
              <SelectTrigger id="imageCount">
                <SelectValue placeholder="Select count" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  };

  const renderInternalLinkOptions = () => {
    if (!customization.includeInternalLinks) return null;
    
    return (
      <div className="ml-6 space-y-4 mt-2">
        <div>
          <Label htmlFor="internalLinkCount">Number of Internal Links</Label>
          <Select
            value={customization.internalLinkCount?.toString() || ''}
            onValueChange={(value) => onChange('internalLinkCount', parseInt(value))}
          >
            <SelectTrigger id="internalLinkCount">
              <SelectValue placeholder="Select count" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {customization.internalLinkCount && customization.internalLinkCount > 0 && (
          <div className="space-y-2">
            <Label>Add Internal Links</Label>
            {Array.from({ length: customization.internalLinkCount }, (_, i) => i).map((index) => (
              <div key={`internal-link-${index}`} className="flex items-center gap-2">
                <Input
                  placeholder={`Internal link ${index + 1}`}
                  value={customization.internalLinks?.[index] || ''}
                  onChange={(e) => {
                    const updatedLinks = [...(customization.internalLinks || [])];
                    updatedLinks[index] = e.target.value;
                    onChange('internalLinks', updatedLinks);
                  }}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderExternalLinkOptions = () => {
    if (!customization.includeExternalLinks) return null;
    
    return (
      <div className="ml-6 space-y-4 mt-2">
        <div>
          <Label htmlFor="externalLinkCount">Number of External Links</Label>
          <Select
            value={customization.externalLinkCount?.toString() || ''}
            onValueChange={(value) => onChange('externalLinkCount', parseInt(value))}
          >
            <SelectTrigger id="externalLinkCount">
              <SelectValue placeholder="Select count" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  const renderCoverImageOptions = () => {
    if (!customization.generateCoverImage) return null;
    
    return (
      <div className="ml-6 space-y-4 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="coverImageType">Image Type</Label>
            <Select
              value={customization.coverImageType || ''}
              onValueChange={(value) => onChange('coverImageType', value)}
            >
              <SelectTrigger id="coverImageType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Anime">Anime</SelectItem>
                <SelectItem value="Illustration">Illustration</SelectItem>
                <SelectItem value="Fantasy">Fantasy</SelectItem>
                <SelectItem value="Watercolour">Watercolour</SelectItem>
                <SelectItem value="Isometric">Isometric</SelectItem>
                <SelectItem value="Realistic">Realistic</SelectItem>
                <SelectItem value="3D Render">3D Render</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="coverImageSize">Image Size</Label>
            <Select
              value={customization.coverImageSize || ''}
              onValueChange={(value) => onChange('coverImageSize', value)}
            >
              <SelectTrigger id="coverImageSize">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1200x628">1200x628 (Social Media)</SelectItem>
                <SelectItem value="1920x1080">1920x1080 (HD)</SelectItem>
                <SelectItem value="1080x1080">1080x1080 (Square)</SelectItem>
                <SelectItem value="1080x1350">1080x1350 (Portrait)</SelectItem>
                <SelectItem value="800x600">800x600 (Standard)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  };

  const renderCtaOptions = () => {
    if (!customization.includeCta) return null;
    
    return (
      <div className="ml-6 mt-2">
        <Label htmlFor="ctaText">Call-to-Action Text</Label>
        <Textarea
          id="ctaText"
          placeholder="Enter your call-to-action text"
          value={customization.ctaText || ''}
          onChange={(e) => onChange('ctaText', e.target.value)}
          className="mt-1"
        />
      </div>
    );
  };

  const renderFaqOptions = () => {
    if (!customization.generateFaqs) return null;
    
    return (
      <div className="ml-6 mt-2">
        <Label htmlFor="faqCount">Number of FAQs</Label>
        <Select
          value={customization.faqCount?.toString() || ''}
          onValueChange={(value) => onChange('faqCount', parseInt(value))}
        >
          <SelectTrigger id="faqCount">
            <SelectValue placeholder="Select count" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const renderGeneralGuidanceOptions = () => {
    if (!customization.includeGeneralGuidance) return null;
    
    return (
      <div className="ml-6 mt-2 space-y-2">
        <Label htmlFor="generalGuidance">General Guidance</Label>
        <Textarea
          id="generalGuidance"
          placeholder="Enter general guidance for writing"
          value={customization.generalGuidance || ''}
          onChange={(e) => onChange('generalGuidance', e.target.value)}
          className="mt-1"
          rows={4}
        />
        
        {savedGuidance.length > 0 && (
          <div className="mt-2">
            <Label>Saved Guidance</Label>
            <div className="mt-1 space-y-2">
              {savedGuidance.map((guidance, index) => (
                <div
                  key={`saved-guidance-${index}`}
                  className="p-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
                  onClick={() => onChange('generalGuidance', guidance)}
                >
                  {guidance.length > 100 ? guidance.substring(0, 100) + '...' : guidance}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pt-4">
      <h3 className="text-lg font-medium">Customize Options</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="generateHumanisedArticle" 
            checked={customization.generateHumanisedArticle || false}
            onCheckedChange={() => handleCheckboxChange('generateHumanisedArticle')}
          />
          <Label htmlFor="generateHumanisedArticle">Generate Humanised Article</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="generateComparisonTable" 
            checked={customization.generateComparisonTable || false}
            onCheckedChange={() => handleCheckboxChange('generateComparisonTable')}
          />
          <Label htmlFor="generateComparisonTable">Generate Comparison Table</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="includeExpertQuotes" 
            checked={customization.includeExpertQuotes || false}
            onCheckedChange={() => handleCheckboxChange('includeExpertQuotes')}
          />
          <Label htmlFor="includeExpertQuotes">Include Expert Quotes</Label>
        </div>
        
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="includeImagesInArticle" 
              checked={customization.includeImagesInArticle || false}
              onCheckedChange={() => handleCheckboxChange('includeImagesInArticle')}
            />
            <Label htmlFor="includeImagesInArticle">Include Images in Article</Label>
          </div>
          {renderImageOptions()}
        </div>
        
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="includeInternalLinks" 
              checked={customization.includeInternalLinks || false}
              onCheckedChange={() => handleCheckboxChange('includeInternalLinks')}
            />
            <Label htmlFor="includeInternalLinks">Internal Links</Label>
          </div>
          {renderInternalLinkOptions()}
        </div>
        
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="includeExternalLinks" 
              checked={customization.includeExternalLinks || false}
              onCheckedChange={() => handleCheckboxChange('includeExternalLinks')}
            />
            <Label htmlFor="includeExternalLinks">External Links</Label>
          </div>
          {renderExternalLinkOptions()}
        </div>
        
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="generateCoverImage" 
              checked={customization.generateCoverImage || false}
              onCheckedChange={() => handleCheckboxChange('generateCoverImage')}
            />
            <Label htmlFor="generateCoverImage">Generate Cover Image</Label>
          </div>
          {renderCoverImageOptions()}
        </div>
        
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="includeCta" 
              checked={customization.includeCta || false}
              onCheckedChange={() => handleCheckboxChange('includeCta')}
            />
            <Label htmlFor="includeCta">Include a Call-to-action</Label>
          </div>
          {renderCtaOptions()}
        </div>
        
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="generateFaqs" 
              checked={customization.generateFaqs || false}
              onCheckedChange={() => handleCheckboxChange('generateFaqs')}
            />
            <Label htmlFor="generateFaqs">Generate FAQs</Label>
          </div>
          {renderFaqOptions()}
        </div>
        
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="includeGeneralGuidance" 
              checked={customization.includeGeneralGuidance || false}
              onCheckedChange={() => handleCheckboxChange('includeGeneralGuidance')}
            />
            <Label htmlFor="includeGeneralGuidance">General Guidance for writing</Label>
          </div>
          {renderGeneralGuidanceOptions()}
        </div>
      </div>
    </div>
  );
};

export default OutlineCustomizeForm;
