import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';

interface KeywordMergerProps {
  selectedKeywords: string[];
  onMergeKeywords: (mergedKeyword: string) => void;
  onClose: () => void;
}

const KeywordMerger: React.FC<KeywordMergerProps> = ({ selectedKeywords, onMergeKeywords, onClose }) => {
  const [mergedKeyword, setMergedKeyword] = React.useState<string>('');

  React.useEffect(() => {
    // Initialize mergedKeyword with selectedKeywords joined by commas
    setMergedKeyword(selectedKeywords.join(', '));
  }, [selectedKeywords]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMergedKeyword(e.target.value);
  };

  const handleMerge = () => {
    onMergeKeywords(mergedKeyword);
    onClose();
  };

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <label htmlFor="mergedKeyword" className="block text-sm font-medium text-gray-700">
          Merged Keyword:
        </label>
        <input
          type="text"
          id="mergedKeyword"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          value={mergedKeyword}
          onChange={handleInputChange}
        />
      </div>
      <div>
        {selectedKeywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedKeywords.map((keyword) => (
              <Badge key={keyword}>{keyword}</Badge>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleMerge}>Merge Keywords</Button>
      </div>
    </div>
  );
};

export default KeywordMerger;
