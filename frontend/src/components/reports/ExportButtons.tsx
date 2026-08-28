import { Download, FileSpreadsheet, Printer } from "lucide-react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useProductAnalytics, useRecentTransactions, useSalesReport } from "../../hooks/useReports";

export default function ExportButtons() {
  const { data: sales } = useSalesReport();
  const { data: products = [] } = useProductAnalytics();
  const { data: transactions = [] } = useRecentTransactions();

  const exportExcel = () => {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([
      { Metric: "Revenue", Value: sales?.total_sales ?? 0 },
      { Metric: "Orders", Value: sales?.total_orders ?? 0 },
      { Metric: "Paid Orders", Value: sales?.paid_orders ?? 0 },
      { Metric: "Pending Orders", Value: sales?.pending_orders ?? 0 },
    ]), "Summary");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(products), "Products");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(transactions), "Transactions");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "VyaparAI_Report.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("VyaparAI Business Report", 14, 18);
    doc.setFontSize(10);
    doc.text(`Revenue: ₹${Number(sales?.total_sales ?? 0).toLocaleString("en-IN")}`, 14, 26);
    doc.text(`Orders: ${sales?.total_orders ?? 0}   Paid: ${sales?.paid_orders ?? 0}   Pending: ${sales?.pending_orders ?? 0}`, 14, 32);
    autoTable(doc, { head: [["Product", "Sold", "Revenue"]], body: products.slice(0, 10).map((p: any) => [p.product, p.quantity, `₹${p.sales}`]), startY: 40 });
    autoTable(doc, { head: [["Customer", "Amount", "Status"]], body: transactions.slice(0, 10).map((t: any) => [t.customer, `₹${t.total}`, t.status]), startY: 110 });
    doc.save("VyaparAI_Report.pdf");
  };

  return <div className="flex flex-wrap gap-3"><button onClick={exportPDF} className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-white"><Download size={18}/>PDF</button><button onClick={exportExcel} className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-white"><FileSpreadsheet size={18}/>Excel</button><button onClick={() => window.print()} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white"><Printer size={18}/>Print</button></div>;
}
