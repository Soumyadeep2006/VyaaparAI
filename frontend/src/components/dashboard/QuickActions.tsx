import {
  Plus,
  FileText,
  Package,
  Users,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Card from "../common/Card";
import Button from "../common/Button";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card>
      <h2 className="mb-5 text-lg font-semibold text-text-primary">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {/* Invoice */}
        <Button
          onClick={() => navigate("/billing")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Invoice
        </Button>

        {/* Product */}
        <Button
          variant="secondary"
          onClick={() => navigate("/inventory")}
        >
          <Package className="mr-2 h-4 w-4" />
          Product
        </Button>

        {/* Customer */}
        <Button
          variant="secondary"
          onClick={() => navigate("/customers")}
        >
          <Users className="mr-2 h-4 w-4" />
          Customer
        </Button>

        {/* Report */}
        <Button
          variant="secondary"
          onClick={() => navigate("/reports")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Report
        </Button>

      </div>
    </Card>
  );
}
