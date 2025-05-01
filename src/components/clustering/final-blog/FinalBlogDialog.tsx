
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import FinalBlogEditor from './FinalBlogEditor';
import LoadingOverlay from '@/components/blog/LoadingOverlay';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize form fields when data changes
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
  
  // Modified to save directly without confirmation
  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log("Starting direct blog save process...");
    
    try {
      // Directly call onSaveBlog with current formData
      const success = await onSaveBlog(formData);
      console.log("Blog save result:", success);
      
      if (success) {
        toast({
          title: "Blog Saved Successfully",
          description: "Your blog has been saved and will appear on your dashboard.",
        });
        onSubmit(); // Call the wrapper function in DialogSteps
        
        // Redirect to dashboard after a short delay to show the success message
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        throw new Error("Failed to save blog");
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
  
  return (
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
              message={isSubmitting ? "Saving Your Blog" : "Loading Blog Content"} 
              subMessage={
                isSubmitting 
                  ? "This may take up to 1 minute to complete" 
                  : "Please wait while we load your blog content"
              }
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FinalBlogDialog;
