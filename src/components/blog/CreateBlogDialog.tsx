
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import KeywordSearchForm from './KeywordSearchForm';
import SearchResultsDisplay from './SearchResultsDisplay';

interface CreateBlogDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBlogDialog: React.FC<CreateBlogDialogProps> = ({ isOpen, onClose }) => {
  const [searchResults, setSearchResults] = useState<any>(null);
  
  const handleSearchComplete = (data: any) => {
    setSearchResults(data);
  };
  
  const handleClose = () => {
    setSearchResults(null);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {!searchResults ? (
          <>
            <DialogHeader>
              <DialogTitle>Create New Blog</DialogTitle>
            </DialogHeader>
            <KeywordSearchForm 
              onComplete={handleSearchComplete} 
              onCancel={handleClose} 
            />
          </>
        ) : (
          <SearchResultsDisplay 
            data={searchResults} 
            onClose={handleClose} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateBlogDialog;
