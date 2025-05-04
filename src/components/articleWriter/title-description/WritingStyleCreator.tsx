
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { WritingStyle } from '@/context/articleWriter/ArticleWriterContext';

interface WritingStyleCreatorProps {
  onSave: (style: Omit<WritingStyle, 'id'>) => void;
  disabled?: boolean;
}

const WritingStyleCreator: React.FC<WritingStyleCreatorProps> = ({
  onSave,
  disabled = false
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (name.trim() && description.trim()) {
      onSave({ name, description });
      setOpen(false);
      setName('');
      setDescription('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Create Writing Style
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a New Writing Style</DialogTitle>
          <DialogDescription>
            Define a new writing style that you can reuse later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="style-name" className="text-right">
              Name
            </Label>
            <Input
              id="style-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Name your writing style"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="style-description" className="text-right">
              Description
            </Label>
            <Textarea
              id="style-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Describe the tone, voice, and style you want for your article"
              rows={5}
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || !description.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WritingStyleCreator;
