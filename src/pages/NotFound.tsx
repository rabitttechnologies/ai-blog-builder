
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-4xl font-bold text-primary mb-6">404 - Page Not Found</h1>
      <p className="text-xl mb-8">The page you are looking for might have been removed or is temporarily unavailable.</p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
