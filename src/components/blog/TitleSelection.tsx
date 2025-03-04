
import React, { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface TitleSelectionProps {
  titles: string[];
  onSelect: (title: string) => void;
  onCustomTitle: (title: string) => void;
}

const TitleSelection: React.FC<TitleSelectionProps> = ({
  titles,
  onSelect,
  onCustomTitle,
}) => {
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [customTitle, setCustomTitle] = useState("");

  const handleTitleSelect = (title: string) => {
    setSelectedTitle(title);
    setCustomTitle(title);
  };

  const handleConfirm = () => {
    if (!selectedTitle && !customTitle) return;
    
    if (isEditing && customTitle) {
      onCustomTitle(customTitle);
    } else if (selectedTitle) {
      onSelect(selectedTitle);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing && selectedTitle) {
      setCustomTitle(selectedTitle);
    }
  };

  return (
    <div className="glass p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-4">Select a Title for Your Blog</h3>
      <p className="text-sm text-foreground/70 mb-6">
        Choose one of the AI-generated titles below, or create your own custom title.
      </p>

      {!isEditing ? (
        <div className="space-y-3 mb-6">
          {titles.map((title, index) => (
            <button
              key={index}
              className={cn(
                "w-full text-left p-4 rounded-lg border border-border transition-all",
                selectedTitle === title
                  ? "bg-primary/5 border-primary"
                  : "hover:bg-secondary"
              )}
              onClick={() => handleTitleSelect(title)}
            >
              <div className="flex items-start">
                <div className={cn(
                  "h-5 w-5 rounded-full border flex-shrink-0 flex items-center justify-center mr-3 mt-0.5",
                  selectedTitle === title
                    ? "border-primary bg-primary text-white"
                    : "border-border"
                )}>
                  {selectedTitle === title && (
                    <Check className="h-3 w-3" />
                  )}
                </div>
                <span className="text-base">{title}</span>
              </div>
            </button>
          ))}
          
          <button
            className="w-full text-left p-4 rounded-lg border border-dashed border-border hover:border-primary hover:bg-secondary transition-all"
            onClick={toggleEdit}
          >
            <div className="flex items-center justify-center text-foreground/70">
              <span className="text-sm font-medium">Create a custom title</span>
            </div>
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <label htmlFor="custom-title" className="block text-sm font-medium mb-2">
            Your Custom Title
          </label>
          <input
            id="custom-title"
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="Enter your own blog title..."
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            autoFocus
          />
          <p className="mt-2 text-xs text-foreground/60">
            A good title should be compelling and contain your main keyword
          </p>
          
          <button
            className="mt-4 text-sm text-primary hover:text-primary/80 transition-colors"
            onClick={toggleEdit}
          >
            Go back to suggested titles
          </button>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleConfirm}
          disabled={!selectedTitle && !customTitle}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Continue with this title
        </Button>
      </div>
    </div>
  );
};

export default TitleSelection;
