
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to handle keyword selection and navigation
 * Isolates the navigation logic to prevent side effects on other components
 */
export const useKeywordNavigation = (isModalOpen: boolean) => {
  const [pendingKeyword, setPendingKeyword] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    let mounted = true;
    
    // Only navigate when modal is closed AND we have a keyword
    if (!isModalOpen && pendingKeyword && mounted) {
      console.log("useKeywordNavigation - Modal closed, navigating with keyword:", pendingKeyword);
      
      // Small delay to ensure any other state updates complete first
      setTimeout(() => {
        if (mounted) {
          navigate(`/blog/create?keyword=${encodeURIComponent(pendingKeyword)}`);
          setPendingKeyword(null);
        }
      }, 0);
    }
    
    return () => { mounted = false; };
  }, [isModalOpen, pendingKeyword, navigate]);
  
  return { setPendingKeyword };
};
