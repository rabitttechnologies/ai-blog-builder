
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({ 
  children, 
  onValueChange, 
  onChange, 
  ...props 
}) => {
  // Handle both onValueChange and onChange
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onValueChange) {
      onValueChange(e.target.value);
    }
    if (onChange) {
      onChange(e);
    }
  };
  
  return <select 
    onChange={handleChange} 
    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    {...props}
  >{children}</select>;
};

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export const SelectContent: React.FC<SelectContentProps> = ({ children, className = '' }) => {
  return <div className={`flex flex-col py-1 ${className}`}>{children}</div>;
};

interface SelectGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const SelectGroup: React.FC<SelectGroupProps> = ({ children, className = '' }) => {
  return <div className={`flex flex-col gap-1 p-1 ${className}`}>{children}</div>;
};

interface SelectItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  disabled?: boolean;
}

export const SelectItem: React.FC<SelectItemProps> = ({ children, value, className = '', disabled }) => {
  return <option value={value} className={className} disabled={disabled}>{children}</option>;
};

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, className = '', id }) => {
  return <div id={id} className={`flex items-center justify-between ${className}`}>{children}</div>;
};

interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder, className = '' }) => {
  return <span className={`overflow-hidden text-ellipsis whitespace-nowrap ${className}`}>{placeholder}</span>;
};
