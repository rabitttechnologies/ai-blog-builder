
import { OutlineOption } from '@/types/outlineCustomize';

export const parseArticleOutline = (outlineText: string): OutlineOption['parsed'] => {
  // Parse headings from the markdown outline
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings = [];
  let match;
  
  while ((match = headingRegex.exec(outlineText)) !== null) {
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

export const formatOutlineOptions = (outlineArray: any[]): OutlineOption[] => {
  if (!outlineArray || !Array.isArray(outlineArray)) {
    console.warn('Invalid outline array:', outlineArray);
    return [];
  }

  return outlineArray.map((item, index) => {
    const outlineContent = item.outline1 || item.outline2 || '';
    return {
      id: `outline-${index}`,
      content: outlineContent,
      parsed: parseArticleOutline(outlineContent)
    };
  });
};

export const submitOutlineCustomization = async (payload: any): Promise<any> => {
  try {
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
