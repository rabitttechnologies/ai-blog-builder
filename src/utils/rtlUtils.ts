
export const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export const isRTLLanguage = (languageCode: string): boolean => {
  return RTL_LANGUAGES.includes(languageCode);
};

export const getTextDirection = (languageCode: string): 'rtl' | 'ltr' => {
  return isRTLLanguage(languageCode) ? 'rtl' : 'ltr';
};

export const applyRTLStyles = (languageCode: string): Record<string, string> => {
  return {
    direction: getTextDirection(languageCode),
    textAlign: isRTLLanguage(languageCode) ? 'right' : 'left'
  };
};
