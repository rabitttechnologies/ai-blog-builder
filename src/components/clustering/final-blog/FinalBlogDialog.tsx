
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import FinalBlogEditor from './FinalBlogEditor';
import LoadingOverlay from '@/components/blog/LoadingOverlay';
import BlogSubmissionDialog from '@/components/blog/dialogs/BlogSubmissionDialog';
import type { FinalBlogResponse, FinalBlogFormData } from '@/hooks/clustering/useFinalBlogCreation';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface FinalBlogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  data: FinalBlogResponse | null;
  formData: FinalBlogFormData;
  onUpdateField: (field: keyof FinalBlogFormData, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onSaveBlog: (formData: FinalBlogFormData) => Promise<boolean>;
}

const FinalBlogDialog: React.FC<FinalBlogDialogProps> = ({
  isOpen,
  onClose,
  onBack,
  data,
  formData,
  onUpdateField,
  onSubmit,
  isLoading,
  onSaveBlog
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize form fields when data changes - Fixed to properly handle different title scenarios
  useEffect(() => {
    if (data) {
      // Ensure we properly set the title values, handling all possible cases
      const title = data.new_title || data.Title || '';
      const alternateTitle = data.Title || data.new_title || '';
      
      onUpdateField('title', title);
      onUpdateField('alternateTitle', alternateTitle);
      onUpdateField('finalArticle', data.final_article || '');
      
      console.log("FinalBlogDialog - Data received:", {
        dataTitle: data.Title,
        dataNewTitle: data.new_title,
        setTitle: title,
        setAltTitle: alternateTitle
      });
    }
  }, [data, onUpdateField]);

  if (!data) return null;
  
  const handleSubmit = () => {
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const success = await onSaveBlog(formData);
      if (success) {
        setShowConfirm(false);
        toast({
          title: "Blog Saved Successfully",
          description: "Your blog has been saved and will appear on your dashboard.",
        });
        onSubmit(); // This calls the wrapper function in DialogSteps
        
        // Redirect to dashboard after a short delay to show the success message
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      toast({
        title: "Error Saving Blog",
        description: "There was a problem saving your blog. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };
  
  return (
    <>
      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => !open && onClose()}
      >
        <DialogContent 
          className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto"
          hideCloseButton={isLoading || isSubmitting}
        >
          <DialogHeader>
            <DialogTitle>Final Blog Content</DialogTitle>
          </DialogHeader>
          
          <div className="relative">
            <FinalBlogEditor 
              data={data}
              formData={formData}
              onUpdateField={onUpdateField}
              onBack={onBack}
              onSubmit={handleSubmit}
              isLoading={isLoading || isSubmitting}
            />
            
            {(isLoading || isSubmitting) && (
              <LoadingOverlay 
                message={isSubmitting ? "Creating Your Blog" : "Saving Your Blog"} 
                subMessage={
                  isSubmitting 
                    ? "This may take up to 5 minutes to complete" 
                    : "Please wait while we save your blog"
                }
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <BlogSubmissionDialog 
        isOpen={showConfirm}
        isSubmitting={isSubmitting}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancel}
      />
    </>
  );
};

export default FinalBlogDialog;
