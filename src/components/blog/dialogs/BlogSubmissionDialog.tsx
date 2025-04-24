
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface BlogSubmissionDialogProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const BlogSubmissionDialog: React.FC<BlogSubmissionDialogProps> = ({
  isOpen,
  isSubmitting,
  onConfirm,
  onCancel
}) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Submit Blog for Creation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you ready to create your blog? This process may take a few minutes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:space-x-4">
          <AlertDialogCancel 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isSubmitting}
            className="relative"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Blog...
              </>
            ) : (
              'Create Blog'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BlogSubmissionDialog;
