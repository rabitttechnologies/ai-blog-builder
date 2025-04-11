import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { useKeywordResearch } from '@/hooks/useKeywordResearch';
import { Loader2, Search, RefreshCcw, Globe, Hash, Languages } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface KeywordResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeywordSelected?: (keyword: string) => void;
}

// List of common languages
const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Russian', label: 'Russian' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'Portuguese', label: 'Portuguese' },
  { value: 'Italian', label: 'Italian' },
  { value: 'Hindi', label: 'Hindi' }
];

const countryOptions = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'IN', label: 'India' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
  { value: 'CN', label: 'China' },
  { value: 'RU', label: 'Russia' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'SE', label: 'Sweden' },
  { value: 'KR', label: 'South Korea' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'SG', label: 'Singapore' },
  { value: 'AE', label: 'United Arab Emirates' }
];

const generateNumberOptions = (min: number, max: number) => 
  Array.from({ length: max - min + 1 }, (_, i) => ({ value: i + min, label: `${i + min}` }));

const depthOptions = generateNumberOptions(1, 30);
const limitOptions = generateNumberOptions(1, 30);

export const KeywordResearchModal: React.FC<KeywordResearchModalProps> = ({ 
  isOpen, 
  onClose,
  onKeywordSelected 
}) => {
  const { 
    formData,
    updateFormField,
    suggestions, 
    isLoading, 
    loadingProgress,
    submitKeyword 
  } = useKeywordResearch();

  const handleSelectKeyword = (keyword: string) => {
    console.log("Keyword selected in modal:", keyword);
    if (onKeywordSelected) {
      onKeywordSelected(keyword);
    }
  };

  const renderSuggestionSection = (title: string, items: string[]) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="grid grid-cols-2 gap-2">
          {items.slice(0, 6).map((item, index) => (
            <div 
              key={index} 
              className="bg-secondary/30 p-2 rounded-md text-sm truncate cursor-pointer hover:bg-secondary/50"
              onClick={() => handleSelectKeyword(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitKeyword();
  };

  const handleProceedWithCurrentKeyword = () => {
    if (formData.keyword.trim()) {
      handleSelectKeyword(formData.keyword.trim());
    }
  };

  const isTimeoutError = !isLoading && 
    !suggestions.topInSERP.length && 
    !suggestions.hotKeywordIdeas.length && 
    !suggestions.popularRightNow.length && 
    !suggestions.topSuggestions.length && 
    formData.keyword.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Keyword Research</DialogTitle>
          <DialogDescription>
            Enter a keyword and customize your research parameters to get targeted SEO suggestions
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormLabel>Keyword</FormLabel>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Enter your keyword" 
                    value={formData.keyword}
                    onChange={(e) => updateFormField('keyword', e.target.value)}
                    disabled={isLoading}
                    className="flex-grow"
                  />
                </div>
              </div>
              
              
              <div>
                <FormLabel>Language</FormLabel>
                <Select 
                  disabled={isLoading}
                  value={formData.language}
                  onValueChange={(value) => updateFormField('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <FormLabel>Country/Location</FormLabel>
                <Select 
                  disabled={isLoading}
                  value={formData.country}
                  onValueChange={(value) => updateFormField('country', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <FormLabel>Search Depth</FormLabel>
                <Select 
                  disabled={isLoading}
                  value={formData.depth.toString()}
                  onValueChange={(value) => updateFormField('depth', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select depth" />
                  </SelectTrigger>
                  <SelectContent>
                    {depthOptions.map(option => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <FormLabel>Result Limit</FormLabel>
                <Select 
                  disabled={isLoading}
                  value={formData.limit.toString()}
                  onValueChange={(value) => updateFormField('limit', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select limit" />
                  </SelectTrigger>
                  <SelectContent>
                    {limitOptions.map(option => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2 flex flex-col sm:flex-row gap-2">
                <Button 
                  type="submit"
                  disabled={isLoading || !formData.keyword.trim()}
                  className="flex-1"
                  leftIcon={<Search className="w-4 h-4" />}
                >
                  {isLoading ? 'Researching...' : 'Research Keyword'}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  disabled={isLoading || !formData.keyword.trim()}
                  className="flex-1"
                  onClick={handleProceedWithCurrentKeyword}
                >
                  Proceed with Current Keyword
                </Button>
              </div>
            </div>
          </form>

          

          {isLoading && (
            <div className="text-center py-6 space-y-4">
              <div className="relative">
                <Progress value={loadingProgress} className="h-2" />
                <div 
                  className="absolute -top-1 w-4 h-4 rounded-full bg-primary animate-pulse"
                  style={{ left: `${loadingProgress}%`, transform: 'translateX(-50%)' }}
                ></div>
              </div>
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-2 text-primary" />
              <div className="space-y-1">
                <p className="font-medium">Researching keyword suggestions...</p>
                <p className="text-sm text-muted-foreground">
                  Analyzing search trends and gathering related topics
                </p>
              </div>
            </div>
          )}

          {isTimeoutError && (
            <Alert variant="destructive" className="my-4">
              <AlertDescription className="flex flex-col space-y-3">
                <span>We couldn't retrieve results for your keyword. This might be due to connection issues or server availability.</span>
                <div className="flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateFormField('keyword', '')}
                  >
                    Try Another Keyword
                  </Button>
                  <Button 
                    size="sm"
                    leftIcon={<RefreshCcw className="w-4 h-4" />}
                    onClick={() => submitKeyword()}
                  >
                    Try Again
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !isTimeoutError && (
            <div>
              {renderSuggestionSection('Top in SERP', suggestions.topInSERP)}
              {renderSuggestionSection('Hot Keyword Ideas', suggestions.hotKeywordIdeas)}
              {renderSuggestionSection('Popular Right Now', suggestions.popularRightNow)}
              {renderSuggestionSection('Top Suggestions', suggestions.topSuggestions)}
              
              {!suggestions.topInSERP.length && 
               !suggestions.hotKeywordIdeas.length && 
               !suggestions.popularRightNow.length && 
               !suggestions.topSuggestions.length && 
               !formData.keyword && (
                <div className="text-center py-4 text-muted-foreground">
                  Enter a keyword above to start your research.
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
