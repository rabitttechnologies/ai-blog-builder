
// Service for outline and customization webhook calls
const outlineCustomizeService = {
  // Submit the outline and customization selection to the webhook
  async submitOutlineCustomization(payload: any): Promise<any> {
    try {
      console.log('Submitting outline customization payload:', payload);
      
      // Add headers to address CORS issues
      const response = await fetch('https://n8n.agiagentworld.com/webhook/outlineandcustomise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        // Added mode to help with CORS issues
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Webhook error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Outline Customization Webhook Response:', data);
      
      // Handle the response structure - normalize it to always use the object format
      let responseData;
      
      if (Array.isArray(data)) {
        console.log('Response is an array, extracting first item');
        responseData = data.length > 0 ? data[0] : null;
      } else {
        console.log('Response is an object');
        responseData = data;
      }
      
      if (!responseData) {
        throw new Error('Invalid or empty response data');
      }
      
      return responseData;
    } catch (error) {
      console.error('Error submitting outline customization:', error);
      throw error;
    }
  },
  
  // Parse article outline from the response data
  parseArticleOutline(data: any): Array<{id: string, content: string}> {
    if (!data || !data.articleoutline || !Array.isArray(data.articleoutline)) {
      console.warn('No valid article outline data found');
      return [];
    }
    
    try {
      return data.articleoutline.map((item, index) => {
        // Extract the outline content - could be in outline1, outline2 properties
        const outlineKey = Object.keys(item)[0]; // Get first property (outline1, outline2, etc)
        const content = item[outlineKey] || '';
        
        return {
          id: `outline-${index + 1}`,
          content: content
        };
      });
    } catch (error) {
      console.error('Error parsing article outline:', error);
      return [];
    }
  }
};

export default outlineCustomizeService;
