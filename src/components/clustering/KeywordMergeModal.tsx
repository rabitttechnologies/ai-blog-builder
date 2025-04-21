
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { ClusterGroup } from '@/types/clustering';

interface KeywordMergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  clusters: ClusterGroup[];
  onMerge: (mergedKeywords: string) => void;
}

const KeywordMergeModal: React.FC<KeywordMergeModalProps> = ({
  isOpen,
  onClose,
  clusters,
  onMerge
}) => {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  
  // Get all keywords from all clusters
  const allKeywords = clusters.flatMap(cluster => 
    cluster.items.map(item => item.keyword)
  );
  
  const handleToggleKeyword = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(prev => prev.filter(k => k !== keyword));
    } else if (selectedKeywords.length < 3) {
      setSelectedKeywords(prev => [...prev, keyword]);
    }
  };
  
  const handleMerge = () => {
    if (selectedKeywords.length > 0) {
      onMerge(selectedKeywords.join(', '));
      setSelectedKeywords([]);
      onClose();
    }
  };
  
  const handleCancel = () => {
    setSelectedKeywords([]);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Merge Keywords (Select up to 3)</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Selected Keywords:</div>
            {selectedKeywords.length === 0 ? (
              <div className="text-sm text-muted-foreground">No keywords selected</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedKeywords.map(keyword => (
                  <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                    {keyword}
                    <button 
                      onClick={() => handleToggleKeyword(keyword)}
                      className="h-4 w-4 rounded-full hover:bg-destructive/20 inline-flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          {selectedKeywords.length > 0 && (
            <div className="mb-4 p-3 bg-muted rounded-md">
              <div className="text-sm font-medium mb-1">Merged Result:</div>
              <div className="text-sm break-words">{selectedKeywords.join(', ')}</div>
            </div>
          )}
          
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Available Keywords:</div>
            <div className="border rounded-md max-h-60 overflow-y-auto divide-y">
              {allKeywords.map((keyword, index) => (
                <div 
                  key={index}
                  className={`p-2 cursor-pointer hover:bg-accent/10 ${
                    selectedKeywords.includes(keyword) ? 'bg-primary/10' : ''
                  } ${
                    selectedKeywords.length >= 3 && !selectedKeywords.includes(keyword)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  onClick={() => handleToggleKeyword(keyword)}
                >
                  {keyword}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleMerge}
              disabled={selectedKeywords.length === 0}
            >
              Merge Keywords
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeywordMergeModal;
