
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArticleOutlineCustomization } from '@/types/outlineCustomize';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OutlineCustomizationOptionsProps {
  customizationOptions: ArticleOutlineCustomization;
  updateCustomizationOption: (key: keyof ArticleOutlineCustomization, value: any) => void;
}

const OutlineCustomizationOptions: React.FC<OutlineCustomizationOptionsProps> = ({
  customizationOptions,
  updateCustomizationOption
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Customization</CardTitle>
        <CardDescription>
          Customize your article with additional features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Humanized Article Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Humanized Article</Label>
            <p className="text-xs text-muted-foreground">
              Generate a more human-like version of the article
            </p>
          </div>
          <Switch
            checked={customizationOptions.generateHumanisedArticle}
            onCheckedChange={(value) => updateCustomizationOption('generateHumanisedArticle', value)}
          />
        </div>

        {/* Comparison Table Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Include Comparison Table</Label>
            <p className="text-xs text-muted-foreground">
              Add a comparison table to your article
            </p>
          </div>
          <Switch
            checked={customizationOptions.generateComparisonTable}
            onCheckedChange={(value) => updateCustomizationOption('generateComparisonTable', value)}
          />
        </div>

        {/* Expert Quotes Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Include Expert Quotes</Label>
            <p className="text-xs text-muted-foreground">
              Add relevant expert quotes to your article
            </p>
          </div>
          <Switch
            checked={customizationOptions.includeExpertQuotes}
            onCheckedChange={(value) => updateCustomizationOption('includeExpertQuotes', value)}
          />
        </div>

        {/* FAQs Option */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Generate FAQs</Label>
              <p className="text-xs text-muted-foreground">
                Add frequently asked questions to your article
              </p>
            </div>
            <Switch
              checked={customizationOptions.generateFaqs}
              onCheckedChange={(value) => updateCustomizationOption('generateFaqs', value)}
            />
          </div>
          
          {customizationOptions.generateFaqs && (
            <div className="pt-2">
              <Label htmlFor="faq-count" className="text-sm">Number of FAQs</Label>
              <Select
                value={customizationOptions.faqCount.toString()}
                onValueChange={(value) => updateCustomizationOption('faqCount', parseInt(value))}
              >
                <SelectTrigger id="faq-count">
                  <SelectValue placeholder="Select FAQ count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Questions</SelectItem>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="7">7 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Additional Guidance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Additional Guidance</Label>
              <p className="text-xs text-muted-foreground">
                Provide additional instructions for the article
              </p>
            </div>
            <Switch
              checked={customizationOptions.includeGeneralGuidance}
              onCheckedChange={(value) => updateCustomizationOption('includeGeneralGuidance', value)}
            />
          </div>
          
          {customizationOptions.includeGeneralGuidance && (
            <div className="pt-2">
              <Textarea
                placeholder="Enter any specific instructions or guidance for your article..."
                value={customizationOptions.generalGuidance}
                onChange={(e) => updateCustomizationOption('generalGuidance', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OutlineCustomizationOptions;
