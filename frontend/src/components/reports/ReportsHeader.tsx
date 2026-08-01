import ExportButtons from "./ExportButtons";

export default function ReportsHeader() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

      <div>

        <h1 className="text-4xl font-bold">
          Reports & Analytics
        </h1>

        <p className="mt-2 text-text-secondary">
          Monitor revenue, profits and business performance.
        </p>

      </div>

      <ExportButtons />

    </div>
  );
}