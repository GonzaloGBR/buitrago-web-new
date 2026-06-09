"use client";

import { useState } from "react";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";

export default function DownloadPdfButton({ orderId }: { orderId: string }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById("pdf-content");
      if (!element) return;

      // Forzamos temporalmente dimensiones proporcionales a un A4 para la captura
      const originalWidth = element.style.width;
      const originalMinHeight = element.style.minHeight;
      const originalPadding = element.style.padding;
      
      // 794x1123 es A4 a 96 DPI. Esto evita TODO recorte y garantiza el diseño vertical.
      element.style.width = '794px';
      element.style.minHeight = '1123px';
      element.style.padding = '3rem';

      const dataUrl = await toJpeg(element, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        skipFonts: true, // Evita errores CORS con Google Fonts
        filter: (node) => {
          if (node instanceof HTMLElement && node.dataset.hidePdf === "true") {
            return false;
          }
          if (node.tagName === 'IMG') {
            const img = node as HTMLImageElement;
            if (img.src && img.complete && img.naturalHeight === 0) {
              return false;
            }
          }
          return true;
        }
      });

      // Restauramos los estilos originales
      element.style.width = originalWidth;
      element.style.minHeight = originalMinHeight;
      element.style.padding = originalPadding;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Dibujamos la imagen ocupando toda la hoja A4
      pdf.addImage(dataUrl, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`pedido-${orderId.slice(-6).toUpperCase()}.pdf`);

    } catch (error: any) {
      console.error("Error generating PDF:", error);
      alert("Error al generar PDF: " + (error?.message || String(error)));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-900 h-9 px-4 py-2 shadow-sm disabled:opacity-50"
    >
      {isDownloading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-neutral-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generando...
        </span>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Descargar PDF
        </>
      )}
    </button>
  );
}
