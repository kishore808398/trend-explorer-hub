import { saveAs } from "file-saver";
import jsPDF from "jspdf";

export const exportChartAsImage = (chartRef: any, filename: string = "trends-chart") => {
  if (!chartRef?.current) return;
  
  const canvas = chartRef.current.canvas;
  canvas.toBlob((blob: Blob) => {
    saveAs(blob, `${filename}.png`);
  });
};

export const exportDataAsCSV = (data: any, keywords: string[], filename: string = "trends-data") => {
  if (!data) return;
  
  // Prepare CSV content
  const headers = ["Date", ...keywords];
  const rows = data.labels.map((label: string, index: number) => {
    const row = [label];
    data.datasets.forEach((dataset: any) => {
      row.push(dataset.data[index]);
    });
    return row;
  });
  
  const csvContent = [headers, ...rows]
    .map(row => row.join(","))
    .join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${filename}.csv`);
};

export const exportDataAsPDF = (data: any, keywords: string[], insights: any, filename: string = "trends-report") => {
  if (!data) return;
  
  const pdf = new jsPDF();
  
  // Title
  pdf.setFontSize(20);
  pdf.text("Google Trends Analysis Report", 20, 30);
  
  // Keywords
  pdf.setFontSize(14);
  pdf.text(`Keywords: ${keywords.join(", ")}`, 20, 50);
  
  // Insights
  if (insights) {
    pdf.setFontSize(12);
    pdf.text("Key Insights:", 20, 70);
    pdf.text(`• Peak Interest: ${insights.peakDay} (Score: ${insights.peakValue})`, 25, 85);
    pdf.text(`• Average Interest: ${insights.averageInterest.toFixed(1)}%`, 25, 100);
    pdf.text(`• Top Trending: ${insights.trendingKeyword}`, 25, 115);
  }
  
  // Data table
  pdf.text("Detailed Data:", 20, 140);
  let yPosition = 155;
  
  // Table headers
  pdf.text("Date", 20, yPosition);
  keywords.forEach((keyword, index) => {
    pdf.text(keyword, 60 + (index * 40), yPosition);
  });
  
  yPosition += 15;
  
  // Table data (first 20 rows to fit on page)
  const maxRows = Math.min(20, data.labels.length);
  for (let i = 0; i < maxRows; i++) {
    pdf.text(data.labels[i], 20, yPosition);
    data.datasets.forEach((dataset: any, datasetIndex: number) => {
      pdf.text(dataset.data[i].toString(), 60 + (datasetIndex * 40), yPosition);
    });
    yPosition += 15;
    
    // Start new page if needed
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }
  }
  
  pdf.save(`${filename}.pdf`);
};