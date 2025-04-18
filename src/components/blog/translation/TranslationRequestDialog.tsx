
import React from 'react';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { SUPPORTED_LANGUAGES } from '@/context/language/LanguageContext';
import { useTranslationWorkflow } from '@/hooks/useTranslationWorkflow';
import { useToast } from '@/hooks/use-toast';

interface TranslationRequestDialogProps {
  blogId: string;
  currentLanguage: string;
}

export function TranslationRequestDialog({ blogId, currentLanguage }: TranslationRequestDialogProps) {
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const { requestTranslation } = useTranslationWorkflow(blogId);
  const { toast } = useToast();

  const availableLanguages = SUPPORTED_LANGUAGES.filter(
    lang => lang.code !== currentLanguage
  );

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
        blog_id: blogId,
        requested_languages: selectedLanguages,
        completed_languages: [],
        status: 'pending'
      });
      
      setOpen(false);
      toast({
        title: "Translation requested",
        description: "The translation process has been initiated.",
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Request Translation</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Translation</DialogTitle>
          <DialogDescription>
            Select target languages for translation
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {availableLanguages.map((lang) => (
            <div key={lang.code} className="flex items-center space-x-2">
              <Checkbox
                id={`lang-${lang.code}`}
                checked={selectedLanguages.includes(lang.code)}
                onCheckedChange={() => handleLanguageToggle(lang.code)}
              />
              <label
                htmlFor={`lang-${lang.code}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {lang.name}
              </label>
            </div>
          ))}
        </div>
        <DialogFooter>
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
