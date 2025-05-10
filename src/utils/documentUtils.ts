
import { saveAs } from 'file-saver';
import HTMLtoDOCX from 'html-to-docx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportAsHtml = (content: string, filename: string): void => {
  // Create a blob with HTML content
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  saveAs(blob, `${filename}.html`);
};

export const exportAsDocx = async (content: string, filename: string): Promise<void> => {
  try {
    // Convert HTML to DOCX
    const docxBlob = await HTMLtoDOCX(content, null, {
      title: filename,
      font: 'Arial',
    });
    
    saveAs(docxBlob, `${filename}.docx`);
  } catch (error) {
    console.error('Error exporting to DOCX:', error);
    throw error;
  }
};

export const exportAsPdf = async (elementId: string, filename: string): Promise<void> => {
  try {
    // Get the element to be converted
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID ${elementId} not found`);
    }
    
    // Convert element to canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false
    });
    
    // Canvas dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const heightLeft = imgHeight;
    
    // PDF initialization
    const pdf = new jsPDF('p', 'mm', 'a4');
    const position = 0;
    
    // Add image to PDF
    pdf.addImage(
      canvas.toDataURL('image/png', 1.0),
      'PNG',
      0,
      position,
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    );
    
    // Save PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};
