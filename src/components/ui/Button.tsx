
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  let variantClasses = '';
  let sizeClasses = '';
  
  // Variant styles
  switch (variant) {
    case 'outline':
      variantClasses = 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50';
      break;
    case 'ghost':
      variantClasses = 'bg-transparent text-gray-700 hover:bg-gray-100';
      break;
    default:
      variantClasses = 'bg-blue-600 text-white hover:bg-blue-700';
  }
  
  // Size styles
  switch (size) {
    case 'sm':
      sizeClasses = 'py-1 px-3 text-sm';
      break;
    case 'lg':
      sizeClasses = 'py-3 px-6 text-lg';
      break;
    default:
      sizeClasses = 'py-2 px-4 text-base';
  }
  
  const buttonClasses = `font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses} ${sizeClasses} ${className}`;
  
  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};
