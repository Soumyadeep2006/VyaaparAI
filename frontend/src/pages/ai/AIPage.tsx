import DashboardLayout from "../../components/layout/DashboardLayout";
import AIAssistant from "../../components/ai/AIAssistant";
import AIStats from "../../components/ai/AIStats";

export default function AIPage() {
  return (
    <DashboardLayout>

      <div className="space-y-8">

        <AIStats />

        <AIAssistant />

      </div>

    </DashboardLayout>
  );
}