
import { useLanguage } from '@/context/language/LanguageContext';
import { createLocalizedUrl, getLanguageFromPath } from '@/utils/languageUtils';
import { useLocation, useNavigate } from 'react-router-dom';

export const useLocalizedUrl = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLanguage, setLanguage } = useLanguage();

  /**
   * Update URL to reflect selected language and update language context
   * @param newLanguage Language code to switch to
   */
  const updateUrlLanguage = (newLanguage: string) => {
    const newPath = createLocalizedUrl(location.pathname, newLanguage);
    navigate(newPath);
    setLanguage(newLanguage);
  };

  /**
   * Get the language code from the current URL path
   * @returns Language code or 'en' if none found
   */
  const getCurrentPathLanguage = () => {
    return getLanguageFromPath(location.pathname) || 'en';
  };

  /**
   * Create a localized URL for the given path and language
   * @param path Target path
   * @param lang Language code (defaults to current language)
   * @returns Localized URL
   */
  const getLocalizedUrl = (path: string, lang = currentLanguage) => {
    return createLocalizedUrl(path, lang);
  };

  /**
   * Navigate to a path while maintaining the current language
   * @param path Target path
   */
  const navigateWithLanguage = (path: string) => {
    const localizedPath = createLocalizedUrl(path, currentLanguage);
    navigate(localizedPath);
  };

  return {
    updateUrlLanguage,
    getCurrentPathLanguage,
    getLocalizedUrl,
    navigateWithLanguage,
    currentPath: location.pathname,
    currentLanguage
  };
};
