import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportToImages(): Promise<void> {
  const slides = document.querySelectorAll('.slide-page');
  if (!slides.length) return;

  try {
    let index = 1;
    for (const slide of slides) {
      const canvas = await html2canvas(slide as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Create download link for each slide
      const link = document.createElement("a");
      link.download = `dating-profile-page-${index}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      index++;
    }
  } catch (error) {
    console.error("Failed to export images:", error);
  }
}

export async function exportToPDF(): Promise<void> {
  const slides = document.querySelectorAll('.slide-page');
  if (!slides.length) return;

  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
    });

    let isFirstPage = true;
    for (const slide of slides) {
      const canvas = await html2canvas(slide as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");

      // Calculate dimensions to fit the page while maintaining aspect ratio
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (!isFirstPage) {
        pdf.addPage();
      }

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      isFirstPage = false;
    }

    pdf.save("dating-profile.pdf");
  } catch (error) {
    console.error("Failed to export PDF:", error);
  }
}