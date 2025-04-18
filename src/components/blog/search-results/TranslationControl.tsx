
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { TranslationRequestDialog } from '@/components/blog/translation/TranslationRequestDialog';

interface TranslationControlProps {
  showControls: boolean;
  currentLanguage: string;
  entityId: string;
}

const TranslationControl: React.FC<TranslationControlProps> = ({
  showControls,
  currentLanguage,
  entityId
}) => {
  if (!showControls) return null;

  return (
    <div className="container-wide py-4">
      <div className="flex justify-end space-x-4">
        <Alert variant="warning" className="w-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This content is only available in English
          </AlertDescription>
        </Alert>
        <TranslationRequestDialog 
          blogId={entityId} 
          currentLanguage={currentLanguage}
        />
      </div>
    </div>
  );
};

export default TranslationControl;
