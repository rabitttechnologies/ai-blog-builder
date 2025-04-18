
import { useLanguage } from '@/context/language/LanguageContext';
import { createLocalizedUrl, getLanguageFromPath } from '@/utils/languageUtils';
import { useLocation, useNavigate } from 'react-router-dom';

export const useLocalizedUrl = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLanguage, setLanguage } = useLanguage();

  const updateUrlLanguage = (newLanguage: string) => {
    const newPath = createLocalizedUrl(location.pathname, newLanguage);
    navigate(newPath);
    setLanguage(newLanguage);
  };

  const getCurrentPathLanguage = () => {
    return getLanguageFromPath(location.pathname) || 'en';
  };

  return {
    updateUrlLanguage,
    getCurrentPathLanguage,
    currentPath: location.pathname
  };
};
