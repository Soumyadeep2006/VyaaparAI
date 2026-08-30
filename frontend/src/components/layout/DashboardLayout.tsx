import type { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AIAssistant from "../ai/AIAssistant";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--text)] transition-colors">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      <AIAssistant />
    </div>
  );
}
