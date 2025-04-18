
import React from 'react';
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

interface TranslationManagerProps {
  blogId: string;
  currentLanguage: string;
  onProgressUpdate?: (progress: number) => void;
}

export function TranslationManager({
  blogId,
  currentLanguage,
  onProgressUpdate
}: TranslationManagerProps) {
  return (
    <div className="flex items-center gap-2">
      <TranslationRequestDialog
        blogId={blogId}
        currentLanguage={currentLanguage}
        onProgressUpdate={onProgressUpdate}
      />
      
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">View Translation History</Button>
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
  );
}
