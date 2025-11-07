import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportPDFOptions {
  filename?: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter';
  quality?: number;
}

/**
 * Export a DOM element to PDF
 * @param element - The DOM element to export
 * @param options - Export options
 */
export async function exportToPDF(
  element: HTMLElement,
  options: ExportPDFOptions = {}
): Promise<void> {
  const {
    filename = 'export.pdf',
    orientation = 'portrait',
    format = 'a4',
    quality = 0.95,
  } = options;

  try {
    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png', quality);

    // Calculate dimensions
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if content is taller than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export PDF');
  }
}

/**
 * Export features dashboard to PDF
 */
export async function exportDashboardToPDF(
  projectName: string,
  viewName: string
): Promise<void> {
  const dashboardElement = document.querySelector('[data-export-pdf]') as HTMLElement;

  if (!dashboardElement) {
    throw new Error('Dashboard element not found');
  }

  const filename = `${projectName}-${viewName}-${new Date().toISOString().split('T')[0]}.pdf`;

  await exportToPDF(dashboardElement, {
    filename,
    orientation: viewName === 'gantt' ? 'landscape' : 'portrait',
    format: 'a4',
    quality: 0.95,
  });
}

/**
 * Export metrics to PDF
 */
export async function exportMetricsToPDF(projectName: string): Promise<void> {
  const metricsElement = document.querySelector('[data-export-pdf]') as HTMLElement;

  if (!metricsElement) {
    throw new Error('Metrics element not found');
  }

  const filename = `${projectName}-metrics-${new Date().toISOString().split('T')[0]}.pdf`;

  await exportToPDF(metricsElement, {
    filename,
    orientation: 'portrait',
    format: 'a4',
    quality: 0.95,
  });
}
