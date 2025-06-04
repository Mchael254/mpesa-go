import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({ providedIn: 'root' })
export class PdfGeneratorService {
  async generatePdfFromElement(elementId: string) {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        console.error('Element not found!');
        return;
      }
  
      console.log('Element found:', element);
  
      // Clone the element
      const clonedElement = element.cloneNode(true) as HTMLElement;
  
     // Create a hidden container for rendering
const container = document.createElement('div');
container.style.position = 'fixed';
container.style.top = '0';
container.style.left = '0';
container.style.width = '100vw';
container.style.height = '100vh';
container.style.opacity = '0'; // fully hidden visually
container.style.zIndex = '-1'; // stays behind everything
container.style.pointerEvents = 'none';
container.style.overflow = 'hidden';

// Style cloned element
clonedElement.style.width = element.offsetWidth + 'px';
clonedElement.style.height = element.offsetHeight + 'px';
clonedElement.style.background = 'white';

// Append cloned element to hidden container
container.appendChild(clonedElement);
document.body.appendChild(container);

  
      // Wait a moment for it to render
      await new Promise(resolve => setTimeout(resolve, 100));
  
      const canvas = await html2canvas(clonedElement, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
        logging: true,
      });
  
      const imgData = canvas.toDataURL('image/png');
      console.log('Image data:', imgData);
  
      if (!imgData || imgData === 'data:,') {
        throw new Error('Canvas image data is empty');
      }
  
      const pdf = new jsPDF('p', 'mm', 'a4');
const pageWidth = pdf.internal.pageSize.getWidth();
const pageHeight = pdf.internal.pageSize.getHeight();

const imgWidth = canvas.width;
const imgHeight = canvas.height;

// scale canvas width to pdf width
const scaleRatio = pageWidth / imgWidth;
const pdfHeight = imgHeight * scaleRatio;

// calculate total pages
const totalPages = Math.ceil(pdfHeight / pageHeight);

for(let page = 0; page < totalPages; page++) {
  const srcY = (pageHeight / scaleRatio) * page;
  const srcHeight = Math.min(imgHeight - srcY, pageHeight / scaleRatio);

  // create a temporary canvas for each page slice
  const pageCanvas = document.createElement('canvas');
  pageCanvas.width = imgWidth;
  pageCanvas.height = srcHeight;
  const ctx = pageCanvas.getContext('2d');
  // draw the slice from original canvas to temporary canvas
  ctx.drawImage(canvas, 0, srcY, imgWidth, srcHeight, 0, 0, imgWidth, srcHeight);

  const pageData = pageCanvas.toDataURL('image/png');

  if(page > 0) {
    pdf.addPage();
  }
  pdf.addImage(pageData, 'PNG', 0, 0, pageWidth, srcHeight * scaleRatio);
}

pdf.save('report.pdf');

  
      // Cleanup
      document.body.removeChild(container);
    } catch (error) {
      console.error('PDF generation error:', error);
    }
  }
  
}
