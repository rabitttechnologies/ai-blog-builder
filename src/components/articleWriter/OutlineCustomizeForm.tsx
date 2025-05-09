
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArticleOutlineCustomization } from '@/types/outlineCustomize';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface OutlineCustomizeFormProps {
  customizationOptions: ArticleOutlineCustomization;
  onChange: (field: keyof ArticleOutlineCustomization, value: any) => void;
}

const OutlineCustomizeForm: React.FC<OutlineCustomizeFormProps> = ({ customizationOptions, onChange }) => {
  const [expandedSections, setExpandedSections] = React.useState<{
    images: boolean;
    links: boolean;
    advanced: boolean;
  }>({
    images: false,
    links: false,
    advanced: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-5">
      {/* Basic options */}
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="humanized" className="flex-1 cursor-pointer">Humanized Content</Label>
          <Switch 
            id="humanized" 
            checked={customizationOptions.generateHumanisedArticle || false} 
            onCheckedChange={value => onChange('generateHumanisedArticle', value)}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Make the content sound more natural and conversational
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="comparison" className="flex-1 cursor-pointer">Include Comparison Table</Label>
          <Switch 
            id="comparison" 
            checked={customizationOptions.generateComparisonTable || false} 
            onCheckedChange={value => onChange('generateComparisonTable', value)}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Add a comparison table where relevant
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="quotes" className="flex-1 cursor-pointer">Include Expert Quotes</Label>
          <Switch 
            id="quotes" 
            checked={customizationOptions.includeExpertQuotes || false} 
            onCheckedChange={value => onChange('includeExpertQuotes', value)}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Add expert quotes and insights to build authority
        </p>
      </div>

      <Separator />

      {/* Images Section */}
      <div>
        <button 
          type="button" 
          className="flex w-full items-center justify-between py-1 text-left font-medium"
          onClick={() => toggleSection('images')}
        >
          Images Settings
          {expandedSections.images ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
          }
        </button>

        {expandedSections.images && (
          <div className="mt-3 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="images" className="flex-1 cursor-pointer">Include Images</Label>
                <Switch 
                  id="images" 
                  checked={customizationOptions.includeImagesInArticle || false}
                  onCheckedChange={value => onChange('includeImagesInArticle', value)}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Include relevant images throughout the article
              </p>
            </div>

            {customizationOptions.includeImagesInArticle && (
              <>
                <div>
                  <Label htmlFor="image-count">Number of Images</Label>
                  <Input 
                    id="image-count" 
                    type="number" 
                    min={1} 
                    max={10} 
                    className="mt-1"
                    value={customizationOptions.imageCount || 3}
                    onChange={e => onChange('imageCount', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="image-type">Image Type</Label>
                  <select 
                    id="image-type" 
                    className="w-full border border-input rounded-md mt-1 p-2"
                    value={customizationOptions.imageType || 'Non-Copyright'}
                    onChange={e => onChange('imageType', e.target.value as 'Non-Copyright' | 'Copyright Image')}
                  >
                    <option value="Non-Copyright">Non-Copyright</option>
                    <option value="Copyright Image">Copyright Image</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cover-image" className="flex-1 cursor-pointer">Generate Cover Image</Label>
                    <Switch 
                      id="cover-image" 
                      checked={customizationOptions.generateCoverImage || false}
                      onCheckedChange={value => onChange('generateCoverImage', value)}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Create a featured image for the article
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* Links Section */}
      <div>
        <button 
          type="button" 
          className="flex w-full items-center justify-between py-1 text-left font-medium"
          onClick={() => toggleSection('links')}
        >
          Links Settings
          {expandedSections.links ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
          }
        </button>
        
        {expandedSections.links && (
          <div className="mt-3 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="internal-links" className="flex-1 cursor-pointer">Include Internal Links</Label>
                <Switch 
                  id="internal-links" 
                  checked={customizationOptions.includeInternalLinks || false}
                  onCheckedChange={value => onChange('includeInternalLinks', value)}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Add links to other pages on your site
              </p>
            </div>

            {customizationOptions.includeInternalLinks && (
              <>
                <div>
                  <Label htmlFor="internal-link-count">Number of Internal Links</Label>
                  <Input 
                    id="internal-link-count" 
                    type="number" 
                    min={1} 
                    max={10} 
                    className="mt-1"
                    value={customizationOptions.internalLinkCount || 3}
                    onChange={e => onChange('internalLinkCount', parseInt(e.target.value))}
                  />
                </div>
              </>
            )}

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="external-links" className="flex-1 cursor-pointer">Include External Links</Label>
                <Switch 
                  id="external-links" 
                  checked={customizationOptions.includeExternalLinks || false}
                  onCheckedChange={value => onChange('includeExternalLinks', value)}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Add links to reputable external resources
              </p>
            </div>

            {customizationOptions.includeExternalLinks && (
              <div>
                <Label htmlFor="external-link-count">Number of External Links</Label>
                <Input 
                  id="external-link-count" 
                  type="number" 
                  min={1} 
                  max={5} 
                  className="mt-1"
                  value={customizationOptions.externalLinkCount || 2}
                  onChange={e => onChange('externalLinkCount', parseInt(e.target.value))}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* Advanced Settings */}
      <div>
        <button 
          type="button" 
          className="flex w-full items-center justify-between py-1 text-left font-medium"
          onClick={() => toggleSection('advanced')}
        >
          Advanced Settings
          {expandedSections.advanced ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
          }
        </button>
        
        {expandedSections.advanced && (
          <div className="mt-3 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="faqs" className="flex-1 cursor-pointer">Generate FAQs</Label>
                <Switch 
                  id="faqs" 
                  checked={customizationOptions.generateFaqs || false}
                  onCheckedChange={value => onChange('generateFaqs', value)}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Add frequently asked questions with answers
              </p>
            </div>

            {customizationOptions.generateFaqs && (
              <div>
                <Label htmlFor="faq-count">Number of FAQs</Label>
                <Input 
                  id="faq-count" 
                  type="number" 
                  min={1} 
                  max={10} 
                  className="mt-1"
                  value={customizationOptions.faqCount || 3}
                  onChange={e => onChange('faqCount', parseInt(e.target.value))}
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="cta" className="flex-1 cursor-pointer">Include Call to Action</Label>
                <Switch 
                  id="cta" 
                  checked={customizationOptions.includeCta || false}
                  onCheckedChange={value => onChange('includeCta', value)}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Add a clear call to action at the end
              </p>
            </div>

            {customizationOptions.includeCta && (
              <div>
                <Label htmlFor="cta-text">CTA Text</Label>
                <Textarea 
                  id="cta-text"
                  placeholder="E.g., Sign up for our newsletter to receive weekly updates..."
                  className="mt-1"
                  value={customizationOptions.ctaText || ''}
                  onChange={e => onChange('ctaText', e.target.value)}
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="general-guidance" className="flex-1 cursor-pointer">Include General Guidance</Label>
                <Switch 
                  id="general-guidance" 
                  checked={customizationOptions.includeGeneralGuidance || false}
                  onCheckedChange={value => onChange('includeGeneralGuidance', value)}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Add specific instructions for the article
              </p>
            </div>

            {customizationOptions.includeGeneralGuidance && (
              <div>
                <Label htmlFor="guidance-text">Guidance Instructions</Label>
                <Textarea 
                  id="guidance-text"
                  placeholder="E.g., Focus on benefits rather than features. Use a conversational tone..."
                  className="mt-1 min-h-[80px]"
                  value={customizationOptions.generalGuidance || ''}
                  onChange={e => onChange('generalGuidance', e.target.value)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutlineCustomizeForm;
