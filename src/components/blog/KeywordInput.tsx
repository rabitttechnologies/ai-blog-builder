
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';

interface KeywordInputProps {
  onSubmit: (keywords: string[], niche: string) => void;
}

const KeywordInput: React.FC<KeywordInputProps> = ({ onSubmit }) => {
  const [keywords, setKeywords] = useState('');
  const [niche, setNiche] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean);
    onSubmit(keywordList, niche);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input 
          placeholder="Enter keywords (comma-separated)" 
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
      </div>
      <div>
        <Input 
          placeholder="Enter niche" 
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
        />
      </div>
      <Button type="submit">Research Keywords</Button>
    </form>
  );
};

export default KeywordInput;
