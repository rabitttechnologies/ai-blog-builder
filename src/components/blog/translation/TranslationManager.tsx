
import React, { useState } from 'react';
import { TranslationRequestDialog } from './TranslationRequestDialog';
import { TranslationHistoryView } from './TranslationHistoryView';
import { Button } from '@/components/ui/Button';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { ChevronsUpDown, History, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage, SUPPORTED_LANGUAGES } from '@/context/language/LanguageContext';

interface TranslationManagerProps {
  blogId: string;
  currentLanguage: string;
  onProgressUpdate?: (progress: number) => void;
  translationProgress?: number;
}

export function TranslationManager({
  blogId,
  currentLanguage,
  onProgressUpdate,
  translationProgress
}: TranslationManagerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { setLanguage } = useLanguage();
  
  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between bg-card p-2 rounded-md border">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Translation Management</span>
          {translationProgress !== undefined && (
            <Badge variant="outline" className="ml-2">
              {Math.round(translationProgress)}% Complete
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={toggleExpand}>
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </div>
      
      {isExpanded && (
        <div className="bg-card p-4 rounded-md border space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Available Translations</h4>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_LANGUAGES.map(lang => (
                <Button 
                  key={lang.code}
                  variant={lang.code === currentLanguage ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setLanguage(lang.code)}
                >
                  {lang.name}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TranslationRequestDialog
              blogId={blogId}
              currentLanguage={currentLanguage}
              onProgressUpdate={onProgressUpdate}
            />
            
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <span>Translation History</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Translation History</DrawerTitle>
                  <DrawerDescription>
                    View the status of all translation requests for this blog post
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <TranslationHistoryView blogId={blogId} />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      )}
    </div>
  );
}
