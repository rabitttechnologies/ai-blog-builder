
import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={`bg-white border rounded-lg shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardProps> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};
