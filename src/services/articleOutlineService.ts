
import { useAuth } from '@/context/auth';

// Service for article outline webhook calls
const articleOutlineService = {
  async parseOutlineResponse(data: any) {
    console.log('Parsing outline response:', data);
    
    // Check if data is an array and extract first item if needed
    const normalizedData = Array.isArray(data) ? data[0] : data;
    
    // Enhanced logging for debugging
    console.log('Normalized data for outline:', normalizedData);
    
    if (!normalizedData || !normalizedData.articleoutline || !Array.isArray(normalizedData.articleoutline)) {
      console.warn('No valid article outline found in data');
      return [];
    }
    
    try {
      return normalizedData.articleoutline.map((item: any, index: number) => {
        // Get the first key in the object (typically outline1, outline2, etc.)
        const key = Object.keys(item)[0];
        return {
          id: `outline-${index + 1}`,
          content: item[key] || ''
        };
      });
    } catch (error) {
      console.error('Error parsing article outline:', error);
      return [];
    }
  },
  
  // Extract titles and descriptions from the response
  formatTitlesAndDescriptions(data: any) {
    console.log('Formatting titles and descriptions from data:', data);
    
    if (!data) {
      return { title: '', description: '' };
    }
    
    // Try to extract from titlesandShortDescription object
    if (data.titlesandShortDescription) {
      if (typeof data.titlesandShortDescription === 'object') {
        return {
          title: data.titlesandShortDescription.title || '',
          description: data.titlesandShortDescription.description || ''
        };
      }
    }
    
    // Direct properties
    return {
      title: data.title || '',
      description: data.description || ''
    };
  }
};

export default articleOutlineService;
