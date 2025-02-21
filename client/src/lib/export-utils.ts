import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportToImage(elementId: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Create download link
    const link = document.createElement("a");
    link.download = "dating-profile.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.error("Failed to export image:", error);
  }
}

export async function exportToPDF(elementId: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    const imgData = canvas.toDataURL("image/png");

    // Calculate PDF dimensions based on profile aspect ratio
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? "portrait" : "landscape",
      unit: "mm",
    });

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("dating-profile.pdf");
  } catch (error) {
    console.error("Failed to export PDF:", error);
  }
}
