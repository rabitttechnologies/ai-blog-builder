
import React, { useState } from 'react';

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  // Create a context object to pass down to children
  const context = {
    value: currentValue,
    onValueChange: handleValueChange,
  };

  // Clone children to pass the context
  const enhancedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, { context });
    }
    return child;
  });

  return (
    <div className={`tabs ${className}`} role="tablist">
      {enhancedChildren}
    </div>
  );
};

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
  context?: { value: string; onValueChange: (value: string) => void };
}

export const TabsList: React.FC<TabsListProps> = ({
  children,
  className = '',
  context,
}) => {
  // Clone children to pass the context
  const enhancedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, { context });
    }
    return child;
  });

  return (
    <div className={`tabs-list ${className}`} role="tablist">
      {enhancedChildren}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  context?: { value: string; onValueChange: (value: string) => void };
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className = '',
  context,
}) => {
  const handleClick = () => {
    if (context?.onValueChange) {
      context.onValueChange(value);
    }
  };

  const isActive = context?.value === value;

  return (
    <button
      className={`tabs-trigger ${isActive ? 'active' : ''} ${className}`}
      role="tab"
      aria-selected={isActive}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  context?: { value: string; onValueChange: (value: string) => void };
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className = '',
  context,
}) => {
  const isActive = context?.value === value;

  if (!isActive) {
    return null;
  }

  return (
    <div
      className={`tabs-content ${className}`}
      role="tabpanel"
      tabIndex={0}
    >
      {children}
    </div>
  );
};
