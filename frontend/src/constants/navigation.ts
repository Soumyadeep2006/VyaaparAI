import {
  LayoutDashboard,
  Boxes,
  ReceiptText,
  Users,
  Truck,
  BarChart3,
  Bot,
  Settings,
} from "lucide-react";

import type { NavigationItem } from "../types/navigation";

export const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Boxes,
  },
  {
    name: "Billing",
    href: "/billing",
    icon: ReceiptText,
  },
  {
    name: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    name: "Suppliers",
    href: "/suppliers",
    icon: Truck,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    name: "AI Assistant",
    href: "/ai",
    icon: Bot,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];