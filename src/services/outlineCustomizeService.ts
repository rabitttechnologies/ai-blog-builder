
import { OutlineOption } from '@/types/outlineCustomize';

export const parseArticleOutline = (outlineText: string): OutlineOption['parsed'] => {
  if (!outlineText) {
    return { headings: [] };
  }
  
  // Normalize line breaks to ensure consistent parsing
  // Replace literal "\n" strings with actual line breaks
  const normalizedText = outlineText.replace(/\\n/g, '\n').trim();
  
  // Parse headings from the markdown outline
  const headingRegex = /^(#{1,6})\s+(.+?)(?:\s+\*\(.*?\)\*)?$/gm;
  const headings = [];
  let match;
  
  while ((match = headingRegex.exec(normalizedText)) !== null) {
    headings.push({
      level: match[1].length,
      title: match[2].trim()
    });
  }
  
  return { headings };
};

// Local storage functions for saving user guidance preferences
export const saveGeneralGuidance = (guidance: string): void => {
  try {
    const savedGuidance = getSavedGeneralGuidance();
    const updatedGuidance = [...savedGuidance, guidance];
    localStorage.setItem('savedGeneralGuidance', JSON.stringify(updatedGuidance));
  } catch (error) {
    console.error('Failed to save general guidance:', error);
  }
};

export const getSavedGeneralGuidance = (): string[] => {
  try {
    const savedGuidance = localStorage.getItem('savedGeneralGuidance');
    return savedGuidance ? JSON.parse(savedGuidance) : [];
  } catch (error) {
    console.error('Failed to retrieve general guidance:', error);
    return [];
  }
};

// Enhanced outline formatting function with improved handling of different response structures
export const formatOutlineOptions = (response: any): OutlineOption[] => {
  if (!response) {
    console.warn('No response data provided');
    return [];
  }
  
  console.log('Formatting outlines from response:', response);
  
  // Create array to store the formatted options
  const options: OutlineOption[] = [];
  
  // Try different possibilities for the outline data location
  
  // 1. Direct articleoutline access (lowercase)
  if (response.articleoutline && Array.isArray(response.articleoutline)) {
    console.log('Found articleoutline array in response (lowercase):', response.articleoutline);
    
    // Process array of objects with outline1, outline2 properties
    response.articleoutline.forEach((item: any, index: number) => {
      if (typeof item?.outline1 === 'string') {
        options.push({
          id: `outline-1`,
          content: item.outline1,
          parsed: parseArticleOutline(item.outline1)
        });
      }
      
      if (typeof item?.outline2 === 'string') {
        options.push({
          id: `outline-2`,
          content: item.outline2,
          parsed: parseArticleOutline(item.outline2)
        });
      }
      
      // Check for any other outline keys
      Object.keys(item || {}).forEach(key => {
        if (key.startsWith('outline') && key !== 'outline1' && key !== 'outline2' && typeof item[key] === 'string') {
          const outlineNumber = key.replace('outline', '');
          options.push({
            id: `outline-${outlineNumber}`,
            content: item[key],
            parsed: parseArticleOutline(item[key])
          });
        }
      });
    });
  }
  
  // 2. Try with uppercase 'articleOutline'
  else if (response.articleOutline && Array.isArray(response.articleOutline)) {
    console.log('Found articleOutline array in response (uppercase):', response.articleOutline);
    
    // Process array of objects with outline1, outline2 properties
    response.articleOutline.forEach((item: any, index: number) => {
      if (typeof item?.outline1 === 'string') {
        options.push({
          id: `outline-1`,
          content: item.outline1,
          parsed: parseArticleOutline(item.outline1)
        });
      }
      
      if (typeof item?.outline2 === 'string') {
        options.push({
          id: `outline-2`,
          content: item.outline2,
          parsed: parseArticleOutline(item.outline2)
        });
      }
      
      // Check for any other outline keys
      Object.keys(item || {}).forEach(key => {
        if (key.startsWith('outline') && key !== 'outline1' && key !== 'outline2' && typeof item[key] === 'string') {
          const outlineNumber = key.replace('outline', '');
          options.push({
            id: `outline-${outlineNumber}`,
            content: item[key],
            parsed: parseArticleOutline(item[key])
          });
        }
      });
    });
  }
  
  if (options.length > 0) {
    console.log('Successfully parsed outline options:', options);
    return options;
  } else {
    console.warn('No valid article outlines found in response');
    return [];
  }
};

export const submitOutlineCustomization = async (payload: any): Promise<any> => {
  try {
    console.log('Submitting outline customization payload:', payload);
    
    const response = await fetch('https://n8n.agiagentworld.com/webhook/outlineandcustomise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Webhook error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Outline Customization Response:', data);
    
    // Normalize response
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error('Error submitting outline customization:', error);
    throw error;
  }
};
