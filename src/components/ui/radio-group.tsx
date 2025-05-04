
import React from 'react';

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ 
  children,
  className = '',
  value,
  onValueChange,
  disabled = false,
  ...props
}) => {
  const handleItemClick = (itemValue: string) => {
    if (!disabled && onValueChange) {
      onValueChange(itemValue);
    }
  };

  // Clone children to pass necessary props
  const enhancedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        isSelected: value === (child.props as any).value,
        onClick: () => handleItemClick((child.props as any).value),
        disabled
      });
    }
    return child;
  });

  return (
    <div 
      role="radiogroup" 
      className={`${className}`} 
      aria-disabled={disabled}
      {...props}
    >
      {enhancedChildren}
    </div>
  );
};

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  id?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  value,
  id,
  isSelected = false,
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  const radioClasses = `h-4 w-4 rounded-full border border-gray-300 ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`;
  
  return (
    <div 
      className={radioClasses}
      role="radio"
      aria-checked={isSelected}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {isSelected && (
        <div className="flex items-center justify-center h-full w-full">
          <div className="h-1.5 w-1.5 rounded-full bg-white" />
        </div>
      )}
    </div>
  );
};
