
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { SUPPORTED_LANGUAGES } from '@/context/language/LanguageContext';
import { useTranslationWorkflow } from '@/hooks/useTranslationWorkflow';
import { useToast } from '@/hooks/use-toast';
import { BlogPost } from '@/types/blog';
import { Badge } from '@/components/ui/badge';
import { Globe, Check } from 'lucide-react';

interface AdminTranslationRequestProps {
  isOpen: boolean;
  onClose: () => void;
  blogPost: BlogPost;
}

export function AdminTranslationRequest({ 
  isOpen, 
  onClose, 
  blogPost 
}: AdminTranslationRequestProps) {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const { requestTranslation } = useTranslationWorkflow(blogPost.id);
  const { toast } = useToast();

  const availableLanguages = SUPPORTED_LANGUAGES.filter(
    lang => lang.code !== blogPost.language_code
  );

  // Get existing translations to disable those languages that are already translated
  const existingTranslations = Object.keys(blogPost.translations || {});

  const handleLanguageToggle = (langCode: string) => {
    setSelectedLanguages(prev => 
      prev.includes(langCode) 
        ? prev.filter(code => code !== langCode)
        : [...prev, langCode]
    );
  };

  const handleSubmit = async () => {
    if (selectedLanguages.length === 0) return;

    try {
      await requestTranslation.mutateAsync({
        blog_id: blogPost.id,
        requested_languages: selectedLanguages,
        completed_languages: [],
        status: 'pending'
      });
      
      onClose();
      toast({
        title: "Translation requested",
        description: `Translation requested for ${selectedLanguages.length} language(s).`,
      });
    } catch (error) {
      console.error('Translation request failed:', error);
      toast({
        title: "Error",
        description: "Failed to request translation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Request Translations</DialogTitle>
          <DialogDescription>
            Select target languages for translating "{blogPost.title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-1">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Original Language:</span>
              <Badge>
                {SUPPORTED_LANGUAGES.find(l => l.code === blogPost.language_code)?.name || blogPost.language_code}
              </Badge>
            </div>
            
            {existingTranslations.length > 0 && (
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Existing Translations:</span>
                <div className="flex flex-wrap gap-1">
                  {existingTranslations.map(langCode => (
                    <Badge key={langCode} variant="outline">
                      {SUPPORTED_LANGUAGES.find(l => l.code === langCode)?.name || langCode}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
            {availableLanguages.map((lang) => {
              const isTranslated = existingTranslations.includes(lang.code);
              return (
                <div key={lang.code} className="flex items-center space-x-2">
                  <Checkbox
                    id={`lang-${lang.code}`}
                    checked={selectedLanguages.includes(lang.code)}
                    onCheckedChange={() => handleLanguageToggle(lang.code)}
                    disabled={isTranslated}
                  />
                  <label
                    htmlFor={`lang-${lang.code}`}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isTranslated ? 'text-muted-foreground' : ''}`}
                  >
                    {lang.name}
                    {isTranslated && (
                      <span className="ml-2 text-xs text-muted-foreground">(Already translated)</span>
                    )}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={selectedLanguages.length === 0 || requestTranslation.isPending}
          >
            {requestTranslation.isPending ? "Requesting..." : "Request Translation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
