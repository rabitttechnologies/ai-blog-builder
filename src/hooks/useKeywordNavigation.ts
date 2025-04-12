
import { useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to handle keyword selection and navigation
 * Isolates the navigation logic to prevent side effects on other components
 * 
 * This implementation uses useRef instead of useState to prevent unnecessary
 * re-renders and avoid circular dependencies with the navigate function
 */
export const useKeywordNavigation = (isModalOpen: boolean) => {
  const pendingKeywordRef = useRef<string | null>(null);
  const navigate = useNavigate();
  
  // Use useCallback to ensure stable function reference
  const setPendingKeyword = useCallback((keyword: string | null) => {
    console.log("useKeywordNavigation - Setting pending keyword:", keyword);
    pendingKeywordRef.current = keyword;
  }, []);
  
  useEffect(() => {
    let timeoutId: number | null = null;
    
    // Only navigate when modal is closed AND we have a keyword
    if (!isModalOpen && pendingKeywordRef.current) {
      const keyword = pendingKeywordRef.current;
      console.log("useKeywordNavigation - Modal closed with pending keyword:", keyword);
      
      // Small delay to ensure any other state updates complete first
      timeoutId = window.setTimeout(() => {
        console.log("useKeywordNavigation - Executing navigation to:", `/blog/create?keyword=${keyword}`);
        navigate(`/blog/create?keyword=${encodeURIComponent(keyword)}`);
        pendingKeywordRef.current = null;
        console.log("useKeywordNavigation - Navigation completed and ref cleared");
      }, 50); // Slightly longer delay to ensure auth processes complete
    }
    
    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        console.log("useKeywordNavigation - Navigation cancelled by cleanup");
      }
    };
  }, [isModalOpen]); // Removed navigate from dependencies
  
  return { setPendingKeyword };
};
