
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import KeywordSearchForm from './KeywordSearchForm';
import SelectableSearchResults from './SelectableSearchResults';
import { safeGet } from '@/utils/dataValidation';

const dialogContentClasses = "sm:max-w-[800px] max-h-[90vh] overflow-y-auto";

interface CreateBlogDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBlogDialog: React.FC<CreateBlogDialogProps> = ({ isOpen, onClose }) => {
  const [searchResults, setSearchResults] = useState<any>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [workflowId, setWorkflowId] = useState<string>('');
  
  const handleSearchComplete = (data: any) => {
    try {
      console.log("Search complete with data:", JSON.stringify(data));
      
      setSearchResults(data);
      setKeyword(safeGet(data, 'keyword', '') || '');
      setWorkflowId(safeGet(data, 'workflowId', '') || crypto.randomUUID());
    } catch (error) {
      console.error("Error processing search results:", error);
    }
  };
  
  const handleClose = () => {
    setSearchResults(null);
    setKeyword('');
    setWorkflowId('');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className={dialogContentClasses}>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        {!searchResults ? (
          <>
            <DialogHeader>
              <DialogTitle>Find Keyword Ideas</DialogTitle>
            </DialogHeader>
            <KeywordSearchForm 
              onComplete={handleSearchComplete} 
              onCancel={handleClose} 
            />
          </>
        ) : (
          <SelectableSearchResults 
            data={searchResults} 
            keyword={keyword}
            workflowId={workflowId}
            onClose={handleClose} 
            onBack={() => setSearchResults(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateBlogDialog;
