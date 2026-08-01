import { Download, FileSpreadsheet, Printer } from "lucide-react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  topProducts,
  recentTransactions,
} from "../../constants/reportsData";

export default function ExportButtons() {
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(topProducts);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Top Products"
    );

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([buffer]),
      "VyaparAI_Report.xlsx"
    );
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text("VyaparAI Business Report", 14, 18);

    autoTable(doc, {
      head: [["Product", "Sold", "Revenue"]],
      body: topProducts.map((item) => [
        item.name,
        item.sold,
        `₹${item.revenue}`,
      ]),
      startY: 30,
    });

    autoTable(doc, {
      head: [["Customer", "Amount", "Status"]],
      body: recentTransactions.map((item) => [
        item.customer,
        `₹${item.amount}`,
        item.status,
      ]),
      startY: 120,
    });

    doc.save("VyaparAI_Report.pdf");
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap gap-3">

      <button
        onClick={exportPDF}
        className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-white"
      >
        <Download size={18} />
        PDF
      </button>

      <button
        onClick={exportExcel}
        className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-white"
      >
        <FileSpreadsheet size={18} />
        Excel
      </button>

      <button
        onClick={printReport}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white"
      >
        <Printer size={18} />
        Print
      </button>

    </div>
  );
}