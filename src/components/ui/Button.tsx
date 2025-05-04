
import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
  isLoading?: boolean;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled,
  rightIcon,
  leftIcon,
  asChild = false,
  ...props
}, ref) => {
  // Normalize variant names
  let normalizedVariant = variant;
  if (variant === 'primary') normalizedVariant = 'default';
  if (variant === 'secondary') normalizedVariant = 'outline';

  // Base classes
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  // Size classes
  const sizeClasses = {
    sm: 'h-9 px-3 text-xs',
    md: 'h-10 py-2 px-4',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10 p-2'
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
    ghost: 'bg-transparent hover:bg-gray-50',
  };

  // Width class
  const widthClass = fullWidth ? 'w-full' : '';

  // Combine all classes
  const allClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[normalizedVariant as keyof typeof variantClasses]} ${widthClass} ${className}`;

  // If asChild is true, we'd typically use a component like Slot from radix-ui
  // Since we don't have that, we'll just render the button with all props
  
  return (
    <button 
      className={allClasses} 
      disabled={disabled || isLoading} 
      ref={ref}
      {...props}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

// Export the buttonVariants helper for other components that need it
export const buttonVariants = ({
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
}: {
  variant?: 'default' | 'outline' | 'ghost' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
  className?: string;
} = {}) => {
  // Normalize variant names
  let normalizedVariant = variant;
  if (variant === 'primary') normalizedVariant = 'default';
  if (variant === 'secondary') normalizedVariant = 'outline';

  // Base classes
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  // Size classes
  const sizeClasses = {
    sm: 'h-9 px-3 text-xs',
    md: 'h-10 py-2 px-4',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10 p-2'
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
    ghost: 'bg-transparent hover:bg-gray-50',
  };

  // Width class
  const widthClass = fullWidth ? 'w-full' : '';

  return `${baseClasses} ${sizeClasses[size]} ${variantClasses[normalizedVariant as keyof typeof variantClasses]} ${widthClass} ${className}`;
};

export default Button;
