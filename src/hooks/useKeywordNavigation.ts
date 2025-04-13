
import { useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to handle keyword selection and navigation
 * Uses refs to prevent race conditions and ensure reliable navigation
 */
export const useKeywordNavigation = (isModalOpen: boolean) => {
  const pendingKeywordRef = useRef<string | null>(null);
  const timeoutIdRef = useRef<number | null>(null);
  const modalStateRef = useRef<boolean>(isModalOpen);
  const navigate = useNavigate();
  
  // Update the ref whenever the modal state changes
  useEffect(() => {
    modalStateRef.current = isModalOpen;
  }, [isModalOpen]);
  
  // Use useCallback to ensure stable function reference
  const setPendingKeyword = useCallback((keyword: string | null) => {
    console.log("useKeywordNavigation - Setting pending keyword:", keyword);
    pendingKeywordRef.current = keyword;
    
    // Clear any existing timeout when setting a new keyword
    if (timeoutIdRef.current !== null) {
      window.clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, []);
  
  useEffect(() => {
    // Only schedule navigation when modal is closed AND we have a keyword
    if (!isModalOpen && pendingKeywordRef.current) {
      const keyword = pendingKeywordRef.current;
      console.log("useKeywordNavigation - Modal closed with pending keyword:", keyword);
      
      // Clear any existing timeout
      if (timeoutIdRef.current !== null) {
        window.clearTimeout(timeoutIdRef.current);
      }
      
      // Set a new timeout with increased duration for reliability
      timeoutIdRef.current = window.setTimeout(() => {
        // Double-check modal is still closed before navigating
        if (!modalStateRef.current && pendingKeywordRef.current === keyword) {
          console.log("useKeywordNavigation - Executing navigation to:", `/blog/create?keyword=${encodeURIComponent(keyword)}`);
          navigate(`/blog/create?keyword=${encodeURIComponent(keyword)}`);
          
          // Clear the pending keyword only after successful navigation
          pendingKeywordRef.current = null;
          timeoutIdRef.current = null;
          console.log("useKeywordNavigation - Navigation completed and refs cleared");
        } else {
          console.log("useKeywordNavigation - Navigation cancelled: modal reopened or keyword changed");
        }
      }, 300); // Increased from 150ms to 300ms for better reliability
    }
    
    // Cleanup function
    return () => {
      if (timeoutIdRef.current !== null) {
        window.clearTimeout(timeoutIdRef.current);
        console.log("useKeywordNavigation - Navigation cancelled by cleanup");
      }
    };
  }, [isModalOpen, navigate]);
  
  return { setPendingKeyword };
};
