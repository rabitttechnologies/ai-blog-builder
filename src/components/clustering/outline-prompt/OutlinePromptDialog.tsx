
import React from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import OutlinePromptEditor from './OutlinePromptEditor';
import LoadingOverlay from '@/components/blog/LoadingOverlay';
import type { OutlinePromptResponse, OutlinePromptFormData } from '@/hooks/clustering/useOutlinePrompt';

interface OutlinePromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  data: OutlinePromptResponse | null;
  formData: OutlinePromptFormData;
  onUpdateField: (field: keyof OutlinePromptFormData, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const OutlinePromptDialog: React.FC<OutlinePromptDialogProps> = ({
  isOpen,
  onClose,
  onBack,
  data,
  formData,
  onUpdateField,
  onSubmit,
  isLoading
}) => {
  if (!data) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto"
        hideCloseButton={isLoading}
      >
        <DialogHeader>
          <DialogTitle>Outline and Prompt for Body</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <OutlinePromptEditor 
            data={data}
            formData={formData}
            onUpdateField={onUpdateField}
            onBack={onBack}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
          
          {isLoading && (
            <LoadingOverlay 
              message="Our AI Agent is Creating the Blog Body" 
              subMessage="This may take up to 5 minutes to complete"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OutlinePromptDialog;
