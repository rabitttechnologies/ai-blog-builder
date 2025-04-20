
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import type { TitleDescriptionResponse } from '@/types/clustering';

interface TitleConfirmationDialogProps {
  confirmationItem: TitleDescriptionResponse['data'][0] | null;
  setConfirmationItem: React.Dispatch<React.SetStateAction<TitleDescriptionResponse['data'][0] | null>>;
  confirmCreateBlog: () => void;
}

const TitleConfirmationDialog: React.FC<TitleConfirmationDialogProps> = ({
  confirmationItem,
  setConfirmationItem,
  confirmCreateBlog
}) => {
  return (
    <Dialog open={!!confirmationItem} onOpenChange={(open) => !open && setConfirmationItem(null)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Blog</DialogTitle>
          <DialogDescription>
            You're about to create a blog with the following details:
          </DialogDescription>
        </DialogHeader>
        
        {confirmationItem && (
          <div className="py-4">
            <h4 className="font-semibold mb-2">{confirmationItem.title}</h4>
            <p className="text-sm mb-4">{confirmationItem.description}</p>
            
            <div className="text-sm grid grid-cols-2 gap-2">
              <div><span className="text-muted-foreground">Keyword:</span> {confirmationItem.keyword}</div>
              <div><span className="text-muted-foreground">Cluster:</span> {confirmationItem.cluster_name}</div>
              <div><span className="text-muted-foreground">Category:</span> {confirmationItem.category}</div>
              <div><span className="text-muted-foreground">Type:</span> {confirmationItem.type}</div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setConfirmationItem(null)}>Cancel</Button>
          <Button onClick={confirmCreateBlog}>Create Blog</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TitleConfirmationDialog;
